// ===== EDIT THIS FILE (it is public, so never put secrets in it) =====
window.SHOP = {
  name: "Full-Stack Interview Vault: .NET + Angular",
  tagline: "Lesson-style study notes for senior .NET and Angular interviews",
  price: 999,                 // INR, shown on the page. Must match your Razorpay payment page/button
  currency: "INR",
  // Razorpay (no server needed). Use ONE of these:
  razorpayButtonId: "",       // e.g. "pl_Abc123XYZ" from Razorpay Dashboard > Payment Button
  paymentLink: "",            // e.g. "https://rzp.io/l/yourlink" from Razorpay Dashboard > Payment Link / Page
  // Business details (Razorpay needs these on your legal pages)
  business: { legalName: "YOUR NAME OR BUSINESS NAME", email: "you@example.com", phone: "", address: "City, State, India", gstin: "" },
  refundDays: 7               // length of your refund window, used on the Refund page
};
