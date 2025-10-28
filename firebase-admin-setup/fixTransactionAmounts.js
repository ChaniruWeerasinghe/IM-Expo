/**
 * fixTransactionAmounts.js (CommonJS)
 * ----------------------------------------
 * Fixes all Firebase transactions by ensuring:
 *   amount = price * quantity
 * ----------------------------------------
 */

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// ✅ Replace with your actual Firebase Realtime Database URL
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://im-expo-1e3fd-default-rtdb.firebaseio.com",
});

const db = admin.database();

async function fixTransactions() {
  console.log("🔄 Fetching all transactions...");

  const transRef = db.ref("transactions");
  const snapshot = await transRef.once("value");
  const data = snapshot.val();

  if (!data) {
    console.log("⚠️ No transactions found.");
    return;
  }

  let fixedCount = 0;

  for (const [id, t] of Object.entries(data)) {
    const price = Number(t.price || 0);
    const qty = Number(t.quantity || 1);
    const correctAmount = price * qty;

    if (t.amount !== correctAmount) {
      await transRef.child(id).update({ amount: correctAmount });
      console.log(`✅ Updated transaction ${id}: ${t.amount} → ${correctAmount}`);
      fixedCount++;
    }
  }

  console.log(`🎉 Done! Fixed ${fixedCount} transaction(s).`);
}

fixTransactions().catch((err) => {
  console.error("❌ Error fixing transactions:", err);
});
