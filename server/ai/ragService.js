import { getAdminDb } from "./firebaseAdmin.js";

import {
  createQuestionEmbedding,
  generateCatalogAnswer,
} from "./geminiClient.js";

const MAX_QUESTION_LENGTH = 500;

const MAX_HISTORY_MESSAGES = 6;

const PRODUCT_LIMIT = 5;

const MAX_COSINE_DISTANCE = 0.7;

function validateQuestion(question) {
  if (typeof question !== "string") {
    throw new Error("Question must be text.");
  }

  const cleanedQuestion = question.trim();

  if (!cleanedQuestion) {
    throw new Error("Question cannot be empty.");
  }

  if (cleanedQuestion.length > MAX_QUESTION_LENGTH) {
    throw new Error(
      `Question cannot be longer than ${MAX_QUESTION_LENGTH} characters.`,
    );
  }

  return cleanedQuestion;
}

function cleanHistory(history) {
  // return an empty list if history isnt an array
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    // Filter out malformed messages: keep only "user" or "assistant" role objects with valid non-empty text
    .filter(
      (message) =>
        message &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.text === "string" &&
        message.text.trim(),
    )
    // Slice the array to keep only the last 6 messages
    .slice(-MAX_HISTORY_MESSAGES)
    // Map each message to a clean, standardized format and trim text lengths
    .map((message) => ({
      role: message.role,
      text: message.text.trim().slice(0, MAX_QUESTION_LENGTH),
    }));
}

//Transforms a raw Firestore document snapshot into a clean, safe product object.
 
function toSafeProduct(document) {
  const product = document.data();

  return {
    id: document.id,
    name: product.name,
    price: product.price,
    category: product.category,
    imageUrl: product.imageUrl,
    description: product.description ?? "",
    tags: product.tags ?? [],               
  };
}

//Takes a shopper's question, turns it into a vector, and queries firestore for matching products.
export async function findRelevantProducts(question) {
  const cleanedQuestion = validateQuestion(question);

  const queryVector = await createQuestionEmbedding(cleanedQuestion);

  const db = getAdminDb();

  // vector search using Firestore's built-in vector query
  const searchSnapshot = await db
    .collection("products")
    .findNearest({
      vectorField: "embedding",               
      queryVector,                            
      limit: PRODUCT_LIMIT,                   
      distanceMeasure: "COSINE",              
      distanceThreshold: MAX_COSINE_DISTANCE, 
    })
    .get();

  // convert firestore document snapshots into clean product objects for the frontend
  return searchSnapshot.docs.map(toSafeProduct);
}

//Executes the complete RAG loop (Validate -> Search Firestore -> Prompt Gemini -> Return Result)
export async function answerCatalogQuestion(question, history = []) {
  const cleanedQuestion = validateQuestion(question);
  const cleanedHistory = cleanHistory(history);

  const products = await findRelevantProducts(cleanedQuestion);

  if (products.length === 0) {
    return {
      answer:
        "I could not find a matching product in the current QuickCart catalog.",
      products: [],
    };
  }

  // send the question, chat history & matched product data to gemini to write the response
  const answer = await generateCatalogAnswer(
    cleanedQuestion,
    products,
    cleanedHistory,
  );

  return {
    answer,
    products,
  };
}