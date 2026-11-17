// ===== EDIT THIS FILE (it is public, so never put secrets in it) =====
window.SHOP = {
  name: "Full-Stack Interview Vault: .NET + Angular",
  tagline: "Lesson-style study notes for senior .NET and Angular interviews",
  price: 149,                 // INR, shown on the page. Must match your Razorpay payment page/button
  offerLabel: "Launch price", // small label above the price; set "" to hide
  regularPrice: 0,            // optional: show a crossed-out price ONLY if you will really charge it later, e.g. 999
  reviews: [],                // REAL reviews only, e.g. { name: "Name", role: "SDE-2", company: "Company", text: "What they actually said" }
  currency: "INR",
  // Razorpay (no server needed). Use ONE of these:
  razorpayButtonId: "",       // e.g. "pl_Abc123XYZ" from Razorpay Dashboard > Payment Button
  api: "https://interview-vault-api.bhima-shankar-cse92.workers.dev",                    // Cloudflare Worker URL, e.g. https://interview-vault-api.YOURNAME.workers.dev
  paymentLink: "https://rzp.io/rzp/interview-vault",            // e.g. "https://rzp.io/l/yourlink" from Razorpay Dashboard > Payment Link / Page
  // Business details (Razorpay needs these on your legal pages)
  business: { legalName: "Bhimashankar", email: "bhimarh2020@gmail.com", phone: "+91 9008243293", address: "Yelahanka, Bangalore 560064, Karnataka, India", gstin: "" },
  refundDays: 7               // length of your refund window, used on the Refund page
};
