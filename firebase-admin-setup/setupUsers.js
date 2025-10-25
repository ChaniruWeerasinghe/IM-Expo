// setupUsers.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // <-- Replace with your downloaded JSON

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://im-expo-1e3fd-default-rtdb.firebaseio.com"
});

const db = admin.database();

const sellers = [
  { name: "Seller 1", email: "seller1@gmail.com", password: "password123" },
  { name: "Seller 2", email: "seller2@gmail.com", password: "password123" },
  { name: "Seller 3", email: "seller3@gmail.com", password: "password123" },
  { name: "Seller 4", email: "seller4@gmail.com", password: "password123" },
  { name: "Seller 5", email: "seller5@gmail.com", password: "password123" },
];

const buyers = [
  { name: "Buyer 1", email: "buyer1@gmail.com", password: "password123" },
  { name: "Buyer 2", email: "buyer2@gmail.com", password: "password123" },
  { name: "Buyer 3", email: "buyer3@gmail.com", password: "password123" },
];

// Example products (20 products, 4 per seller)
const products = [
  // Seller 1 products
  { name: "Export Product 1A", category: "Food", price: 25, image: "https://via.placeholder.com/300", sellerEmail: "seller1@gmail.com" },
  { name: "Export Product 1B", category: "Clothing", price: 40, image: "https://via.placeholder.com/300", sellerEmail: "seller1@gmail.com" },
  { name: "Export Product 1C", category: "Handmade", price: 15, image: "https://via.placeholder.com/300", sellerEmail: "seller1@gmail.com" },
  { name: "Export Product 1D", category: "Art", price: 60, image: "https://via.placeholder.com/300", sellerEmail: "seller1@gmail.com" },

  // Seller 2 products
  { name: "Export Product 2A", category: "Food", price: 20, image: "https://via.placeholder.com/300", sellerEmail: "seller2@gmail.com" },
  { name: "Export Product 2B", category: "Clothing", price: 35, image: "https://via.placeholder.com/300", sellerEmail: "seller2@gmail.com" },
  { name: "Export Product 2C", category: "Handmade", price: 18, image: "https://via.placeholder.com/300", sellerEmail: "seller2@gmail.com" },
  { name: "Export Product 2D", category: "Art", price: 55, image: "https://via.placeholder.com/300", sellerEmail: "seller2@gmail.com" },

  // Seller 3 products
  { name: "Export Product 3A", category: "Food", price: 30, image: "https://via.placeholder.com/300", sellerEmail: "seller3@gmail.com" },
  { name: "Export Product 3B", category: "Clothing", price: 45, image: "https://via.placeholder.com/300", sellerEmail: "seller3@gmail.com" },
  { name: "Export Product 3C", category: "Handmade", price: 22, image: "https://via.placeholder.com/300", sellerEmail: "seller3@gmail.com" },
  { name: "Export Product 3D", category: "Art", price: 65, image: "https://via.placeholder.com/300", sellerEmail: "seller3@gmail.com" },

  // Seller 4 products
  { name: "Export Product 4A", category: "Food", price: 28, image: "https://via.placeholder.com/300", sellerEmail: "seller4@gmail.com" },
  { name: "Export Product 4B", category: "Clothing", price: 38, image: "https://via.placeholder.com/300", sellerEmail: "seller4@gmail.com" },
  { name: "Export Product 4C", category: "Handmade", price: 20, image: "https://via.placeholder.com/300", sellerEmail: "seller4@gmail.com" },
  { name: "Export Product 4D", category: "Art", price: 50, image: "https://via.placeholder.com/300", sellerEmail: "seller4@gmail.com" },

  // Seller 5 products
  { name: "Export Product 5A", category: "Food", price: 32, image: "https://via.placeholder.com/300", sellerEmail: "seller5@gmail.com" },
  { name: "Export Product 5B", category: "Clothing", price: 42, image: "https://via.placeholder.com/300", sellerEmail: "seller5@gmail.com" },
  { name: "Export Product 5C", category: "Handmade", price: 25, image: "https://via.placeholder.com/300", sellerEmail: "seller5@gmail.com" },
  { name: "Export Product 5D", category: "Art", price: 70, image: "https://via.placeholder.com/300", sellerEmail: "seller5@gmail.com" },
];

async function setup() {
  try {
    // Create sellers
    for (const s of sellers) {
      try {
        await admin.auth().getUserByEmail(s.email);
        console.log(`Seller already exists: ${s.email}`);
      } catch (err) {
        if (err.code === "auth/user-not-found") {
          const userRecord = await admin.auth().createUser({
            email: s.email,
            password: s.password,
            displayName: s.name,
          });
          console.log(`Created seller auth: ${s.email}`);
          await db.ref(`stats/${userRecord.uid}`).set({
            credits: 100,
            products: 4,
            transactions: 0,
            verified: "Pending",
          });
        }
      }
    }

    // Create buyers
    for (const b of buyers) {
      try {
        await admin.auth().getUserByEmail(b.email);
        console.log(`Buyer already exists: ${b.email}`);
      } catch (err) {
        if (err.code === "auth/user-not-found") {
          const userRecord = await admin.auth().createUser({
            email: b.email,
            password: b.password,
            displayName: b.name,
          });
          console.log(`Created buyer auth: ${b.email}`);
        }
      }
    }

    // Upload products
    for (const p of products) {
      const sellerUser = await admin.auth().getUserByEmail(p.sellerEmail);
      await db.ref(`products`).push({
        name: p.name,
        category: p.category,
        price: p.price,
        image: p.image,
        sellerId: sellerUser.uid,
        status: "active",
        creditsUsed: Math.floor(p.price / 2),
      });
    }

    console.log("Setup completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error setting up Firebase:", error);
  }
}

setup();
