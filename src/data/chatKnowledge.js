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







];

