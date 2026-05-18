import { useState, useEffect, useRef } from 'react';
import NavBar from './components/NavBar';
import AuthView from './components/AuthView';
import ProfileView from './components/ProfileView';
import CartView from './components/CartView';

export default function App() {
  const [items, setItems] = useState([
    { id: 1, name: 'Red Apples (1kg)', price: 3.50, image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=100&auto=format&fit=crop' },
    { id: 2, name: 'Whole Grain Bread', price: 2.50, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&auto=format&fit=crop' },
    { id: 3, name: 'Avocado (x2)', price: 4.00, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=100&auto=format&fit=crop' },
  ]);
  const [activeTab, setActiveTab] = useState('scan');
  const videoRef = useRef(null);
  const [scanPulse, setScanPulse] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);
  const [showAllPromos, setShowAllPromos] = useState(false);
  
  // LOGIN SYSTEM (V2 Request): State and persistence
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const loginTime = localStorage.getItem('loginTime');
    if (token && loginTime) {
      const now = new Date().getTime();
      const twoWeeks = 14 * 24 * 60 * 60 * 1000; // 2 weeks in ms
      if (now - parseInt(loginTime) < twoWeeks) {
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem('userToken');
        localStorage.removeItem('loginTime');
      }
    }
  }, []);

  const handleLogin = async (data, isLogin) => {
    const endpoint = isLogin ? '/api/login' : '/api/signup';
    try {
      const response = await fetch(`http://localhost:5001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setUserData(result); // Update user data with actual data from DB!
        localStorage.setItem('userToken', result._id); // Use user ID as token for demo
        localStorage.setItem('loginTime', new Date().getTime().toString());
        
        // Delay unmounting to let animation play!
        setTimeout(() => {
          setIsLoggedIn(true);
        }, 500);
        
        return true;
      } else {
        alert(result.message || 'Error occurred');
        return false;
      }
    } catch (error) {
      console.error("Auth error:", error);
      // Fallback for demo if server is down
      setUserData({ 
        name: data.name || 'Demo User', 
        loyaltyPoints: 1250,
        email: data.email || 'demo@smartcart.com',
        phone: data.phone || '0712345678'
      });
      localStorage.setItem('userToken', 'demo-token');
      localStorage.setItem('loginTime', new Date().getTime().toString());
      
      // Delay unmounting to let animation play!
      setTimeout(() => {
        setIsLoggedIn(true);
      }, 500);
      
      return true;
    }
  };
  
  // USER SYSTEM (V2 Request): State for loyalty customer data
  // Next dev: Connect this to actual auth/device ID in production
  const [userData, setUserData] = useState({ name: 'Loading...', loyaltyPoints: 0 });

  // Fetch user data on load
  useEffect(() => {
    fetch('http://localhost:5001/api/user/default')
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(err => {
        console.log("Error fetching user:", err);
        // Fallback if server fails
        setUserData({ 
          name: 'Mackenzie Loody', 
          loyaltyPoints: 1250,
          email: 'mackenzie@example.com',
          phone: '0712345678'
        });
      });
  }, []);

  // Performance detection (Senior Dev approach)
  useEffect(() => {
    // If device has 2 or fewer CPU cores, or less memory, assume it's weak
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
      setIsLowPower(true);
      console.log("🚀 Low performance device detected. Optimizing scanner...");
    }
  }, []);

  // Total amount calculation
  const total = items.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  // Simulated scanning effect
  useEffect(() => {
    const mockProducts = [
      { name: 'Banana (Bunch)', price: 1.99, image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=100&auto=format&fit=crop' },
      { name: 'Coca Cola 500ml', price: 1.50, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=100&auto=format&fit=crop' },
      { name: 'Potato Chips', price: 2.00, image: 'https://images.unsplash.com/photo-1613967193442-19cfea95f596?w=100&auto=format&fit=crop' }
    ];
    let productIndex = 0;

    const interval = setInterval(() => {
      if (items.length >= 5) return; // Limit for demo

      const product = mockProducts[productIndex];
      productIndex = (productIndex + 1) % mockProducts.length;

      setScanPulse(true);
      setTimeout(() => setScanPulse(false), 500);

      setItems(prevItems => [
        { id: Date.now(), ...product },
        ...prevItems
      ]);
    }, 12000); // Scan every 12 seconds

    return () => clearInterval(interval);
  }, [items.length]);

  // Camera access
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.log("Camera access denied or not available. Using simulated feed.");
        });
    }
  }, []);

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950">
      <div className="w-full max-w-md h-[100vh] flex flex-col bg-zinc-900 relative shadow-2xl overflow-hidden">
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.4s ease-out forwards;
          }
          @keyframes loginSuccess {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; filter: blur(2px); }
            100% { transform: scale(0.5); opacity: 0; filter: blur(10px); }
          }
          .animate-loginSuccess {
            animation: loginSuccess 0.5s ease-in-out forwards;
          }
          @keyframes logoutAnim {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(15deg); opacity: 0; }
          }
          .animate-logoutAnim {
            animation: logoutAnim 0.6s ease-in forwards;
          }
          @keyframes scanIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-scanIn {
            animation: scanIn 0.4s ease-out forwards;
          }
          @keyframes cartIn {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .animate-cartIn {
            animation: cartIn 0.4s ease-out forwards;
          }
          @keyframes searchIn {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .animate-searchIn {
            animation: searchIn 0.4s ease-out forwards;
          }
          @keyframes profileIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-profileIn {
            animation: profileIn 0.4s ease-out forwards;
          }
        `}</style>
        {!isLoggedIn ? (
          <AuthView onLogin={handleLogin} />
        ) : (
          <>
            {/* Header - Updated to show customer data (Requested by user) */}
        {/* Next dev: The layout is optimized for high visibility (Money Vibe) */}
        <header className="p-5 flex justify-between items-center bg-zinc-900/90 backdrop-blur-xl z-10 border-bottom border-zinc-800">
          <div>
            <div className="text-xs text-slate-500 font-semibold">Welcome back,</div>
            <div className="text-base font-extrabold tracking-tight text-white">
              {userData.name} <span className="text-[#E5B4B2] text-xs font-bold ml-1">⭐ {userData.loyaltyPoints.toLocaleString()} pts</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-zinc-800/50 px-3 py-1.5 rounded-full text-xs font-semibold">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span>SmartCart</span>
          </div>
        </header>

        {activeTab === 'profile' ? (
          <div className="animate-profileIn flex-1 flex flex-col"><ProfileView userData={userData} /></div>
        ) : activeTab === 'cart' ? (
          <div className="animate-cartIn flex-1 flex flex-col"><CartView items={items} total={total} userData={userData} /></div>
        ) : (activeTab === 'search' || showAllPromos) ? (
          /* All Promos Page */
          <div className="flex-1 flex flex-col h-full overflow-hidden animate-searchIn">
            {/* Pinned Header */}
            <div className="p-5 flex items-center gap-4 bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-800 z-10">
              <button 
                onClick={() => setShowAllPromos(false)}
                className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 19"></polyline></svg>
              </button>
              <div>
                <h1 className="text-xl font-bold">Exclusive Deals</h1>
                <p className="text-xs text-slate-500">Tailored to your purchase history</p>
              </div>
            </div>

            {/* Scrollable Grid */}
            <div className="flex-1 overflow-y-auto p-5 scroll-smooth scrollbar-hide">
              <div className="grid grid-cols-2 gap-4 pb-24">
                {/* Promo 1 */}
                <div className="h-40 rounded-2xl relative overflow-hidden transition-transform hover:-translate-y-1">
                  <img src="https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=400&auto=format&fit=crop" alt="Strawberries" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  <div className="relative p-3 h-full flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                      <span className="bg-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded-md self-start">Deal of the Day</span>
                      <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded-full">Aisle 3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-white">Fresh Strawberries</h3>
                      <div className="flex gap-2 items-center text-xs text-white">
                        <span className="line-through text-white/60">KSh 4.99</span>
                        <span className="font-bold text-sm">KSh 2.99</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Promo 2 */}
                <div className="h-40 rounded-2xl relative overflow-hidden transition-transform hover:-translate-y-1">
                  <img src="https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop" alt="Milk" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  <div className="relative p-3 h-full flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                      <span className="bg-blue-500 text-[10px] font-bold px-2 py-0.5 rounded-md self-start">BOGO</span>
                      <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded-full">Aisle 5</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-white">Organic Milk 1L</h3>
                      <div className="text-xs font-bold text-white">Buy 1 Get 1</div>
                    </div>
                  </div>
                </div>

                {/* Promo 3 */}
                <div className="h-40 rounded-2xl relative overflow-hidden transition-transform hover:-translate-y-1">
                  <img src="https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&auto=format&fit=crop" alt="Chocolate" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  <div className="relative p-3 h-full flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                      <span className="bg-orange-500 text-[10px] font-bold px-2 py-0.5 rounded-md self-start">20% OFF</span>
                      <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded-full">Aisle 2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-white">Dark Chocolate</h3>
                      <div className="flex gap-2 items-center text-xs text-white">
                        <span className="line-through text-white/60">KSh 3.50</span>
                        <span className="font-bold text-sm">KSh 2.80</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Promo 4 */}
                <div className="h-40 rounded-2xl relative overflow-hidden transition-transform hover:-translate-y-1">
                  <img src="https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&auto=format&fit=crop" alt="Apples" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  <div className="relative p-3 h-full flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                      <span className="bg-purple-500 text-[10px] font-bold px-2 py-0.5 rounded-md self-start">Fresh</span>
                      <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded-full">Aisle 1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-white">Red Apples</h3>
                      <div className="flex gap-2 items-center text-xs text-white">
                        <span className="font-bold text-sm">KSh 3.50</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Promo 5 */}
                <div className="h-40 rounded-2xl relative overflow-hidden transition-transform hover:-translate-y-1">
                  <img src="https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&auto=format&fit=crop" alt="Avocado" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  <div className="relative p-3 h-full flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                      <span className="bg-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded-md self-start">Top Pick</span>
                      <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded-full">Aisle 1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-white">Avocado (x2)</h3>
                      <div className="text-xs font-bold text-white">KSh 4.00</div>
                    </div>
                  </div>
                </div>

                {/* Promo 6 */}
                <div className="h-40 rounded-2xl relative overflow-hidden transition-transform hover:-translate-y-1">
                  <img src="https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&auto=format&fit=crop" alt="Banana" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  <div className="relative p-3 h-full flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                      <span className="bg-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded-md self-start">Daily</span>
                      <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded-full">Aisle 1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-white">Banana (Bunch)</h3>
                      <div className="text-xs font-bold text-white">KSh 1.99</div>
                    </div>
                  </div>
                </div>

                {/* Promo 7 */}
                <div className="h-40 rounded-2xl relative overflow-hidden transition-transform hover:-translate-y-1">
                  <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop" alt="Bread" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  <div className="relative p-3 h-full flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                      <span className="bg-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-md self-start">Bakery</span>
                      <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded-full">Aisle 4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-white">Whole Grain Bread</h3>
                      <div className="text-xs font-bold text-white">KSh 2.50</div>
                    </div>
                  </div>
                </div>

                {/* Promo 8 */}
                <div className="h-40 rounded-2xl relative overflow-hidden transition-transform hover:-translate-y-1">
                  <img src="https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&auto=format&fit=crop" alt="Coke" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  <div className="relative p-3 h-full flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                      <span className="bg-red-500 text-[10px] font-bold px-2 py-0.5 rounded-md self-start">Cold</span>
                      <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded-full">Aisle 6</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-white">Coca Cola 500ml</h3>
                      <div className="text-xs font-bold text-white">KSh 1.50</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Normal Landing Page Content */
          <>
            <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24 scrollbar-hide animate-scanIn">
              
              {/* Scanner Section - Frameless & Optimized */}
              <section className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">Intelligent Scanner</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-emerald-500 font-semibold">Active</span>
                  </div>
                </div>
                <div className={`relative w-full h-52 bg-zinc-800/50 rounded-3xl overflow-hidden transition-all duration-300 ${scanPulse ? 'ring-2 ring-[#E5B4B2] shadow-[#E5B4B2]/20' : ''}`}>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className={`w-full h-full object-cover opacity-60 ${isLowPower ? 'blur-sm' : ''}`}
                  ></video>
                  
                  {/* Scanner Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Corners */}
                    <div className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2 border-[#E5B4B2]"></div>
                    <div className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 border-[#E5B4B2]"></div>
                    <div className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 border-[#E5B4B2]"></div>
                    <div className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 border-[#E5B4B2]"></div>
                    
                    {/* Laser Line - Slower/Disabled on weak devices to save CPU */}
                    {!isLowPower && (
                      <div className="absolute left-6 right-6 h-0.5 bg-[#E5B4B2] shadow-[0_0_10px_2px_#E5B4B2] animate-scan"></div>
                    )}
                    
                    {isLowPower && (
                      <div className="absolute left-6 right-6 top-1/2 h-0.5 bg-[#E5B4B2]/50 shadow-[0_0_5px_1px_#E5B4B2]"></div>
                    )}
                  </div>
                </div>
              </section>

              {/* Promotions Section */}
              <section className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <div>
                    <h2 className="text-lg font-semibold">Exclusive Promotions</h2>
                    <p className="text-xs text-slate-500">Popular & based on your interests</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('search')} 
                    className="text-[#E5B4B2] text-sm font-semibold hover:underline"
                  >
                    See All
                  </button>
                </div>
                
                {/* BUSINESS PSYCHOLOGY NOTE: In V2, these promotions should be fetched from the backend and personalized */}
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
                  {/* Promo Card 1 */}
                  <div className="min-width-[200px] w-52 h-28 rounded-2xl relative overflow-hidden flex-shrink-0 transition-transform hover:-translate-y-1">
                    <img src="https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=400&auto=format&fit=crop" alt="Strawberries" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    <div className="relative p-3 h-full flex flex-col justify-between z-10">
                      <span className="bg-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded-md self-start">Deal of the Day</span>
                      <h3 className="font-semibold text-sm text-white">Fresh Strawberries</h3>
                      <div className="flex gap-2 items-center text-xs text-white">
                        <span className="line-through text-white/60">KSh 4.99</span>
                        <span className="font-bold text-sm">KSh 2.99</span>
                      </div>
                    </div>
                  </div>

                  {/* Promo Card 2 */}
                  <div className="min-width-[200px] w-52 h-28 rounded-2xl relative overflow-hidden flex-shrink-0 transition-transform hover:-translate-y-1">
                    <img src="https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop" alt="Milk" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    <div className="relative p-3 h-full flex flex-col justify-between z-10">
                      <span className="bg-blue-500 text-[10px] font-bold px-2 py-0.5 rounded-md self-start">BOGO</span>
                      <h3 className="font-semibold text-sm text-white">Organic Milk 1L</h3>
                      <div className="text-xs font-bold text-white">Buy 1 Get 1</div>
                    </div>
                  </div>

                  {/* Promo Card 3 */}
                  <div className="min-width-[200px] w-52 h-28 rounded-2xl relative overflow-hidden flex-shrink-0 transition-transform hover:-translate-y-1">
                    <img src="https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&auto=format&fit=crop" alt="Chocolate" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    <div className="relative p-3 h-full flex flex-col justify-between z-10">
                      <span className="bg-orange-500 text-[10px] font-bold px-2 py-0.5 rounded-md self-start">20% OFF</span>
                      <h3 className="font-semibold text-sm text-white">Dark Chocolate</h3>
                      <div className="flex gap-2 items-center text-xs text-white">
                        <span className="line-through text-white/60">KSh 3.50</span>
                        <span className="font-bold text-sm">KSh 2.80</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Scanned Items Section */}
              <section className="space-y-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Scanned Items ({items.length})</h2>
                  
                  {/* Mini Credit Card for Total */}
                  <div className="bg-gradient-to-br from-[#E5B4B2] to-[#B76E79] p-3 rounded-xl shadow-lg flex flex-col justify-between w-32 h-18 relative overflow-hidden transition-transform hover:scale-105">
                    <div className="w-5 h-3.5 bg-yellow-400/90 rounded-sm self-start"></div>
                    <div>
                      <div className="text-[9px] text-white/80 uppercase font-bold tracking-wider">Total Amount</div>
                      <div className="text-sm font-black text-white">KSh {total}</div>
                    </div>
                    {/* Mastercard style logo */}
                    <div className="absolute top-2 right-2 flex">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full -ml-1.5"></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 max-h-[220px] overflow-y-auto scrollbar-hide">
                  {items.map(item => (
                    <div 
                      key={item.id} 
                      className="glass-card p-3 flex items-center gap-4 transition-all duration-300 animate-[slideIn_0.3s_ease-out]"
                    >
                      <div className="w-10 h-10 bg-slate-700/50 rounded-xl flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl">{item.icon || '📦'}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-white mb-0.5">{item.name}</h4>
                        <span className="text-[#E5B4B2] text-lg font-extrabold tracking-tight">KSh {item.price.toFixed(2)}</span>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-all duration-200"
                        aria-label="Remove item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </main>


          </>
        )}
          </>
        )}
        {/* Bottom Navigation */}
        <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
