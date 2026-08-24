/* ai script to add tage to firesotre products
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// This script is located in server/scripts, so go up twice to QuickCart.
const projectRoot = path.resolve(__dirname, "../..");

const serviceAccountPath = path.join(
  projectRoot,
  "server",
  "secrets",
  "firebase-admin-key.json",
);

const tagsPath = path.join(
  projectRoot,
  "server",
  "data",
  "product-tags.txt",
);

// Without --apply, the script previews changes only.
const shouldApply = process.argv.includes("--apply");

function normalizeProductName(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function arraysAreEqual(first, second) {
  return first.length === second.length && first.every((tag, index) => tag === second[index]);
}

function readTags() {
  if (!fs.existsSync(tagsPath)) {
    throw new Error(`Tags file was not found:\n${tagsPath}`);
  }

  const tagsByName = new Map();
  const lines = fs.readFileSync(tagsPath, "utf8").split(/\r?\n/);

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // Blank lines and comments are allowed.
    if (!trimmedLine || trimmedLine.startsWith("#")) {
      return;
    }

    const separatorIndex = trimmedLine.indexOf(":");

    if (separatorIndex === -1) {
      throw new Error(
        `Invalid line ${index + 1}. Use this format:\nProduct Name: tag one, tag two`,
      );
    }

    const productName = trimmedLine.slice(0, separatorIndex).trim();
    const tagsText = trimmedLine.slice(separatorIndex + 1).trim();
    const normalizedName = normalizeProductName(productName);

    const tags = tagsText
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

    if (!normalizedName || tags.length === 0) {
      throw new Error(
        `Invalid line ${index + 1}. A product name and at least one tag are required.`,
      );
    }

    if (new Set(tags).size !== tags.length) {
      throw new Error(`Duplicate tag on line ${index + 1}: "${productName}"`);
    }

    if (tagsByName.has(normalizedName)) {
      throw new Error(
        `Duplicate product name in tags file on line ${index + 1}: "${productName}"`,
      );
    }

    tagsByName.set(normalizedName, tags);
  });

  if (tagsByName.size === 0) {
    throw new Error("No valid product tags were found in the tags file.");
  }

  return tagsByName;
}

function initializeFirebaseAdmin() {
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(`Firebase Admin key was not found:\n${serviceAccountPath}`);
  }

  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, "utf8"),
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  return admin.firestore();
}

async function updateProductTags() {
  try {
    const tagsByName = readTags();
    const db = initializeFirebaseAdmin();
    const snapshot = await db.collection("products").get();

    if (snapshot.empty) {
      console.log("The Firestore 'products' collection is empty.");
      return;
    }

    const updates = [];
    const unmatchedProducts = [];
    const usedTagNames = new Set();

    snapshot.docs.forEach((document) => {
      const product = document.data();
      const normalizedName = normalizeProductName(product.name);
      const tags = tagsByName.get(normalizedName);

      if (!normalizedName) {
        unmatchedProducts.push(`[Document ${document.id} has no product name]`);
        return;
      }

      if (!tags) {
        unmatchedProducts.push(product.name);
        return;
      }

      usedTagNames.add(normalizedName);

      const existingTags = Array.isArray(product.tags)
        ? product.tags.map((tag) => String(tag).trim().toLowerCase())
        : [];

      if (arraysAreEqual(existingTags, tags)) {
        return;
      }

      updates.push({ ref: document.ref, name: product.name, tags });
    });

    const unusedTagNames = [...tagsByName.keys()].filter(
      (name) => !usedTagNames.has(name),
    );

    console.log(`Products in Firestore: ${snapshot.size}`);
    console.log(`Tag entries loaded: ${tagsByName.size}`);
    console.log(`Products to add/update tags: ${updates.length}`);
    console.log(`Products without a matching tag entry: ${unmatchedProducts.length}`);
    console.log(`Tag entries without a matching Firestore product: ${unusedTagNames.length}\n`);

    if (updates.length > 0) {
      console.log("Planned updates:");
      updates.forEach(({ name, tags }) => console.log(`- ${name}: ${tags.join(", ")}`));
      console.log("");
    }

    if (unmatchedProducts.length > 0) {
      console.warn("Firestore products with no matching tag entry:");
      unmatchedProducts.forEach((name) => console.warn(`- ${name}`));
      console.log("");
    }

    if (unusedTagNames.length > 0) {
      console.warn("Tag entries with no matching Firestore product:");
      unusedTagNames.forEach((name) => console.warn(`- ${name}`));
      console.log("");
    }

    if (!shouldApply) {
      console.log(
        "Preview only: Firestore was not changed.\n" +
          "Review the output, then run again with --apply to save updates.",
      );
      return;
    }

    if (updates.length === 0) {
      console.log("No Firestore updates are needed.");
      return;
    }

    // Firestore supports a maximum of 500 writes per batch.
    const batchSize = 500;

    for (let index = 0; index < updates.length; index += batchSize) {
      const updatesInBatch = updates.slice(index, index + batchSize);
      const batch = db.batch();

      updatesInBatch.forEach(({ ref, tags }) => {
        batch.update(ref, { tags });
      });

      await batch.commit();
      console.log(
        `Saved batch ${Math.floor(index / batchSize) + 1}: ` +
          `${updatesInBatch.length} product tag update(s).`,
      );
    }

    console.log("Product tag update completed successfully.");
  } catch (error) {
    console.error("\nProduct tag update failed:");
    console.error(error.message);
    process.exitCode = 1;
  }
}

updateProductTags();
*/