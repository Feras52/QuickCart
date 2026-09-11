// create rag text of product and transform it into rag hash

import { createHash } from "node:crypto";

export function createRagText(product) {
  const name = product.name;
  const category = product.category;
  const price = product.price;
  const description = product.description;
  const tags = product.tags ? product.tags.sort().join(", ") : "";

  return `Name: ${name}\nCategory: ${category}\nPrice: ${price.toFixed(2)} USD\nDescription: ${description}\nTags: ${tags}`;
}

export function createRagHash(ragText) {
  return createHash("sha256").update(ragText).digest("hex");
}

export function checkIfReindexingNeeded(product, currenthash) { // in case it isnt indexed, or text has changed
  if (!product.embedding) {
    return true;
  }

  if (product.ragTextHash !== currenthash) {
    return true;
  }

  return false;
}