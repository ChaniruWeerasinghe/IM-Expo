import React from "react";
import { db, auth } from "../firebase";
import { ref, push, set, get, update } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [user] = useAuthState(auth);

  const ensurePathExists = async (path) => {
    const node = ref(db, path);
    const snap = await get(node);
    if (!snap.exists()) {
      await set(node, { _init: true }); // create an empty marker node
    }
  };

  const normalizeId = (p) =>
    p?.id || p?.productId || p?.key || p?.slug || p?.uid || null;

  const fetchProductById = async (pid) => {
    try {
      const snap = await get(ref(db, `products/${pid}`));
      return snap.exists() ? { id: pid, ...snap.val() } : null;
    } catch {
      return null;
    }
  };

  const findSellerByUID = async (uid) => {
    if (!uid) return null;
    const direct = await get(ref(db, `users/sellers/${uid}`));
    if (direct.exists()) {
      const s = direct.val();
      return {
        sellerUID: uid,
        sellerName: s.name || s.displayName || s.companyName || "Seller",
        sellerEmail: s.email || "",
      };
    }
    const all = await get(ref(db, "users/sellers"));
    if (all.exists()) {
      for (const [key, s] of Object.entries(all.val())) {
        if (s?.uid === uid) {
          return {
            sellerUID: uid,
            sellerName: s.name || s.displayName || s.companyName || "Seller",
            sellerEmail: s.email || "",
          };
        }
      }
    }
    return null;
  };

  const findSellerByEmailOrName = async ({ email, name }) => {
    const all = await get(ref(db, "users/sellers"));
    if (!all.exists()) return null;
    for (const [key, s] of Object.entries(all.val())) {
      if (email && s?.email && s.email.toLowerCase() === email.toLowerCase()) {
        return {
          sellerUID: s.uid || key,
          sellerName: s.name || s.displayName || s.companyName || "Seller",
          sellerEmail: s.email || "",
        };
      }
      if (
        name &&
        s?.name &&
        s.name.trim().toLowerCase() === name.trim().toLowerCase()
      ) {
        return {
          sellerUID: s.uid || key,
          sellerName: s.name || s.displayName || s.companyName || "Seller",
          sellerEmail: s.email || "",
        };
      }
    }
    return null;
  };

  const handleContactSeller = async () => {
    if (!user) {
      alert("Please log in as a buyer to contact the seller.");
      return;
    }

    try {
      // 1️⃣ Make sure message branches exist
      await ensurePathExists("messages");
      await ensurePathExists("buyerMessages");

      // 2️⃣ Buyer info
      const buyerSnap = await get(ref(db, `users/buyers/${user.uid}`));
      const buyerData = buyerSnap.exists() ? buyerSnap.val() : {};
      const buyerName =
        buyerData.name || user.displayName || user.email.split("@")[0];
      const buyerEmail = buyerData.email || user.email;

      // 3️⃣ Product info
      const productId = normalizeId(product);
      let productData = { ...product, id: productId };
      if (productId) {
        const dbProd = await fetchProductById(productId);
        if (dbProd) productData = { ...dbProd };
      } else {
        alert("Cannot send message: product ID missing.");
        return;
      }

      // 4️⃣ Resolve seller
      let seller =
        (await findSellerByUID(
          productData.sellerUID ||
            productData.sellerUid ||
            productData.seller_id ||
            productData.seller?.uid
        )) ||
        (await findSellerByEmailOrName({
          email: productData.sellerEmail || product?.sellerEmail,
          name: productData.sellerName || product?.sellerName,
        }));

      if (!seller?.sellerUID) {
        alert("Cannot send message: product or seller info missing.");
        return;
      }

      // 5️⃣ Send message
      const msgRef = push(ref(db, `messages/${seller.sellerUID}`));
      const newMsg = {
        buyerUID: user.uid,
        buyerName,
        buyerEmail,
        productId: productData.id,
        productName: productData.name || "Unnamed Product",
        message: `Hello ${seller.sellerName}, I’m ${buyerName} (${buyerEmail}). I’m interested in your product "${
          productData.name || "Unnamed Product"
        }". Please share more details.`,
        timestamp: new Date().toISOString(),
        status: "unread",
      };
      await set(msgRef, newMsg);

      // 6️⃣ Mirror to buyerMessages for buyer inbox
      const buyerMsgRef = push(ref(db, `buyerMessages/${user.uid}`));
      await set(buyerMsgRef, {
        ...newMsg,
        fromSeller: seller.sellerName,
      });

      alert("✅ Your message has been sent to the seller!");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("❌ Failed to send message. Please try again later.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition h-full flex flex-col">
      {/* Product Image */}
      <img
        src={
          product.image ||
          product.imageURL ||
          product.productImage ||
          "/assets/placeholder.png"
        }
        alt={product.name}
        className="w-full h-48 object-cover"
      />

      {/* Card Content */}
      <div className="flex flex-col justify-between flex-1 p-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-800 mb-2 leading-tight">
            {product.name || "Unnamed Product"}
          </h3>
        </div>

        <div className="mt-auto">
          <p className="text-gray-600 text-sm mb-1">
            {product.category || "Uncategorized"}
          </p>
          <p className="text-sm text-gray-500 mb-3">
            Seller: {product.sellerName || "Unknown"}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleContactSeller}
              className="flex-1 bg-green-500 text-white text-sm font-medium px-4 py-1 rounded-lg shadow-sm hover:bg-green-600 hover:shadow-md transition-all duration-200"
            >
              Contact Seller
            </button>

            <Link
              to="/portfolio"
              className="flex-1 bg-blue-500 text-white text-sm font-medium px-4 py-1 rounded-lg shadow-sm hover:bg-blue-600 hover:shadow-md transition-all duration-200 text-center"
            >
              View Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
