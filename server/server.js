import "dotenv/config";

import cors from "cors";
import express from "express";
import Stripe from "stripe";

import { answerCatalogQuestion } from "./ai/ragService.js";

const app = express();
const port = 4242;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: clientOrigin,
  }),
);

// limit json payloads size to 20kb to prevent oversized payload attacks
app.use(express.json({ limit: "20kb" }));

const requestsByIp = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // Time window: 10 minutes in milliseconds
const MAX_REQUESTS_PER_WINDOW = 20;          // Max allowed requests per IP within the 10-minute window


function isRateLimited(ip) {
  const now = Date.now();
  const oldestAllowedTime = now - RATE_LIMIT_WINDOW_MS;

  // get the previous request timestamps for this exact ip address, keeping only those within the 10-minute window
  const recentRequests = (requestsByIp.get(ip) || []).filter(
    (time) => time > oldestAllowedTime,
  );

  // if user sent => 20 requests in the last 10 minutes, block the request
  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    requestsByIp.set(ip, recentRequests);
    return true;
  }

  // record current request timestamp and update memory 
  recentRequests.push(now);
  requestsByIp.set(ip, recentRequests);

  return false;
}

// rag chat endpoint
app.post("/api/ai/chat", async (req, res) => {
  const ip = req.ip;

  if (isRateLimited(ip)) {
    return res.status(429).json({
      error: "Too many AI requests. Please try again in a few minutes.",
    });
  }

  try {
    const { message, history } = req.body;
    const result = await answerCatalogQuestion(message, history);
    return res.json(result);
  } catch (error) {
    // check if error was caused by invalid user input bcz user input exception contains the word "question"
    const isClientError =
      error.message.includes("Question") ||
      error.message.includes("question") ||
      error.message.includes("text");

    if (isClientError) {
      return res.status(400).json({
        error: error.message,
      });
    }

    console.error("AI chat error:", error.message);

    // return 500 internal server error without leaking raw error lines
    return res.status(500).json({
      error: "The AI assistant could not answer right now. Please try again.",
    });
  }
});

// stripe endpoint
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: "Invalid payment amount",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe payment error:", error.message);

    return res.status(500).json({
      error: "Could not create payment",
    });
  }
});

app.listen(port, () => {
  console.log(`QuickCart server running on http://localhost:${port}`);
});