import "dotenv/config";

// class from firebase admin firestore to use special field values: vectors & server timestamps
import { FieldValue } from "firebase-admin/firestore";

import { getAdminDb } from "../ai/firebaseAdmin.js";
import { createProductEmbedding } from "../ai/geminiClient.js";
import { createRagHash, createRagText } from "../ai/productIndex.js";

export async function indexOneProduct(productDocument) {
  const product = productDocument.data();
  
  const ragText = createRagText(product);
  
  const ragTextHash = createRagHash(ragText);

  const embeddingModel = process.env.GEMINI_EMBEDDING_MODEL;
  const embeddingDimension = Number(process.env.GEMINI_EMBEDDING_DIMENSION);

  const isAlreadyIndexed =
    product.ragTextHash === ragTextHash &&
    product.embedding &&
    product.embeddingModel === embeddingModel &&
    product.embeddingDimension === embeddingDimension;

  // if product is alrady indexed, skip it
  if (isAlreadyIndexed) {
    return {
      id: productDocument.id,
      status: "skipped",
    };
  }

  const embedding = await createProductEmbedding(ragText);

  await productDocument.ref.update({
    ragText,
    ragTextHash,
    embedding: FieldValue.vector(embedding),
    embeddingModel,
    embeddingDimension,
    indexedAt: FieldValue.serverTimestamp(),
  });

  return {
    id: productDocument.id,
    status: "indexed",
  };
}

export async function indexAllProducts() {
  const db = getAdminDb();
  
  const productsSnapshot = await db.collection("products").get();

  // initialize summary 
  const summary = {
    total: productsSnapshot.size,
    indexed: 0,
    skipped: 0,
    failed: 0,
  };

  for (const productDocument of productsSnapshot.docs) {
    try {
      const result = await indexOneProduct(productDocument);

      if (result.status === "indexed") {
        summary.indexed += 1;
      }

      if (result.status === "skipped") {
        summary.skipped += 1;
      }

      console.log(`${result.status}: ${result.id}`);
    } catch (error) {
      summary.failed += 1;
      console.error(`failed: ${productDocument.id}`, error.message);
    }
  }

  return summary;
}

async function main() {
  const summary = await indexAllProducts();
  console.log("Indexing summary:", summary);

  if (summary.failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Indexing failed:", error.message);
  process.exitCode = 1;
});