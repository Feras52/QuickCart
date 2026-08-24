/* ai script to add description to firestore products
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// This script is located in: server/scripts/
// Go up twice to reach the QuickCart project root.
const projectRoot = path.resolve(__dirname, "../..");

const serviceAccountPath = path.join(
  projectRoot,
  "server",
  "secrets",
  "firebase-admin-key.json",
);

const descriptionsPath = path.join(
  projectRoot,
  "server",
  "data",
  "product-descriptions.txt",
);

// Run with --apply to write changes.
// Without it, the script only previews proposed updates.
const shouldApply = process.argv.includes("--apply");

function normalizeProductName(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function readDescriptions() {
  if (!fs.existsSync(descriptionsPath)) {
    throw new Error(
      `Descriptions file was not found:\n${descriptionsPath}`,
    );
  }

  const lines = fs.readFileSync(descriptionsPath, "utf8").split(/\r?\n/);
  const descriptionsByName = new Map();

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // Allow blank lines and comments beginning with #.
    if (!trimmedLine || trimmedLine.startsWith("#")) {
      return;
    }

    const separatorIndex = trimmedLine.indexOf(":");

    if (separatorIndex === -1) {
      throw new Error(
        `Invalid line ${index + 1}. Use this format:\nProduct Name: Description`,
      );
    }

    const productName = trimmedLine.slice(0, separatorIndex).trim();
    const description = trimmedLine.slice(separatorIndex + 1).trim();
    const normalizedName = normalizeProductName(productName);

    if (!normalizedName || !description) {
      throw new Error(
        `Invalid line ${index + 1}. Both product name and description are required.`,
      );
    }

    if (descriptionsByName.has(normalizedName)) {
      throw new Error(
        `Duplicate product name in descriptions file on line ${index + 1}: "${productName}"`,
      );
    }

    descriptionsByName.set(normalizedName, description);
  });

  if (descriptionsByName.size === 0) {
    throw new Error("No valid descriptions were found in the descriptions file.");
  }

  return descriptionsByName;
}

function initializeFirebaseAdmin() {
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(
      `Firebase Admin key was not found:\n${serviceAccountPath}`,
    );
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

async function updateProductDescriptions() {
  try {
    const descriptionsByName = readDescriptions();
    const db = initializeFirebaseAdmin();

    console.log(
      `Loaded ${descriptionsByName.size} descriptions from:\n${descriptionsPath}\n`,
    );

    const snapshot = await db.collection("products").get();

    if (snapshot.empty) {
      console.log("The Firestore 'products' collection is empty.");
      return;
    }

    const matchedUpdates = [];
    const unmatchedProducts = [];
    const usedDescriptionNames = new Set();

    snapshot.docs.forEach((document) => {
      const product = document.data();
      const normalizedName = normalizeProductName(product.name);
      const description = descriptionsByName.get(normalizedName);

      if (!normalizedName) {
        unmatchedProducts.push(`[Document ${document.id} has no product name]`);
        return;
      }

      if (!description) {
        unmatchedProducts.push(product.name);
        return;
      }

      usedDescriptionNames.add(normalizedName);

      // Do not overwrite an identical description.
      if (product.description === description) {
        return;
      }

      matchedUpdates.push({
        ref: document.ref,
        name: product.name,
        description,
      });
    });

    const unusedDescriptions = [...descriptionsByName.keys()].filter(
      (name) => !usedDescriptionNames.has(name),
    );

    console.log(`Products in Firestore: ${snapshot.size}`);
    console.log(`Descriptions to add/update: ${matchedUpdates.length}`);
    console.log(`Products without a matching description: ${unmatchedProducts.length}`);
    console.log(`Descriptions without a matching Firestore product: ${unusedDescriptions.length}\n`);

    if (matchedUpdates.length > 0) {
      console.log("Planned updates:");

      matchedUpdates.forEach(({ name, description }) => {
        console.log(`- ${name}: ${description}`);
      });

      console.log("");
    }

    if (unmatchedProducts.length > 0) {
      console.warn("Firestore products with no matching description:");
      unmatchedProducts.forEach((name) => console.warn(`- ${name}`));
      console.log("");
    }

    if (unusedDescriptions.length > 0) {
      console.warn("Descriptions with no matching Firestore product:");
      unusedDescriptions.forEach((name) => console.warn(`- ${name}`));
      console.log("");
    }

    if (!shouldApply) {
      console.log(
        "Preview only: Firestore was not changed.\n" +
          "Review the output, then run again with --apply to save updates.",
      );
      return;
    }

    if (matchedUpdates.length === 0) {
      console.log("No Firestore updates are needed.");
      return;
    }

    // Firestore batches support up to 500 writes.
    const batchSize = 500;

    for (let index = 0; index < matchedUpdates.length; index += batchSize) {
      const updatesInBatch = matchedUpdates.slice(index, index + batchSize);
      const batch = db.batch();

      updatesInBatch.forEach(({ ref, description }) => {
        batch.update(ref, { description });
      });

      await batch.commit();

      console.log(
        `Saved batch ${Math.floor(index / batchSize) + 1}: ` +
          `${updatesInBatch.length} product description(s).`,
      );
    }

    console.log("Description update completed successfully.");
  } catch (error) {
    console.error("\nDescription update failed:");
    console.error(error.message);
    process.exitCode = 1;
  }
}

updateProductDescriptions();

*/