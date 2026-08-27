//create rag text of product and transform it into rag hash

const crypto = require("crypto");

function createRagText(product) {
  const name = product.name;
  const category = product.category;
  const price = product.price;
  const description = product.description;
  const tags = product.tags.sort().join(", ");

  return `Name: ${name}\nCategory: ${category}\nPrice: ${price.toFixed(2)} USD\nDescription: ${description}\nTags: ${tags}`;
}

function createRagHash(ragText) {
  return crypto.createHash("sha256").update(ragText).digest("hex");
}

function checkIfReindexingNeeded (product,currenthash){ // in case it isnt indexed, or text has changed
    if (!product.embedding){
        return true;
    }

    if (product.ragTextHash !== currenthash) {
        return true
    }

    return false;
}

module.exports = {
    createRagText,
    createRagHash,
    checkIfReindexingNeeded
};