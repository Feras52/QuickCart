const express = require("express");
const cors = require("cors"); //allows react to talk to this backend
const Stripe = require("stripe"); //lets server talk to stripe using secret key
require("dotenv").config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json()); // lets the backend understand json data sent from react

app.post("/create-payment-intent", async(req,res) => {
    try{
        const {amount} = req.body; // == const amout = req.body.amount;

        if (!amount || amount <= 0){
            return res.status(400).json({error:"Invalid payment amount"}); // 400: front sent invalid data
        }

        const paymentIntent = await stripe.paymentIntents.create({ //create new payment attempt + it creates client_secret
            amount: Math.round(amount * 100), //convert to smallest currency(cents) , (stripe like it that way)
            currency: "usd",
            automatic_payment_methods: {enabled:true,},
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    }
    catch (error) {
        res.status(500).json({
            error:"Could not create payment",
        });
    }
});

app.listen(4242, () => {
    console.log("Stripe payment server on localhost 4242");
});