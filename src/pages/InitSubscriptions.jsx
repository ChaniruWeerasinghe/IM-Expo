import { useEffect } from "react";
import { db } from "../firebase";
import { ref, set, get } from "firebase/database";

const InitSubscriptions = () => {
  useEffect(() => {
    const initSellerSubscriptions = async () => {
      const sellersSnap = await get(ref(db, "users/sellers"));
      if (!sellersSnap.exists()) return console.log("No sellers found");
      const sellers = sellersSnap.val();

      for (const uid in sellers) {
        const productsSnap = await get(ref(db, "products"));
        let productCount = 0;
        if (productsSnap.exists()) {
          const products = productsSnap.val();
          productCount = Object.values(products).filter(p => p.sellerUID === uid).length;
        }

        const maxFreeCredits = 5;
        const usedCredits = productCount;
        const remainingCredits = Math.max(maxFreeCredits - productCount, 0);

        await set(ref(db, `subscriptions/sellers/${uid}`), {
          plan: "Free",
          usedCredits,
          credits: remainingCredits,
          maxFreeCredits,
          planStart: new Date().toISOString(),
          planEnd: null,
          status: "active",
        });
        console.log(`Initialized subscription for seller ${uid} with ${remainingCredits} free credits`);
      }

      console.log("All seller subscriptions initialized!");
    };

    initSellerSubscriptions();
  }, []);

  return <p>Initializing seller subscriptions... check console.</p>;
};

export default InitSubscriptions;
