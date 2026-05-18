import React, { useState } from 'react';

export default function CartView({ items, total, userData }) {
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  
  const [showPointsInput, setShowPointsInput] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState('');
  
  const [digitalReceipt, setDigitalReceipt] = useState(true);
  const [activePaymentMethod, setActivePaymentMethod] = useState(null); // null, 'mpesa', 'paypal', 'pesapal'

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950 p-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-zinc-950">
      
      {/* Total Amount */}
      <div className="bg-gradient-to-br from-[#E5B4B2] to-[#B76E79] p-4 rounded-2xl shadow-lg shadow-[#B76E79]/10 text-white flex justify-between items-center flex-shrink-0">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Total Amount</div>
          <div className="text-2xl font-extrabold tracking-tight">KSh {total}</div>
        </div>
        <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
          {items.length} Items
        </div>
      </div>

      {/* Conditional Rendering for Payment Methods */}
      {activePaymentMethod === 'mpesa' ? (
        /* M-Pesa Page - Green and Black Theme */
        <div className="bg-black border-2 border-[#00E676] rounded-[2rem] p-6 space-y-6 transition-all animate-[slideIn_0.3s_ease-out]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#00E676] rounded-full flex items-center justify-center font-bold text-black">M</div>
              <h2 className="text-xl font-extrabold text-[#00E676]">M-Pesa</h2>
            </div>
            <button 
              onClick={() => setActivePaymentMethod(null)}
              className="text-white/70 hover:text-white text-xs font-bold"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Phone Number</label>
              <input 
                type="tel" 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm text-white mt-1 focus:border-[#00E676] focus:outline-none" 
                placeholder="07xxxxxxxx" 
                defaultValue={userData.phone || ''}
              />
            </div>

            <button className="w-full bg-[#00E676] text-black font-extrabold py-3.5 rounded-xl hover:bg-[#00C853] transition-colors shadow-lg shadow-[#00E676]/20">
              Pay KSh {total}
            </button>
            
            <p className="text-[10px] text-slate-500 text-center">You will receive an STK push on your phone.</p>
          </div>
        </div>
      ) : activePaymentMethod === 'pesapal' ? (
        /* Pesapal Page - Blue and Creamy White Theme */
        <div className="bg-[#FDFBF7] border-2 border-[#00A8E8] rounded-[2rem] p-6 space-y-6 transition-all animate-[slideIn_0.3s_ease-out]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#00A8E8" strokeWidth="2" className="w-6 h-6"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
              <h2 className="text-xl font-extrabold text-[#00A8E8]">Pesapal</h2>
            </div>
            <button 
              onClick={() => setActivePaymentMethod(null)}
              className="text-slate-500 hover:text-slate-800 text-xs font-bold"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Card Number</label>
              <input 
                type="text" 
                className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm text-slate-800 mt-1 focus:border-[#00A8E8] focus:outline-none" 
                placeholder="xxxx xxxx xxxx xxxx" 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Expiry</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm text-slate-800 mt-1 focus:border-[#00A8E8] focus:outline-none" 
                  placeholder="MM/YY" 
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">CVV</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm text-slate-800 mt-1 focus:border-[#00A8E8] focus:outline-none" 
                  placeholder="xxx" 
                />
              </div>
            </div>

            <button className="w-full bg-[#00A8E8] text-[#FDFBF7] font-extrabold py-3.5 rounded-xl hover:opacity-90 transition-colors shadow-lg shadow-[#00A8E8]/20">
              Pay with Pesapal
            </button>
          </div>
        </div>
      ) : activePaymentMethod === 'paypal' ? (
        /* PayPal Page - Gold and Black Theme */
        <div className="bg-black border-2 border-[#FFC439] rounded-[2rem] p-6 space-y-6 transition-all animate-[slideIn_0.3s_ease-out]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="text-xl font-extrabold text-[#FFC439]">P</div>
              <h2 className="text-xl font-extrabold text-[#FFC439]">PayPal</h2>
            </div>
            <button 
              onClick={() => setActivePaymentMethod(null)}
              className="text-white/70 hover:text-white text-xs font-bold"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-6 py-4 flex flex-col items-center justify-center">
            <p className="text-sm text-white text-center">You will be redirected to PayPal to securely complete your payment.</p>
            
            {/* DEV NOTE: This is a placeholder for the real PayPal button */}
            {/* Next dev: Add the PayPal JS SDK and render the button in this container */}
            <button className="w-full max-w-xs bg-[#FFC439] text-black font-extrabold py-3 rounded-full hover:bg-[#F4B41A] transition-colors flex items-center justify-center gap-2">
              <span className="italic font-bold text-blue-900">PayPal</span> Checkout
            </button>
          </div>
        </div>
      ) : (
        /* Default View: Payment Methods List */
        <div className="space-y-6">
          {/* Payment Options */}
          <div className="space-y-3 flex-shrink-0">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Payment Methods</label>
            <div className="grid grid-cols-3 gap-3">
              
              {/* M-Pesa (Green & Black) */}
              <button 
                onClick={() => setActivePaymentMethod('mpesa')}
                className="bg-black border border-[#00E676]/30 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 hover:border-[#00E676] transition-all group"
              >
                <div className="text-xl font-extrabold text-[#00E676] group-hover:scale-110 transition-transform">M</div>
                <span className="text-[10px] font-bold text-white">M-Pesa</span>
              </button>
              
              {/* Pesapal (Card renamed, Blue & Creamy White Theme) */}
              <button 
                onClick={() => setActivePaymentMethod('pesapal')}
                className="bg-[#FDFBF7] border border-[#00A8E8] rounded-2xl p-4 flex flex-col items-center justify-center gap-1 hover:bg-[#F5F0E8] transition-all group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#00A8E8" strokeWidth="2" className="w-5 h-5 group-hover:scale-110 transition-transform"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                <span className="text-[10px] font-bold text-[#00A8E8]">Pesapal</span>
              </button>
              
              {/* PayPal (Gold & Black & White text Theme) */}
              <button 
                onClick={() => setActivePaymentMethod('paypal')}
                className="bg-black border border-[#FFC439]/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 hover:border-[#FFC439] transition-all group"
              >
                <div className="text-xl font-extrabold text-[#FFC439] group-hover:scale-110 transition-transform">P</div>
                <span className="text-[10px] font-bold text-white">PayPal</span>
              </button>
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-3 pb-20">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Promotions & Loyalty</label>
            <div className="space-y-2">
              
              {/* Apply Promo Code */}
              <div className="bg-zinc-900 border border-zinc-800/50 rounded-xl p-3.5 transition-all">
                <div className="flex justify-between items-center text-xs text-white">
                  <span>Apply Promo Code</span>
                  <button 
                    onClick={() => setShowPromoInput(!showPromoInput)}
                    className="text-[#E5B4B2] font-bold hover:text-[#B76E79] transition-colors"
                  >
                    {showPromoInput ? 'Cancel' : 'Add +'}
                  </button>
                </div>
                {showPromoInput && (
                  <div className="mt-3 flex gap-2 animate-[slideIn_0.2s_ease-out]">
                    <input 
                      type="text" 
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500" 
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button className="bg-emerald-500 text-white text-xs font-bold px-3 rounded-lg hover:bg-emerald-600 transition-colors">
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Redeem Points */}
              <div className="bg-zinc-900 border border-zinc-800/50 rounded-xl p-3.5 transition-all">
                <div className="flex justify-between items-center text-xs text-white">
                  <div>
                    <span>Redeem Points</span>
                    <div className="text-[10px] text-emerald-500/70 font-semibold mt-0.5">Available: {userData.loyaltyPoints?.toLocaleString() || 0} pts</div>
                  </div>
                  <button 
                    onClick={() => setShowPointsInput(!showPointsInput)}
                    className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors"
                  >
                    {showPointsInput ? 'Cancel' : 'Claim >'}
                  </button>
                </div>
                {showPointsInput && (
                  <div className="mt-3 flex gap-2 animate-[slideIn_0.2s_ease-out]">
                    <input 
                      type="number" 
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500" 
                      placeholder="Points to redeem"
                      value={pointsToRedeem}
                      onChange={(e) => setPointsToRedeem(e.target.value)}
                      max={userData.loyaltyPoints}
                    />
                    <button className="bg-emerald-500 text-white text-xs font-bold px-3 rounded-lg hover:bg-emerald-600 transition-colors">
                      Redeem
                    </button>
                  </div>
                )}
              </div>

              {/* Digital Receipt */}
              <button 
                onClick={() => setDigitalReceipt(!digitalReceipt)}
                className="w-full bg-zinc-900 border border-zinc-800/50 rounded-xl p-3.5 text-xs text-white text-left hover:border-emerald-500/50 transition-all flex justify-between items-center"
              >
                <span>Request Digital Receipt</span>
                <div className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${digitalReceipt ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                  <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all duration-300 ${digitalReceipt ? 'right-0.5' : 'left-0.5'}`}></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
