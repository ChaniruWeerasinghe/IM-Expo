const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://im-expo-1e3fd-default-rtdb.firebaseio.com" 
});

const db = admin.database();

async function clearAllUsers() {
  console.log("Starting fresh: Clearing all users from Auth and Database...");

  try {
    // 1. List and Delete all users from Firebase Auth
    let users = await admin.auth().listUsers();
    while (users.users.length > 0) {
      const uids = users.users.map((u) => u.uid);
      await admin.auth().deleteUsers(uids);
      console.log(`Deleted ${uids.length} users from Auth.`);
      
      if (users.pageToken) {
        users = await admin.auth().listUsers(1000, users.pageToken);
      } else {
        break;
      }
    }

    // 2. Clear the 'users' node in Realtime Database
    await db.ref("users").remove();
    console.log("Cleared all user data from Realtime Database.");

    console.log("Fresh start complete. You can now register new users.");
    process.exit(0);
  } catch (error) {
    console.error("Error clearing users:", error);
    process.exit(1);
  }
}

clearAllUsers();
