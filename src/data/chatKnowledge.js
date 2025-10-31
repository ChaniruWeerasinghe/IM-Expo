// Controlled IM-Expo knowledge the AI can cite from.
// Add/expand freely without redeploying backend.
export const intents = [
    // -------------------------------
    // 1️⃣ GREETINGS & SMALL TALK
    // -------------------------------
    {
        id: "greeting_basic",
        examples: [
            "hi", "hello", "hey", "hii", "heyy", "heyy there", "yo", "hiya",
            "good morning", "good afternoon", "good evening",
            "what’s up", "sup", "hey assistant", "hi there",
            "hellooo", "helloo", "hey imexpo", "hi imexpo", "hi bot",
            "morning", "evening", "hello friend", "hi friend",
            "howdy", "hi again", "hi buddy", "hi bro", "hey team"
        ],
        answer:
            "Hi! 👋 I’m the IM-Expo Assistant. Ask me about uploading products, subscriptions, verification, boosts, or finding verified buyers.",
    },

    {
        id: "greeting_followup",
        examples: [
            "how are you", "how r u", "how’s it going", "how are you doing",
            "how do you feel", "you good", "how r things", "what’s new",
            "how’s everything", "are you ok", "are you there", "you alive",
            "you around", "what are you doing", "hey what’s up"
        ],
        answer:
            "I’m great and ready to help! 😊 Tell me what you’d like to know — maybe uploading products or checking your verification?",
    },

    {
        id: "greeting_response_positive",
        examples: [
            "im good", "i’m fine", "doing good", "all good", "great",
            "awesome", "fine thanks", "very well", "cool", "super",
            "thanks im good", "thanks fine", "good good"
        ],
        answer:
            "Glad to hear that! 🎉 Now, what would you like to do on IM-Expo — upload, explore, or check your plan?",
    },

    {
        id: "greeting_response_negative",
        examples: [
            "not good", "bad", "sad", "tired", "bored", "not fine", "not great",
            "feeling low", "sick", "stressed", "depressed", "unhappy"
        ],
        answer:
            "I’m sorry to hear that 😔. Maybe exploring some creative products on IM-Expo could cheer you up. Want me to show how?",
    },

    {
        id: "thanks_or_appreciation",
        examples: [
            "thanks", "thank you", "thx", "tysm", "tq", "thanks a lot", "appreciate",
            "thanks buddy", "thank you so much", "you helped", "cheers"
        ],
        answer:
            "You’re very welcome! 💚 I’m here anytime you need help with IM-Expo.",
    },

    {
        id: "bot_identity",
        examples: [
            "who are you", "what is your name", "are you human",
            "are you a bot", "are you ai", "who built you", "tell me about you"
        ],
        answer:
            "I’m the IM-Expo Assistant — your friendly helper for everything related to our trade platform. Built to guide buyers and sellers easily!",
    },

    {
        id: "general_help",
        examples: [
            "help", "can you help", "i need help", "help me",
            "assist me", "support", "i need support", "how can you help",
            "what can you do", "show help options"
        ],
        answer:
            "Of course! I can help you upload products, check verification, explore plans, or understand boosts. What would you like to know first?",
    },

    {
        id: "goodbye",
        examples: [
            "bye", "goodbye", "see ya", "see you later", "ttyl",
            "good night", "take care", "catch you later", "talk later"
        ],
        answer:
            "Bye for now 👋 — come back anytime if you want to explore products or need IM-Expo guidance!",
    },

    {
        id: "compliments",
        examples: [
            "you are nice", "you are smart", "good bot", "awesome bot",
            "you are cool", "you are great", "you are the best",
            "love you bot", "like you", "you are friendly"
        ],
        answer:
            "Aww, thanks! 💚 I’m happy to help — let’s make your IM-Expo experience smooth and simple!",
    },

    {
        id: "smalltalk_jokes",
        examples: [
            "tell me a joke", "make me laugh", "say something funny",
            "tell a fun fact", "say a joke", "funny bot"
        ],
        answer:
            "Hmm 😄 okay! Why did the seller bring a ladder to IM-Expo? Because they wanted to reach new heights in export!",
    },

    // -------------------------------
    // 2️⃣ UPLOAD / PRODUCT MANAGEMENT
    // -------------------------------
    {
        id: "upload_start",
        examples: [
            "how to upload", "how can i upload", "upload product", "add my product",
            "publish item", "post my work", "show my products", "upload new product",
            "where to upload", "how do i post", "add listing", "submit product",
            "product upload page", "want to add my product"
        ],
        answer:
            "To upload your product, go to your **Seller Dashboard → Add Products**. Fill in the details and images, then click **Publish**. Each upload uses 1 credit.",
    },

    {
        id: "upload_rules",
        examples: [
            "upload rules", "file size limit", "image size", "what are upload limits",
            "how many products can i add", "upload restrictions", "upload limit"
        ],
        answer:
            "Free users can publish 1 product. Paid plans give more credits — for example, Basic = 5 credits, Pro = 10 credits, and so on.",
    },

    {
        id: "edit_product",
        examples: [
            "edit product", "update listing", "change my product", "edit uploaded item",
            "modify details", "how to edit product", "update price", "edit description"
        ],
        answer:
            "Open your **Seller Dashboard → My Products**, choose the product, click **Edit**, then save your changes.",
    },

    {
        id: "delete_product",
        examples: [
            "delete product", "remove product", "unpublish item", "hide listing",
            "take down my product"
        ],
        answer:
            "In your **Seller Dashboard → My Products**, click the trash 🗑 icon or ‘Unpublish’. That restores the credit to your account if it’s unused.",
    },

    {
        id: "product_visibility",
        examples: [
            "why my product not visible", "cant see my product", "product not showing",
            "my listing disappeared", "product not found"
        ],
        answer:
            "New uploads are reviewed briefly before going live. Also check if your subscription credits are active or expired.",
    },

    {
        id: "product_images",
        examples: [
            "add images", "photo upload", "product picture", "upload image error",
            "image guidelines", "how many photos", "product photo size"
        ],
        answer:
            "You can upload up to 5 images per product (under 5 MB each, JPG/PNG). Clear, bright photos get more buyer clicks!",
    },

    {
        id: "product_categories",
        examples: [
            "choose category", "select category", "which category", "add category",
            "category missing", "product type", "where to select category"
        ],
        answer:
            "When adding a product, choose the category from the dropdown (e.g., Food & Beverages, Handicrafts, Home Goods). This helps buyers discover you easily.",
    },

    {
        id: "product_pricing",
        examples: [
            "set price", "price my product", "add price", "how to price item",
            "currency change", "pricing options"
        ],
        answer:
            "Enter your product price in LKR or USD when uploading. Buyers can request export quotations directly through IM-Expo.",
    },

    {
        id: "product_publish_approval",
        examples: [
            "need approval", "product pending", "waiting for approval",
            "when will my product be approved", "approval time"
        ],
        answer:
            "Products usually go live within 24 hours after quick verification by the IM-Expo team.",
    },

    {
        id: "product_best_practices",
        examples: [
            "how to get more views", "my product not selling", "increase sales",
            "tips for upload", "make my product attractive", "best way to post product"
        ],
        answer:
            "Use bright images, detailed descriptions, clear pricing, and tags like ‘eco-friendly’ or ‘handmade’. Boost plans also increase visibility.",
    },


    // -------------------------------
    // 3️⃣  SUBSCRIPTIONS / PLANS / CREDITS
    // -------------------------------
    {
        id: "plans_overview",
        examples: [
            "plans", "subscription plans", "pricing", "show plans", "what are the plans",
            "available packages", "subscription options", "plans list",
            "how much", "membership", "membership types", "subscription tiers"
        ],
        answer:
            "IM-Expo offers flexible plans: Free (1 credit), Basic (5 credits), Pro (10 credits), and Premium (20 credits). Higher plans unlock more uploads, verified-status eligibility, and visibility boosts."
    },

    {
        id: "credit_system",
        examples: [
            "what is credit", "credits meaning", "how credits work", "how many credits",
            "credit system", "upload credits", "1 credit meaning", "credits usage",
            "credit limit", "credit balance"
        ],
        answer:
            "Credits represent your upload allowance — 1 credit = 1 product you can publish. Your remaining credits show inside the Seller Dashboard."
    },

    {
        id: "plan_upgrade",
        examples: [
            "upgrade plan", "change plan", "go to higher plan", "upgrade subscription",
            "buy more credits", "need more credits", "add credits", "increase uploads"
        ],
        answer:
            "Go to Subscriptions → Select Plan → Upgrade. Payments accept card or mobile methods. Extra credits activate instantly after confirmation."
    },

    {
        id: "plan_downgrade_cancel",
        examples: [
            "cancel plan", "stop subscription", "downgrade", "end plan",
            "pause subscription", "turn off auto renew", "unsubscribe"
        ],
        answer:
            "You can cancel or downgrade anytime from Subscriptions → Manage Plan. Your remaining active days stay valid until the period ends."
    },

    {
        id: "plan_payment_methods",
        examples: [
            "how to pay", "payment options", "payment methods", "card payment",
            "mobile pay", "bank transfer", "pay via card", "how do i pay subscription"
        ],
        answer:
            "IM-Expo supports card, mobile, or credit-deduction payments. Select your preferred option during checkout on the Subscriptions page."
    },

    {
        id: "plan_renewal",
        examples: [
            "renew plan", "plan expired", "renew subscription", "extend plan",
            "plan renewal date", "when does plan expire", "reactivate plan"
        ],
        answer:
            "Plans renew manually. When credits reach 0 or the plan expires, visit Subscriptions and click ‘Renew’. Unused credits remain active within the period."
    },

    {
        id: "free_plan_limit",
        examples: [
            "free plan", "is it free", "free upload", "free trial", "how many free products",
            "upload for free", "free credit"
        ],
        answer:
            "The Free plan includes 1 credit — you can publish 1 product at no cost to try the platform. Upgrade anytime to add more products and visibility."
    },

    {
        id: "plan_benefits",
        examples: [
            "plan benefits", "what do i get", "why upgrade", "benefits of plans",
            "why pro plan", "premium plan features"
        ],
        answer:
            "Upgrading increases product slots, search ranking, verification eligibility, and featured placement — helping you reach more buyers."
    },

    {
        id: "plan_support",
        examples: [
            "issue with plan", "plan not working", "credits not added",
            "payment failed", "plan bug", "subscription error"
        ],
        answer:
            "If credits didn’t appear after payment, refresh your dashboard. If the issue persists, contact support@im-expo.com with your UID and transaction ID."
    },

    {
        id: "plan_info_request",
        examples: [
            "tell me about subscriptions", "explain plans", "how subscription works",
            "what is subscription", "explain credits"
        ],
        answer:
            "Subscriptions control your upload limit and visibility. Each plan adds a set number of credits and optional verified-status eligibility."
    },


    // -------------------------------
    // 4️⃣  VERIFICATION / TRUST / BADGES
    // -------------------------------
    {
        id: "verification_overview",
        examples: [
            "what is verification", "what is verified", "im expo verified",
            "verified badge", "how verification works", "explain verification",
            "verified system", "verified title"
        ],
        answer:
            "IM-Expo Verification is our trust badge for sellers and buyers who’ve proven reliability through successful transactions or verified documentation."
    },

    {
        id: "how_to_get_verified",
        examples: [
            "how to get verified", "how can i be verified", "how to become verified",
            "i want verified badge", "apply for verification", "get verification",
            "become verified member"
        ],
        answer:
            "Complete 10 successful transactions or submit your business documents for review. Once approved, you’ll see the IM-Expo Verified badge on your profile and products."
    },

    {
        id: "verification_benefits",
        examples: [
            "benefits of verification", "why verified", "what do i get if verified",
            "verified advantages", "why become verified", "is verification useful"
        ],
        answer:
            "Verified members gain trust, higher search rankings, and extra visibility on the home and Discover pages — buyers prefer verified profiles."
    },

    {
        id: "verification_buyer",
        examples: [
            "buyer verification", "verify buyer", "can buyers get verified",
            "how buyers verified", "buyer badge"
        ],
        answer:
            "Yes — buyers with official import permits can become Verified Buyers. They can show their badge after submitting the necessary permit details."
    },

    {
        id: "verification_seller",
        examples: [
            "seller verification", "verify seller", "how sellers verified",
            "seller badge", "how to verify my seller account"
        ],
        answer:
            "Sellers are verified through consistent successful transactions and manual admin review of business information and uploaded documents."
    },

    {
        id: "verification_pending",
        examples: [
            "verification pending", "waiting for verification", "how long verification takes",
            "verification delay", "verification approval time"
        ],
        answer:
            "Verification reviews usually complete within 24–48 hours. If it’s been longer, check your email or contact support@im-expo.com."
    },

    {
        id: "verification_requirements",
        examples: [
            "verification requirements", "documents for verification", "what do i need to verify",
            "needed docs", "required papers", "proof for verification"
        ],
        answer:
            "We require a valid ID or business registration certificate and basic profile information. Everything is kept confidential and secure."
    },

    {
        id: "verification_lost",
        examples: [
            "lost my badge", "badge missing", "verification gone", "no badge showing",
            "badge disappeared"
        ],
        answer:
            "If your verified badge is missing, check your subscription status and recent transactions. Badges can temporarily hide if a plan expires or you switch accounts."
    },

    {
        id: "verification_check",
        examples: [
            "check verification status", "am i verified", "is my account verified",
            "how to see if verified"
        ],
        answer:
            "Visit your Dashboard → Profile Settings to see your verification status. If approved, you’ll see a green ‘Verified’ badge."
    },

    {
        id: "verification_support",
        examples: [
            "verification problem", "verification not working", "cant get verified",
            "verification failed", "issue with verification"
        ],
        answer:
            "If you faced a verification issue, email support@im-expo.com with your UID and any error screenshots. The team will resolve it within 24 hours."
    },



    // -------------------------------
    // 5️⃣  BOOSTS / PROMOTIONS / VISIBILITY
    // -------------------------------
    {
        id: "boost_overview",
        examples: [
            "what is boost", "boost product", "promotion", "how to promote",
            "how boosting works", "feature my product", "advertise product",
            "boost visibility", "boost system", "boost info"
        ],
        answer:
            "Boosts let you promote your product for more visibility on the homepage, Discover page, and category listings. You can choose durations like 1, 7, or 30 days."
    },

    {
        id: "boost_how_to",
        examples: [
            "how to boost", "how can i boost", "boost my listing", "activate boost",
            "enable promotion", "where to find boost", "boost option"
        ],
        answer:
            "Go to your **Seller Dashboard → My Products → Boost Product**. Choose the duration (1 / 7 / 30 days) and payment method to activate your promotion."
    },

    {
        id: "boost_payment",
        examples: [
            "boost payment", "pay for boost", "boost cost", "how much is boost",
            "promotion price", "boost pricing", "boost plan", "boost charge"
        ],
        answer:
            "Boost pricing depends on duration: 1 day = small fee, 7 days = discounted bundle, 30 days = best value. Pay using card, mobile, or subscription credits."
    },

    {
        id: "boost_duration",
        examples: [
            "boost length", "how long boost lasts", "boost duration", "how many days boost",
            "when boost ends", "boost expiry"
        ],
        answer:
            "You can select boost durations of 1 day, 7 days, or 30 days. After expiry, you can renew or extend directly from your dashboard."
    },

    {
        id: "boost_benefits",
        examples: [
            "why boost", "boost benefits", "why promote", "advantages of boost",
            "what happens if i boost"
        ],
        answer:
            "Boosting gives your product a prime spot on IM-Expo listings, increasing buyer clicks, inquiries, and transaction chances."
    },

    {
        id: "boost_status",
        examples: [
            "boost status", "is my boost active", "check boost", "boost expired",
            "when will boost start", "boost pending"
        ],
        answer:
            "Check your **Boost Dashboard** or the product card tag. Status labels show Active, Upcoming, or Expired depending on the schedule."
    },

    {
        id: "boost_auto",
        examples: [
            "auto renew boost", "repeat boost", "automatic boost", "renew promotion automatically"
        ],
        answer:
            "Auto-renew for boosts will arrive soon! For now, you can re-activate manually once a boost ends."
    },

    {
        id: "boost_refund",
        examples: [
            "boost refund", "cancel boost", "stop promotion", "boost cancel", "money back boost"
        ],
        answer:
            "Boost payments are non-refundable once activated, but you can pause or change duration before confirming payment."
    },

    {
        id: "boost_tips",
        examples: [
            "how to get more views", "boost tips", "promotion advice", "how to attract buyers",
            "best boost time", "increase reach"
        ],
        answer:
            "Use boosts during weekends or holidays when traffic peaks. Combine them with updated descriptions and clear product images for best results."
    },

    {
        id: "boost_support",
        examples: [
            "boost not working", "promotion issue", "boost failed", "cant boost", "boost problem"
        ],
        answer:
            "If your boost didn’t activate, check your internet or credit balance. If the issue continues, contact support@im-expo.com with your product ID."
    },


    // -------------------------------
    // 6️⃣  TRANSACTIONS / ORDERS / PAYMENTS
    // -------------------------------
    {
        id: "transaction_overview",
        examples: [
            "transactions", "my orders", "check orders", "see transactions",
            "order history", "trade history", "past transactions", "order list"
        ],
        answer:
            "View all your trade activity under **Transactions / Orders**. It shows ongoing orders, completed ones, and payment summaries for each product."
    },

    {
        id: "transaction_start",
        examples: [
            "how to buy", "how to order", "make purchase", "start transaction",
            "contact seller to buy", "place order"
        ],
        answer:
            "Buyers can open a product page and click **Request Import / Contact Seller** to start a transaction. Both parties then confirm details before payment."
    },

    {
        id: "transaction_tracking",
        examples: [
            "track order", "track transaction", "where is my order",
            "order status", "transaction status", "shipping status"
        ],
        answer:
            "Go to **Transactions → Ongoing Orders**. You’ll see each order’s progress, payment confirmation, and shipment updates once provided by the seller."
    },

    {
        id: "transaction_complete",
        examples: [
            "complete order", "finish transaction", "mark as done",
            "confirm delivery", "close transaction"
        ],
        answer:
            "After delivery is confirmed, click **Mark as Complete**. Both buyer and seller receive confirmation, and credits update automatically."
    },

    {
        id: "transaction_dispute",
        examples: [
            "dispute", "problem with order", "wrong product", "not received",
            "report issue", "transaction dispute"
        ],
        answer:
            "Use **Transactions → Report Issue** to file a dispute. Include your order ID and details; our support team will mediate within 48 hours."
    },

    {
        id: "payment_methods",
        examples: [
            "payment options", "how to pay", "payment method", "card payment",
            "mobile payment", "bank transfer", "pay securely"
        ],
        answer:
            "IM-Expo supports card, mobile, or wallet payments. Choose your preferred method during checkout; all payments are processed securely."
    },

    {
        id: "payment_failed",
        examples: [
            "payment failed", "payment error", "card declined", "transaction failed",
            "money not deducted", "payment not working"
        ],
        answer:
            "If payment fails, double-check your card or mobile wallet. Unsuccessful payments don’t deduct credits — retry after a few minutes or contact support."
    },

    {
        id: "invoice_request",
        examples: [
            "invoice", "need invoice", "get bill", "receipt", "download invoice"
        ],
        answer:
            "Invoices are automatically generated for every successful transaction. Download them from **Transactions → Completed Orders → Invoice PDF**."
    },

    {
        id: "refund_request",
        examples: [
            "refund", "money back", "return payment", "cancel transaction",
            "get refund"
        ],
        answer:
            "Refunds are possible only for cancelled orders before shipment. Use **Transactions → Cancel Order** and note your reason; approved refunds credit within 3–5 days."
    },

    {
        id: "transaction_support",
        examples: [
            "transaction issue", "order problem", "payment issue",
            "cant see my orders", "transaction bug"
        ],
        answer:
            "If your order isn’t showing or an amount looks wrong, refresh your dashboard. For persistent issues, email support@im-expo.com with your UID and order ID."
    },





    // -------------------------------
    // 7️⃣  BUYER QUESTIONS / EXPLORE / DISCOVER
    // -------------------------------
    {
        id: "buyer_explore_products",
        examples: [
            "find products", "browse products", "explore items", "discover products",
            "product list", "where to find products", "how to explore", "find sellers",
            "show me products", "look for products", "find verified sellers"
        ],
        answer:
            "Buyers can explore all published items in the **Discover** section or the **Buyer Dashboard → Explore Products**. You can filter by category, location, or verified sellers."
    },

    {
        id: "buyer_contact_seller",
        examples: [
            "contact seller", "message seller", "chat with seller",
            "reach seller", "send message", "talk to seller", "ask seller"
        ],
        answer:
            "Open any product page and click **Contact Seller**. You can send inquiries, negotiate prices, or request more information directly through IM-Expo."
    },

    {
        id: "buyer_verified_sellers",
        examples: [
            "verified sellers", "trust sellers", "how to check seller",
            "is seller verified", "safe sellers", "find verified suppliers"
        ],
        answer:
            "Verified sellers display the green **IM-Expo Verified** badge. You can filter by verified sellers on the Discover page for trustworthy partners."
    },

    {
        id: "buyer_import_permission",
        examples: [
            "import permission", "how to get permission", "apply for import",
            "import license", "export permission", "buyer permit"
        ],
        answer:
            "Buyers with official import or export permits can submit them through their profile to become Verified Buyers. This builds trust and unlocks extra features."
    },

    {
        id: "buyer_favorites",
        examples: [
            "save product", "add to favorites", "bookmark item",
            "save later", "wishlist"
        ],
        answer:
            "Click the ⭐ icon on any product to save it to your Favorites. You can access all saved items under **Buyer Dashboard → Favorites.**"
    },

    {
        id: "buyer_reviews",
        examples: [
            "leave review", "rate seller", "give feedback", "review product",
            "how to rate"
        ],
        answer:
            "After a completed order, buyers can rate sellers and leave feedback in **Transactions → Completed Orders → Leave Review.**"
    },

    {
        id: "buyer_support",
        examples: [
            "buyer issue", "cant find products", "problem buying", "buyer support",
            "buyer help", "buyer question"
        ],
        answer:
            "For buyer-related questions, visit **Contact Us** or email support@im-expo.com. The team assists with orders, payments, or account access."
    },

    {
        id: "buyer_security",
        examples: [
            "is it safe", "secure buying", "trusted platform", "safe transactions",
            "scam protection", "secure payments"
        ],
        answer:
            "Yes! IM-Expo verifies all users and processes payments through secure gateways. Always trade with verified members for maximum safety."
    },

    {
        id: "buyer_notifications",
        examples: [
            "notifications", "alerts", "updates", "email updates",
            "new product alerts", "order alerts"
        ],
        answer:
            "Enable notifications in your **Buyer Dashboard → Settings** to get instant updates about orders, new products, or offers from verified sellers."
    },

    {
        id: "buyer_filter_search",
        examples: [
            "filter", "search", "find by category", "search products",
            "how to filter", "find by location", "advanced search"
        ],
        answer:
            "Use the search bar or filter controls on the Discover page to narrow results by category, price, country, or verified status."
    },




    // -------------------------------
    // 8️⃣  SELLER SUPPORT / DASHBOARD / ANALYTICS
    // -------------------------------
    {
        id: "seller_dashboard_overview",
        examples: [
            "seller dashboard", "my dashboard", "seller home", "open dashboard",
            "dashboard overview", "how dashboard works", "where is dashboard"
        ],
        answer:
            "Your **Seller Dashboard** is your workspace — it lets you upload, edit, track sales, view analytics, and manage subscriptions all in one place."
    },

    {
        id: "seller_manage_products",
        examples: [
            "manage products", "view my uploads", "see my products",
            "check listings", "edit uploads"
        ],
        answer:
            "Go to **Seller Dashboard → My Products** to view, edit, or delete listings. You’ll also see which items are boosted or pending approval."
    },

    {
        id: "seller_analytics",
        examples: [
            "analytics", "product views", "see stats", "track views",
            "product analytics", "dashboard analytics", "view performance"
        ],
        answer:
            "Open **Dashboard → Analytics** to see views, clicks, boosts, and completed transactions — helping you understand what sells best."
    },

    {
        id: "seller_messages",
        examples: [
            "buyer messages", "check messages", "new inquiries",
            "contact requests", "chat requests"
        ],
        answer:
            "All buyer messages appear under **Dashboard → Inbox**. Respond promptly to increase your verified-status score and conversion chances."
    },

    {
        id: "seller_transactions",
        examples: [
            "seller transactions", "my sales", "sales history",
            "track sales", "seller orders"
        ],
        answer:
            "See your completed and pending sales in **Dashboard → Transactions.** Each record shows buyer info, amount, and verification status."
    },

    {
        id: "seller_subscription_status",
        examples: [
            "check my plan", "subscription status", "how many credits left",
            "remaining credits", "plan info", "active plan"
        ],
        answer:
            "In **Dashboard → Subscription**, you can view active plan details, remaining credits, and renewal dates."
    },

    {
        id: "seller_support",
        examples: [
            "seller help", "issue with dashboard", "cant upload", "seller problem",
            "seller question", "support seller"
        ],
        answer:
            "If you’re facing seller-side issues, visit **Contact Us** or email support@im-expo.com with your UID and a short description. Our team usually replies within 24 hours."
    },

    {
        id: "seller_withdrawal",
        examples: [
            "withdraw money", "get paid", "payment withdrawal",
            "seller payment", "receive money"
        ],
        answer:
            "Once a buyer confirms delivery, your earnings appear in **Dashboard → Wallet**. You can withdraw via linked bank or mobile payment."
    },

    {
        id: "seller_profile_update",
        examples: [
            "update profile", "edit company info", "change seller name",
            "update contact", "profile edit"
        ],
        answer:
            "Head to **Dashboard → Profile Settings** to update name, contact, address, or business details. Keeping data accurate helps verification."
    },

    {
        id: "seller_performance_tips",
        examples: [
            "improve sales", "increase orders", "seller tips",
            "grow business", "how to sell better"
        ],
        answer:
            "Use clear photos, detailed descriptions, and respond fast to buyer messages. Regular boosts and verified status also grow visibility."
    },











    // -------------------------------
    // 9️⃣  TECHNICAL HELP / ERRORS / ACCOUNT ISSUES
    // -------------------------------
    {
        id: "account_login",
        examples: [
            "cant login", "login problem", "forgot password",
            "password reset", "sign in error", "login not working",
            "account access issue", "forgot my password"
        ],
        answer:
            "Click **Forgot Password** on the Login page and follow the reset link sent to your email. If you still can’t access your account, contact support@im-expo.com."
    },

    {
        id: "account_signup",
        examples: [
            "cant sign up", "signup issue", "register problem",
            "error creating account", "account creation failed"
        ],
        answer:
            "Ensure all required fields are filled and your email isn’t already registered. If it still fails, clear cache and retry or email support@im-expo.com."
    },

    {
        id: "account_update",
        examples: [
            "update email", "change password", "edit account", "update account info",
            "change details", "edit profile"
        ],
        answer:
            "You can update your email, password, and details under **Dashboard → Profile Settings.** Remember to save changes before leaving."
    },

    {
        id: "technical_bug",
        examples: [
            "website not loading", "site slow", "page error",
            "something not working", "site issue", "bug report",
            "error message", "crash problem"
        ],
        answer:
            "Try refreshing your browser or clearing cache. If the problem continues, take a screenshot and send it to support@im-expo.com for review."
    },

    {
        id: "upload_error",
        examples: [
            "upload not working", "cant upload", "image error",
            "product not uploading", "upload failed", "error uploading"
        ],
        answer:
            "Check that your images are under 5 MB and JPG/PNG format. Slow internet can also interrupt uploads. If it keeps failing, email support@im-expo.com."
    },

    {
        id: "payment_error",
        examples: [
            "payment bug", "payment not working", "error paying",
            "cant pay", "payment gateway error", "checkout problem"
        ],
        answer:
            "If payment fails, ensure your card or wallet has funds and try again. No charges apply for failed attempts. Persistent errors → contact support."
    },

    {
        id: "notification_issue",
        examples: [
            "no notifications", "not getting emails", "no alerts",
            "notifications missing", "email not received"
        ],
        answer:
            "Check your spam folder and verify your email address in Settings. You can also re-enable notifications in your Dashboard preferences."
    },

    {
        id: "browser_support",
        examples: [
            "which browser", "browser issue", "mobile not working",
            "app not loading", "desktop issue"
        ],
        answer:
            "IM-Expo works best on Chrome, Edge, or Safari (latest versions). On mobile, open via browser instead of embedded apps like Facebook."
    },

    {
        id: "account_delete",
        examples: [
            "delete account", "remove my account", "close account",
            "how to delete account", "erase my data"
        ],
        answer:
            "We’re sorry to see you go! Send a request to support@im-expo.com with your registered email. Your data will be deleted within 48 hours."
    },

    {
        id: "other_support",
        examples: [
            "other issue", "something else", "different problem",
            "need more help", "human support"
        ],
        answer:
            "No worries! You can reach our human support anytime via the **Contact Us** page or email support@im-expo.com with your UID and issue summary."
    },
];

