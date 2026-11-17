(function(){
const S=window.SHOP,T=window.STATS||{};document.title=S.name;
const $=id=>document.getElementById(id);
document.querySelectorAll('[data-s]').forEach(n=>{n.textContent=({name:S.name,price:'₹'+S.price.toLocaleString('en-IN'),days:S.refundDays,email:S.business.email})[n.dataset.s]||T[n.dataset.s]||''});
const pay=$('pay');
if(S.razorpayButtonId){const f=document.createElement('form');const s=document.createElement('script');s.src='https://checkout.razorpay.com/v1/payment-button.js';s.async=true;s.dataset.payment_button_id=S.razorpayButtonId;f.appendChild(s);pay.appendChild(f)}
else if(S.paymentLink){pay.innerHTML='<a class="btn" href="'+S.paymentLink+'" rel="noopener">Pay ₹'+S.price.toLocaleString('en-IN')+' securely with Razorpay</a>'}
else pay.innerHTML='<span class="note">Payments are being set up. Please check back soon, or write to '+S.business.email+'.</span>';
})();
