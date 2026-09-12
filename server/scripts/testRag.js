import "dotenv/config";

import { answerCatalogQuestion } from "../ai/ragService.js";

const question = process.argv.slice(2).join(" ").trim();

if (!question) {
  console.error('Usage: npm run test:rag -- "your question here"');
  process.exitCode = 1;
} else {
  try {
    const result = await answerCatalogQuestion(question);

    console.log("\nAnswer:\n");
    console.log(result.answer);

    console.log("\nMatched products:\n");
    console.table(
      result.products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
      })),
    );
  } catch (error) {
    console.error("\nRAG test failed:\n");
    console.error(error.message);
    process.exitCode = 1;
  }
}