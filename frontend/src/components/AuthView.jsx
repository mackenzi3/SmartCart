import React, { useState } from 'react';

export default function AuthView({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });

  const [isSwiping, setIsSwiping] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSwiping(true);
    const success = await onLogin(formData, isLogin);
    if (!success) {
      setIsSwiping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 bg-zinc-950 overflow-hidden">
      {/* Floating Card - Mac/Linux style */}
      <div className={`w-full max-w-sm bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800/50 rounded-[2.5rem] p-8 shadow-2xl shadow-black/70 space-y-6 ${isSwiping ? 'animate-loginSuccess' : ''}`}>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-xs text-slate-500 font-medium">{isLogin ? 'Login to your account' : 'Sign up to start saving'}</p>
        </div>

        {isLogin && (
          <div className="flex gap-1.5 justify-center mb-2 bg-zinc-800/50 p-1 rounded-full w-max mx-auto">
            <button 
              type="button"
              onClick={() => setLoginMethod('email')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${loginMethod === 'email' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Email
            </button>
            <button 
              type="button"
              onClick={() => setLoginMethod('phone')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${loginMethod === 'phone' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Phone
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Name</label>
              <input 
                type="text" 
                className="w-full bg-zinc-800/70 border border-zinc-700/50 rounded-2xl p-3 text-sm text-white mt-1 focus:border-emerald-500/50 focus:outline-none transition-all focus:ring-1 focus:ring-emerald-500/20" 
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          )}

          {(isLogin ? loginMethod === 'email' : true) && (
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Email</label>
              <input 
                type="email" 
                className="w-full bg-zinc-800/70 border border-zinc-700/50 rounded-2xl p-3 text-sm text-white mt-1 focus:border-emerald-500/50 focus:outline-none transition-all focus:ring-1 focus:ring-emerald-500/20" 
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          )}

          {(isLogin ? loginMethod === 'phone' : true) && (
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Phone Number</label>
              <input 
                type="tel" 
                className="w-full bg-zinc-800/70 border border-zinc-700/50 rounded-2xl p-3 text-sm text-white mt-1 focus:border-emerald-500/50 focus:outline-none transition-all focus:ring-1 focus:ring-emerald-500/20" 
                placeholder="+254..."
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Password</label>
            <input 
              type="password" 
              className="w-full bg-zinc-800/70 border border-zinc-700/50 rounded-2xl p-3 text-sm text-white mt-1 focus:border-emerald-500/50 focus:outline-none transition-all focus:ring-1 focus:ring-emerald-500/20" 
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-emerald-500 text-white font-bold py-3.5 rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 hover:scale-[0.98] active:scale-[0.95]"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center">
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)} 
            className="text-xs text-[#E5B4B2] hover:text-[#B76E79] font-bold transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
