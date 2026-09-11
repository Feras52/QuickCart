import { GoogleGenAI } from "@google/genai";

export async function createProductEmbedding(ragText) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_EMBEDDING_MODEL;
  const dimension = Number(process.env.GEMINI_EMBEDDING_DIMENSION);

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  if (!model) {
    throw new Error("GEMINI_EMBEDDING_MODEL is missing.");
  }

  if (!Number.isInteger(dimension) || dimension <= 0) {
    throw new Error("GEMINI_EMBEDDING_DIMENSION must be a positive integer.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.embedContent({
    model,
    contents: ragText,
    config: {
      outputDimensionality: dimension,
    },
  });

  const embedding = response.embeddings?.[0]?.values;

  if (!Array.isArray(embedding) || embedding.length !== dimension) {
    throw new Error(
      `Gemini returned an invalid embedding. Expected ${dimension} values.`,
    );
  }

  return embedding;
}