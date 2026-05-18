import React from 'react';

export default function NavBar({ activeTab, setActiveTab }) {
  const tabs = [
    { 
      id: 'scan', 
      color: 'bg-emerald-500', 
      shadow: 'shadow-emerald-500/30',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg> 
    },
    { 
      id: 'cart', 
      color: 'bg-yellow-500', 
      shadow: 'shadow-yellow-500/30',
      // Replaced with a Card Icon as requested by user
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg> 
    },
    { 
      id: 'search', 
      color: 'bg-purple-500', 
      shadow: 'shadow-purple-500/30',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> 
    },
    { 
      id: 'profile', 
      color: 'bg-blue-500', 
      shadow: 'shadow-blue-500/30',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> 
    }
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 h-20 glass-nav flex justify-around items-center px-4 pb-2 z-50">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`w-12 h-12 flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ${
            activeTab === tab.id 
              ? `${tab.color} text-slate-900 shadow-lg ${tab.shadow} -translate-y-2` 
              : 'text-slate-500 hover:text-slate-100'
          }`}
        >
          {tab.icon}
        </button>
      ))}
    </nav>
  );
}
