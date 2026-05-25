import React, { useState, useEffect } from "react";

export default function App() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("rupali_p");
    return saved ? JSON.parse(saved) : [{ id: 1, name: "Premium Lipstick", price: 299, category: "Cosmetics", image: "https://unsplash.com" }];
  });
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("rupali_o");
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("shop"); 
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [currency, setCurrency] = useState("INR"); 
  const [region, setRegion] = useState("Domestic");
  const [isAdmin, setIsAdmin] = useState(false);
  const [cName, setCName] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [cAddress, setCAddress] = useState("");
  const [isReseller, setIsReseller] = useState(false);
  const [resellerMargin, setResellerMargin] = useState("");
  const [trackInput, setTrackInput] = useState("");
  const [pName, setPName] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pImage, setPImage] = useState("");
  const [pCat, setPCat] = useState("Cosmetics");

  const categories = ["All", "Cosmetics", "Cutlery", "Hair Accessories", "Jewelry"];
  const rates = { INR: 1, USD: 0.012 };
  const syms = { INR: "₹", USD: "$" };

  useEffect(() => { localStorage.setItem("rupali_p", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("rupali_o", JSON.stringify(orders)); }, [orders]);
  useEffect(() => {
    const scr = document.createElement("script");
    scr.src = "https://razorpay.com";
    scr.async = true; document.body.appendChild(scr);
  }, []);

  const shipCost = () => region === "International" ? (currency === "INR" ? 1500 : 18) : (currency === "INR" ? 60 : 1);
  const subtotal = cart.reduce((s, i) => s + Math.round(i.price * rates[currency]) * i.qty, 0);
  const total = subtotal + shipCost() + (isReseller && resellerMargin ? Number(resellerMargin) : 0);

  const handlePay = () => {
    if (!cName || !cPhone || !cAddress) return alert("Fill shipping details!");
    const genId = "RPC" + Math.floor(100000 + Math.random() * 900000);
    const options = {
      key: "rzp_test_YOUR_KEY_HERE", amount: (currency === "INR" ? total : Math.round(total / rates[currency])) * 100, currency: "INR", name: "Rupali Store",
      handler: function (res) {
        setOrders([{ id: Date.now(), displayId: genId, name: cName, phone: cPhone, address: cAddress, total, sym: syms[currency], pId: res.razorpay_payment_id, status: "Paid & Confirmed", trackingId: "Pending", reseller: isReseller, margin: resellerMargin }, ...orders]);
        setCart([]); setCName(""); setCPhone(""); setCAddress(""); setIsReseller(false); setResellerMargin(""); setActiveTab("shop");
        alert(`Paid! Order ID: ${genId}`);
      }, prefill: { name: cName, contact: cPhone }, theme: { color: "#0f172a" }
    };
    new window.Razorpay(options).open();
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", fontFamily: "sans-serif", padding: "15px", paddingBottom: "100px" }}>
      <div style={{ position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px", zIndex: 99999, backgroundColor: "#0f172a", padding: "10px 20px", borderRadius: "30px" }}>
        <button onClick={() => setActiveTab("shop")} style={{ padding: "6px 12px", backgroundColor: activeTab === "shop" ? "#f59e0b" : "transparent", color: activeTab === "shop" ? "#0f172a" : "white", border: "none", borderRadius: "15px", fontWeight: "bold", cursor: "pointer" }}>Shop</button>
        <button onClick={() => setActiveTab("cart")} style={{ padding: "6px 12px", backgroundColor: activeTab === "cart" ? "#f59e0b" : "transparent", color: activeTab === "cart" ? "#0f172a" : "white", border: "none", borderRadius: "15px", fontWeight: "bold", cursor: "pointer" }}>Cart ({cart.reduce((a, b) => a + b.qty, 0)})</button>
        <button onClick={() => setActiveTab("track")} style={{ padding: "6px 12px", backgroundColor: activeTab === "track" ? "#f59e0b" : "transparent", color: activeTab === "track" ? "#0f172a" : "white", border: "none", borderRadius: "15px", fontWeight: "bold", cursor: "pointer" }}>Track</button>
        <button onClick={() => { if (isAdmin) { setIsAdmin(false); setActiveTab("shop"); } else { if (prompt("Password:") === "191171") { setIsAdmin(true); setActiveTab("admin"); } } }} style={{ padding: "6px 12px", backgroundColor: isAdmin ? "#ef4444" : "transparent", color: "white", border: "none", borderRadius: "15px", fontWeight: "bold", cursor: "pointer" }}>{isAdmin ? "Exit Admin" : "🔑 Admin"}</button>
      </div>
      <div style={{ textAlign: "center", backgroundColor: "#0f172a", padding: "15px", borderRadius: "12px", color: "white", marginBottom: "20px" }}>
        <h1 style={{ color: "#f59e0b", margin: "0", fontSize: "24px" }}>Rupali Cutlery Store</h1>
        <div style={{ marginTop: "10px", display: "flex", gap: "10px", justifyContent: "center", fontSize: "14px" }}>
          <label style={{ color: "white" }}>🌐 Currency: <select value={currency} onChange={(e) => setCurrency(e.target.value)}><option value="INR">INR (₹)</option><option value="USD">USD ($)</option></select></label>
          <label style={{ marginLeft: "10px", color: "white" }}>✈️ Shipping: <select value={region} onChange={(e) => setRegion(e.target.value)}><option value="Domestic">India</option><option value="International">Abroad</option></select></label>
        </div>
      </div>
      {activeTab === "shop" && (
        <div>
          <input placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: "10px", width: "100%", maxWidth: "280px", borderRadius: "8px", border: "1px solid #ccc", marginBottom: "15px" }} />
          <div style={{ display: "flex", gap: "5px", marginBottom: "15px", flexWrap: "wrap" }}>{categories.map(c => <button key={c} onClick={() => setFilter(c)} style={{ padding: "6px 12px", backgroundColor: filter === c ? "#0f172a" : "white", color: filter === c ? "#f59e0b" : "black", border: "1px solid #ccc", borderRadius: "15px", cursor: "pointer" }}>{c}</button>)}</div>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).filter(p => filter === "All" || p.category === filter).map(p => (
              <div key={p.id} style={{ backgroundColor: "white", padding: "10px", borderRadius: "12px", width: "180px", border: "1px solid #eee" }}>
                <img src={p.image} alt={p.name} style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }} />
                <h4 style={{ margin: "8px 0 4px 0" }}>{p.name}</h4>
                <p style={{ fontWeight: "bold", margin: "0 0 8px 0" }}>{syms[currency]}{Math.round(p.price * rates[currency])}</p>
                <button onClick={() => { const ex = cart.find(i => i.id === p.id); setCart(ex ? cart.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...cart, { ...p, qty: 1 }]); alert("Added!"); }} style={{ width: "100%", padding: "8px", backgroundColor: "#0f172a", color: "#f59e0b", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>🛒 Add to Bag</button>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeTab === "cart" && (
        <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "12px" }}>
          <h3>🛒 Shopping Cart</h3>
          {cart.length === 0 ? <p>Your bag is empty.</p> : (
            <div>
              {cart.map(i => <div key={i.id} style={{ padding: "6px 0", borderBottom: "1px solid #eee" }}>{i.name} (x{i.qty}) - {syms[currency]}{Math.round(i.price * rates[currency]) * i.qty}</div>)}
              <div style={{ backgroundColor: "#f1f5f9", padding: "10px", borderRadius: "8px", margin: "10px 0" }}>
                <label><input type="checkbox" checked={isReseller} onChange={(e) => setIsReseller(e.target.checked)} /> 📦 Meesho Reseller Mode</label>
                {isReseller && <div><label>Margin ({syms[currency]}): </label><input type="number" value={resellerMargin} onChange={(e) => setResellerMargin(e.target.value)} style={{ width: "60px" }} /></div>}
              </div>
              <p>Items: {syms[currency]}{subtotal} | Shipping: {syms[currency]}{shipCost()}</p><h2>Total: {syms[currency]}{total}</h2>
              <input placeholder="Name" value={cName} onChange={e => setCName(e.target.value)} style={{ display: "block", margin: "5px 0", padding: "6px", width: "100%", maxWidth: "280px" }} />
              <input placeholder="Phone" value={cPhone} onChange={e => setCPhone(e.target.value)} style={{ display: "block", margin: "5px 0", padding: "6px", width: "100%", maxWidth: "280px" }} />
              <textarea placeholder="Address" value={cAddress} onChange={e => setCAddress(e.target.value)} style={{ display: "block", margin: "5px 0", padding: "6px", width: "100%", maxWidth: "280px", height: "50px" }} />
              <button onClick={handlePay} style={{ padding: "10px", backgroundColor: "#25D366", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold", width: "100%", maxWidth: "280px", cursor: "pointer" }}>💳 Pay Now (Razorpay)</button>
            </div>
          )}
        </div>
      )}
      {activeTab === "track" && (
        <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "12px" }}>
          <h3>📦 Track Order</h3>
          <input placeholder="Enter Phone Number" value={trackInput} onChange={e => setTrackInput(e.target.value)} style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc", width: "180px" }} />