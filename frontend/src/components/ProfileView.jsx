import React, { useState } from 'react';

export default function ProfileView({ userData }) {
  const [showSensitive, setShowSensitive] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Helper to mask email (Privacy Feature requested by user)
  const maskEmail = (email) => {
    if (!email) return 'N/A';
    const [name, domain] = email.split('@');
    if (!name || !domain) return email;
    return `${name[0]}***@${domain}`;
  };

  // Helper to mask phone (Privacy Feature requested by user)
  const maskPhone = (phone) => {
    if (!phone) return 'N/A';
    if (phone.length < 7) return '***' + phone.substring(phone.length - 2);
    return `${phone.substring(0, 4)}***${phone.substring(phone.length - 3)}`;
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    // Wait for the shake animation to complete before reloading
    setTimeout(() => {
      localStorage.removeItem('userToken');
      localStorage.removeItem('loginTime');
      window.location.reload(); // Quick reset
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 bg-zinc-950 pb-24">
      {/* Floating Card - Mac/Linux style */}
      <div className={`w-full max-w-sm bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800/50 rounded-[2.5rem] p-8 shadow-2xl shadow-black/70 space-y-6 ${isLoggingOut ? 'animate-logoutAnim border-red-500/50' : ''}`}>
        
        <div className="flex flex-col items-center space-y-3">
          {/* Avatar with initials */}
          <div className="w-20 h-20 bg-gradient-to-br from-[#E5B4B2] to-[#B76E79] rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-[#E5B4B2]/20">
            {userData.name ? userData.name[0].toUpperCase() : 'U'}
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">{userData.name || 'User'}</h1>
          <span className="bg-zinc-800 text-[#E5B4B2] text-xs font-bold px-3 py-1 rounded-full">
            ⭐ {userData.loyaltyPoints?.toLocaleString() || 0} Points
          </span>
        </div>

        <div className="space-y-4 pt-4 border-t border-zinc-800/50">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Email Address</label>
            <div className="text-sm font-semibold text-white mt-0.5 px-1">
              {showSensitive ? userData.email : maskEmail(userData.email)}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Phone Number</label>
            <div className="text-sm font-semibold text-white mt-0.5 px-1">
              {showSensitive ? userData.phone : maskPhone(userData.phone)}
            </div>
          </div>
        </div>

        <button 
          onClick={() => setShowSensitive(!showSensitive)}
          className="w-full bg-zinc-800 text-white font-bold py-3.5 rounded-2xl hover:bg-zinc-700 transition-all text-xs"
        >
          {showSensitive ? 'Hide Private Info' : 'Show Private Info'}
        </button>

        <button 
          className="w-full bg-red-500/10 text-red-500 font-bold py-3.5 rounded-2xl hover:bg-red-500/20 transition-all text-xs"
          onClick={handleLogout}
        >
          {isLoggingOut ? 'Logging out...' : 'Log Out'}
        </button>
      </div>
    </div>
  );
}
