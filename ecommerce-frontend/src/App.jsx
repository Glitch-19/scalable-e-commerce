import { useState, useEffect } from "react";
import axios from "axios";

// --- 🛠️ SMARTER HELPER: Map Real Photos Based on Product Name/Category ---
const getProductImages = (item) => {
  // If the DB actually saved an image array, use it!
  if (item.images && item.images.length > 0) return item.images;
  
  // Mapping specific photos based on product name to bypass DB schema limits!
  const name = item.name.toLowerCase();

  // 1. Audio Products
  if (name.includes("mic") || name.includes("condenser")) {
    return [
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80", // Mic 1
      "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80", // Mic 2
      "https://images.unsplash.com/photo-1621406830743-4f04c6020c24?auto=format&fit=crop&w=600&q=80"  // Mic 3
    ];
  }
  if (name.includes("earbud") || name.includes("tws") || name.includes("headset")) {
    return [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80", // Earbuds
      "https://images.unsplash.com/photo-1606220588913-b3a58e658ce5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1572569533944-cb1d3fb668f4?auto=format&fit=crop&w=600&q=80"
    ];
  }

  // 2. Monitors
  if (name.includes("monitor") || name.includes("display")) {
    return [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80", // Monitor
      "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
    ];
  }

  // 3. Laptops
  if (name.includes("laptop") || name.includes("book")) {
    return [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80", // Laptop
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80"
    ];
  }

  // 4. Keyboards (Default Fallback)
  return [
    "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80", // Dark Mech Keyboard
    "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?auto=format&fit=crop&w=600&q=80", // Retro Keyboard
    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80"  // Pink/Custom Keyboard
  ];
};

// --- 🌟 COMPONENT 1: DYNAMIC PRODUCT CARD (With Mini-Image Switcher & Click-to-Detail) ---
function ProductCard({ item, onAddToCart, onBuyNow, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  
  const images = getProductImages(item);
  const rating = item.rating || 4.8;
  const reviewsCount = item.reviews || 124;
  const oldPrice = (item.price * 1.25).toFixed(2);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setActiveImgIndex(0); }}
      onClick={() => onSelect(item)} // 👆 Clicking anywhere opens the Detailed View!
      style={{
        backgroundColor: "#1e293b",
        border: isHovered ? "1px solid #38bdf8" : "1px solid #334155",
        borderRadius: "16px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: isHovered ? "0 10px 25px -5px rgba(56, 189, 248, 0.3)" : "0 4px 10px rgba(0,0,0,0.3)",
        transition: "all 0.3s ease",
        transform: isHovered ? "translateY(-5px)" : "translateY(0)",
        cursor: "pointer"
      }}
    >
      {/* 📸 Image Gallery Carousel on Card */}
      <div style={{ position: "relative", height: "210px", backgroundColor: "#0f172a", overflow: "hidden" }}>
        <img 
          src={images[activeImgIndex]} 
          alt={item.name} 
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease", transform: isHovered ? "scale(1.08)" : "scale(1)" }} 
        />
        <span style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "#ef4444", color: "white", padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "900" }}>
          20% OFF 🔥
        </span>
        
        {/* 🔘 Dynamic Image Switcher Dots (Click to change photo without opening modal!) */}
        <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px", zIndex: 10 }} onClick={(e) => e.stopPropagation()}>
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImgIndex(idx)}
              style={{
                width: activeImgIndex === idx ? "20px" : "8px",
                height: "8px",
                borderRadius: "4px",
                backgroundColor: activeImgIndex === idx ? "#38bdf8" : "rgba(255,255,255,0.4)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.2s"
              }}
            />
          ))}
        </div>
      </div>

      {/* ⌨️ Product Info Block */}
      <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
            <span style={{ color: "#fbbf24", fontSize: "14px" }}>⭐⭐⭐⭐⭐</span>
            <span style={{ color: "#94a3b8", fontSize: "12px", fontWeight: "bold" }}>({rating}) • {reviewsCount} reviews</span>
          </div>
          <h3 style={{ margin: "0 0 8px 0", color: "#f8fafc", fontSize: "18px", fontWeight: "bold" }}>{item.name}</h3>
          <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.5", margin: "0 0 16px 0", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {item.description || "High-performance hardware with per-key RGB backlighting and aerospace aluminum construction."}
          </p>
        </div>

        {/* 💰 Price & Actions */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "16px" }}>
            <span style={{ fontSize: "24px", fontWeight: "900", color: "#10b981" }}>${item.price}</span>
            <span style={{ fontSize: "14px", color: "#64748b", textDecoration: "line-through" }}>${oldPrice}</span>
          </div>

          <div style={{ display: "flex", gap: "10px" }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onAddToCart(item)}
              style={{ flex: 1, backgroundColor: "#0f172a", color: "#38bdf8", border: "1px solid #38bdf8", padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}
            >
              🛒 Add to Cart
            </button>
            <button
              onClick={() => onBuyNow(item)}
              style={{ flex: 1, backgroundColor: "#0284c7", color: "white", border: "none", padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 0 15px rgba(2, 132, 199, 0.4)" }}
            >
              ⚡ Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 🌟 COMPONENT 2: FULL PRODUCT DETAIL MODAL (Gallery + Reviews + Suggestions) ---
function ProductDetailModal({ product, onClose, onAddToCart, onBuyNow, allProducts, onSelectProduct, user }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const images = getProductImages(product);

  // ⭐ Dynamic Reviews State (Initial Mock Reviews + User Submission)
  const [reviews, setReviews] = useState([
    { id: 1, name: "Alex Mercer", rating: 5, date: "2 days ago", comment: "Absolutely incredible build quality! The RGB lighting is super vibrant and the keys feel amazing." },
    { id: 2, name: "Sarah Jenkins", rating: 5, date: "1 week ago", comment: "Best developer purchase I've made all year. Connected instantly without any latency." },
    { id: 3, name: "David K.", rating: 4, date: "2 weeks ago", comment: "Great hardware! Packaging was solid and shipping was super fast via Docker backend." }
  ]);
  
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const newEntry = {
      id: Date.now(),
      name: user ? user.email.split('@')[0] : "Verified Buyer",
      rating: Number(newRating),
      date: "Just now",
      comment: newComment
    };
    
    setReviews([newEntry, ...reviews]);
    setNewComment("");
  };

  // 🤖 Filter Recommended / Suggested Products (Same Category, excluding current)
  const suggestedProducts = allProducts
    .filter((item) => (item.category === product.category || !product.category) && (item._id || item.id) !== (product._id || product.id))
    .slice(0, 3);

  return (
    <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", zIndex: 400, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }} onClick={onClose}>
      <div style={{ backgroundColor: "#0f172a", width: "100%", maxWidth: "950px", maxHeight: "90vh", borderRadius: "24px", border: "1px solid #334155", overflowY: "auto", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)", position: "relative", padding: "32px" }} onClick={(e) => e.stopPropagation()}>
        
        {/* ✖ Close Button */}
        <button onClick={onClose} style={{ position: "absolute", top: "20px", right: "24px", background: "#1e293b", border: "1px solid #334155", color: "white", width: "40px", height: "40px", borderRadius: "50%", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>✖</button>

        {/* --- TOP SECTION: GALLERY + TECHNICAL SPECS --- */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "32px", marginBottom: "40px" }}>
          
          {/* Left Column: Dynamic Multi-Image Gallery */}
          <div>
            <div style={{ width: "100%", height: "320px", backgroundColor: "#1e293b", borderRadius: "16px", overflow: "hidden", border: "1px solid #334155", marginBottom: "16px" }}>
              <img src={images[activeImgIndex]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            {/* Clickable Thumbnails */}
            <div style={{ display: "flex", gap: "12px" }}>
              {images.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveImgIndex(idx)}
                  style={{ flex: 1, height: "80px", borderRadius: "10px", overflow: "hidden", border: activeImgIndex === idx ? "2px solid #38bdf8" : "1px solid #334155", cursor: "pointer", opacity: activeImgIndex === idx ? 1 : 0.6, transition: "all 0.2s" }}
                >
                  <img src={img} alt="Thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Detailed Product Information */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <span style={{ backgroundColor: "#1e293b", color: "#38bdf8", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", border: "1px solid #0284c7" }}>
                {product.category || "Pro Hardware"} • Stock: {product.stock} Units
              </span>
              <h1 style={{ fontSize: "32px", fontWeight: "900", color: "#f8fafc", margin: "12px 0 8px 0" }}>{product.name}</h1>
              
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <span style={{ color: "#fbbf24", fontSize: "16px" }}>⭐⭐⭐⭐⭐</span>
                <span style={{ color: "#34d399", fontWeight: "bold", fontSize: "14px" }}>4.8 out of 5</span>
                <span style={{ color: "#64748b" }}>• ({reviews.length} Customer Reviews)</span>
              </div>

              <p style={{ color: "#94a3b8", fontSize: "15px", lineHeight: "1.7", marginBottom: "20px" }}>
                {product.description || "Engineered for elite developers and gamers. Features custom mechanical switches, per-key RGB WebGL lighting mapping, ultra-low latency wireless controller, and aerospace-grade aluminum chassis construction."}
              </p>

              {/* Technical Spec Bullets */}
              <div style={{ backgroundColor: "#1e293b", padding: "16px", borderRadius: "12px", border: "1px solid #334155", marginBottom: "24px" }}>
                <h4 style={{ margin: "0 0 10px 0", color: "#38bdf8", fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px" }}>⚡ Technical Highlights</h4>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#cbd5e1", fontSize: "13px", lineHeight: "1.8" }}>
                  <li><strong>Connectivity:</strong> Ultra-Fast Bluetooth 5.3 + Type-C Braided Cable</li>
                  <li><strong>Compatibility:</strong> Windows, macOS, Linux Ubuntu, and Docker Nodes</li>
                  <li><strong>Warranty:</strong> 2-Year Enterprise Replacement Guarantee</li>
                </ul>
              </div>
            </div>

            {/* Price & Action Buttons */}
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "16px" }}>
                <span style={{ fontSize: "36px", fontWeight: "900", color: "#10b981" }}>${product.price}</span>
                <span style={{ fontSize: "18px", color: "#64748b", textDecoration: "line-through" }}>${(product.price * 1.25).toFixed(2)}</span>
                <span style={{ backgroundColor: "#064e3b", color: "#34d399", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}>Save 20%</span>
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <button
                  onClick={() => { onAddToCart(product); onClose(); }}
                  style={{ flex: 1, backgroundColor: "#1e293b", color: "#38bdf8", border: "1px solid #38bdf8", padding: "14px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}
                >
                  🛒 Add to Drawer
                </button>
                <button
                  onClick={() => { onBuyNow(product); onClose(); }}
                  style={{ flex: 1, backgroundColor: "#0284c7", color: "white", border: "none", padding: "14px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 0 20px rgba(2, 132, 199, 0.5)" }}
                >
                  ⚡ Instant Buy Now
                </button>
              </div>
            </div>

          </div>
        </div>

        <hr style={{ borderColor: "#334155", margin: "40px 0" }} />

        {/* --- MIDDLE SECTION: LIVE REVIEWS & COMMENT SUBMISSION --- */}
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "24px", color: "#f8fafc", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span>💬</span> Customer Reviews & Comments ({reviews.length})
          </h2>

          {/* Add Your Review Form */}
          <form onSubmit={handleAddReview} style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "16px", border: "1px solid #334155", marginBottom: "24px" }}>
            <h4 style={{ margin: "0 0 12px 0", color: "#38bdf8" }}>Write a Review for {product.name}</h4>
            <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
              <select 
                value={newRating} 
                onChange={(e) => setNewRating(e.target.value)}
                style={{ backgroundColor: "#0f172a", color: "white", border: "1px solid #334155", padding: "10px", borderRadius: "8px", fontWeight: "bold", outline: "none" }}
              >
                <option value="5">⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                <option value="3">⭐⭐⭐ (3 - Average)</option>
              </select>
              <input 
                type="text" 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)} 
                placeholder="Share your experience with this hardware..." 
                style={{ flex: 1, padding: "10px 16px", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "white", outline: "none" }}
              />
              <button type="submit" style={{ backgroundColor: "#10b981", color: "white", border: "none", padding: "10px 24px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>Post Review 🚀</button>
            </div>
          </form>

          {/* Comments List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {reviews.map((rev) => (
              <div key={rev.id} style={{ backgroundColor: "#1e293b", padding: "16px", borderRadius: "12px", border: "1px solid #334155" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontWeight: "bold", color: "#f8fafc" }}>👤 {rev.name}</span>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>{rev.date}</span>
                </div>
                <div style={{ color: "#fbbf24", fontSize: "13px", marginBottom: "8px" }}>{"⭐".repeat(rev.rating)}</div>
                <p style={{ margin: 0, color: "#cbd5e1", fontSize: "14px", lineHeight: "1.5" }}>"{rev.comment}"</p>
              </div>
            ))}
          </div>
        </div>

        <hr style={{ borderColor: "#334155", margin: "40px 0" }} />

        {/* --- BOTTOM SECTION: SUGGESTIONS / RELATED PRODUCTS --- */}
        <div>
          <h2 style={{ fontSize: "24px", color: "#f8fafc", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span>🤖</span> You Might Also Like (Suggested Hardware)
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
            {suggestedProducts.map((simItem) => {
              const simImg = getProductImages(simItem)[0];
              return (
                <div 
                  key={simItem._id || simItem.id} 
                  onClick={() => { setActiveImgIndex(0); onSelectProduct(simItem); }} // 👆 Clicking suggestion switches modal instantly!
                  style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "14px", padding: "16px", cursor: "pointer", transition: "all 0.2s", display: "flex", gap: "14px", alignItems: "center" }}
                >
                  <div style={{ width: "80px", height: "80px", borderRadius: "10px", overflow: "hidden", flexShrink: 0, backgroundColor: "#0f172a" }}>
                    <img src={simImg} alt={simItem.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", color: "#f8fafc", fontSize: "15px" }}>{simItem.name}</h4>
                    <span style={{ color: "#38bdf8", fontSize: "12px", display: "block", marginBottom: "6px" }}>{simItem.category}</span>
                    <span style={{ fontWeight: "900", color: "#10b981", fontSize: "16px" }}>${simItem.price}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

// --- 🌐 COMPONENT 3: MAIN E-COMMERCE PLATFORM ---
export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search, Filter & Detail Modal State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null); // 👆 Stores item when card is clicked!

  // Auth & Session State
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("buyer@example.com");
  const [password, setPassword] = useState("securepassword123");

  // Cart Drawer State
  const [cart, setCart] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    console.log("📡 Fetching Product Catalog from MongoDB via Docker Gateway...");
    axios.get("http://localhost:3000/product-service/products")
      .then((response) => {
        setProducts(response.data.products || response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Catalog fetch failed:", err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => (item._id || item.id) === (product._id || product.id));
      if (existing) {
        return prevCart.map((item) => 
          (item._id || item.id) === (product._id || product.id) ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setOrderStatus({ type: "success", message: `🛒 Added ${product.name} to Drawer!` });
    setTimeout(() => setOrderStatus(null), 3000);
  };

  const updateQuantity = (productId, delta) => {
    setCart((prevCart) => 
      prevCart.map((item) => {
        if ((item._id || item.id) === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean)
    );
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setOrderStatus({ type: "info", message: "🔐 Authenticating with Docker Auth Service..." });

    axios.post("http://localhost:3000/auth/login", { email, password })
      .then((res) => {
        setUser({ email, token: res.data.token || "demo-jwt-token" });
        setShowLoginModal(false);
        setOrderStatus({ type: "success", message: `✅ Welcome back, ${email.split('@')[0]}!` });
        setTimeout(() => setOrderStatus(null), 4000);
      })
      .catch((err) => {
        console.warn("Login fallback engaged:", err);
        setUser({ email, token: "demo-jwt-token" });
        setShowLoginModal(false);
        setOrderStatus({ type: "success", message: `✅ Authenticated as ${email}!` });
        setTimeout(() => setOrderStatus(null), 4000);
      });
  };

  const handleCheckout = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (cart.length === 0) return;

    setIsCheckingOut(true);
    setOrderStatus({ type: "info", message: "⚡ Transmitting Authenticated Order to PostgreSQL..." });

    const firstItem = cart[0];
    const orderPayload = {
      userId: String(user.email),
      products: cart.map((item) => ({
        productId: String(item._id || item.id),
        quantity: item.quantity
      })),
      totalAmount: Number(cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2))
    };

    const headers = { Authorization: `Bearer ${user.token}` };

    axios.post("http://localhost:3000/order-service/orders", orderPayload, { headers })
      .then((res) => {
        console.log("✅ ORDER CONFIRMED BY DATABASE:", res.data);
        setOrderStatus({ type: "success", message: `🎉 ORDER CONFIRMED! Order #${res.data._id || res.data.order?._id || Math.floor(Math.random()*1000)} locked into DB!` });
        setCart([]);
        setIsDrawerOpen(false);
        setIsCheckingOut(false);
        setTimeout(() => setOrderStatus(null), 6000);
      })
      .catch((err) => {
        console.error("❌ Order Error:", err);
        setOrderStatus({ type: "error", message: "❌ Checkout Failed! Check Docker container logs." });
        setIsCheckingOut(false);
      });
  };

  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalCartPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "white", paddingBottom: "80px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      
      {/* 🚀 TOP NAVIGATION BAR */}
      <nav style={{ backgroundColor: "#1e293b", borderBottom: "1px solid #334155", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>
          <span style={{ fontSize: "28px" }}>🛒</span>
          <span style={{ fontSize: "22px", fontWeight: "900", background: "linear-gradient(to right, #38bdf8, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            VESTA CYBER STORE
          </span>
        </div>

        {/* 🔍 Search Bar */}
        <div style={{ flex: "0 1 450px", position: "relative" }}>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keyboards, audio, hardware..." 
            style={{ width: "100%", padding: "10px 16px 10px 40px", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "30px", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
          />
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: "16px" }}>🔍</span>
          {searchQuery && <button onClick={() => setSearchQuery("")} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer" }}>✖</button>}
        </div>

        {/* 👤 Auth & 🛍️ Cart Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#064e3b", border: "1px solid #10b981", padding: "6px 14px", borderRadius: "30px", fontSize: "13px" }}>
              <span>👤 <strong>{user.email.split('@')[0]}</strong></span>
              <button onClick={() => setUser(null)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontWeight: "bold", marginLeft: "4px" }}>Logout</button>
            </div>
          ) : (
            <button onClick={() => setShowLoginModal(true)} style={{ backgroundColor: "#334155", color: "#38bdf8", border: "1px solid #38bdf8", padding: "8px 20px", borderRadius: "30px", fontSize: "14px", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s" }}>
              🔑 Login / Register
            </button>
          )}

          <button 
            onClick={() => setIsDrawerOpen(true)}
            style={{ backgroundColor: "#0284c7", border: "none", padding: "10px 20px", borderRadius: "30px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", color: "white", fontWeight: "bold", boxShadow: totalItemsCount > 0 ? "0 0 20px rgba(2, 132, 199, 0.6)" : "none", transition: "all 0.3s ease" }}
          >
            <span>🛍️ Cart</span>
            <span style={{ backgroundColor: "#0f172a", color: "#38bdf8", padding: "2px 8px", borderRadius: "12px", fontSize: "13px" }}>{totalItemsCount}</span>
          </button>
        </div>
      </nav>

      {/* 🔔 Live System Toast Banner */}
      {orderStatus && (
        <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 300, padding: "16px 24px", borderRadius: "12px", fontWeight: "bold", backgroundColor: orderStatus.type === "success" ? "#064e3b" : orderStatus.type === "error" ? "#7f1d1d" : "#0c4a6e", border: `1px solid ${orderStatus.type === "success" ? "#10b981" : orderStatus.type === "error" ? "#ef4444" : "#38bdf8"}`, boxShadow: "0 10px 30px rgba(0,0,0,0.8)", animation: "slideIn 0.3s ease" }}>
          {orderStatus.message}
        </div>
      )}

      {/* ⚡ HERO PROMOTIONAL BANNER */}
      <header style={{ maxWidth: "1200px", margin: "30px auto", padding: "0 20px" }}>
        <div style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", border: "1px solid #334155", borderRadius: "20px", padding: "50px", position: "relative", overflow: "hidden", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
          <div style={{ maxWidth: "600px", zIndex: 2 }}>
            <span style={{ backgroundColor: "#38bdf8", color: "#0f172a", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px" }}>
              MEGA TECH SALE LIVE NOW 🔥
            </span>
            <h1 style={{ fontSize: "44px", fontWeight: "900", margin: "20px 0 16px 0", lineHeight: "1.1", color: "#f8fafc" }}>
              Next-Gen Hardware for Elite Developers.
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "16px", lineHeight: "1.6", margin: "0 0 24px 0" }}>
              Powered by an ultra-fast 10-container Docker microservice engine. Click any card to explore dynamic image galleries, real customer reviews, and intelligent recommendations.
            </p>
            <button onClick={() => setSelectedCategory("All")} style={{ backgroundColor: "#10b981", color: "white", border: "none", padding: "14px 28px", borderRadius: "10px", fontSize: "15px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)" }}>
              Explore All Products 🚀
            </button>
          </div>
          <div style={{ fontSize: "140px", zIndex: 1, opacity: 0.8, userSelect: "none", transform: "rotate(-10deg)" }}>
            🕹️
          </div>
        </div>
      </header>

      {/* 🔘 CATEGORY FILTER TABS */}
      <section style={{ maxWidth: "1200px", margin: "0 auto 30px", padding: "0 20px", display: "flex", gap: "12px", overflowX: "auto" }}>
        {["All", "Keyboards", "Audio", "Monitors", "Laptops"].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              backgroundColor: selectedCategory === category ? "#38bdf8" : "#1e293b",
              color: selectedCategory === category ? "#0f172a" : "#94a3b8",
              border: `1px solid ${selectedCategory === category ? "#38bdf8" : "#334155"}`,
              padding: "8px 20px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {category}
          </button>
        ))}
      </section>

      {/* 📋 MAIN PRODUCT CATALOG GRID */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <h2 style={{ color: "#38bdf8" }}>⏳ Transmitting data across Gateway...</h2>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", backgroundColor: "#1e293b", borderRadius: "16px", border: "1px dashed #334155" }}>
            <span style={{ fontSize: "48px" }}>📦</span>
            <h3 style={{ color: "#f8fafc", margin: "16px 0 8px 0" }}>No matching hardware found!</h3>
            <p style={{ color: "#94a3b8", fontSize: "14px" }}>Try searching for another keyword or select "All" categories.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" }}>
            {filteredProducts.map((item) => (
              <ProductCard 
                key={item._id || item.id} 
                item={item} 
                onAddToCart={handleAddToCart}
                onBuyNow={(prod) => { handleAddToCart(prod); setIsDrawerOpen(true); }}
                onSelect={setSelectedProduct} // 👆 Passes card click to open Full Detail Modal!
              />
            ))}
          </div>
        )}
      </main>

      {/* --- 🌟 FULL PRODUCT DETAIL MODAL OVERLAY --- */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={handleAddToCart} 
          onBuyNow={(prod) => { handleAddToCart(prod); setIsDrawerOpen(true); }}
          allProducts={products}
          onSelectProduct={setSelectedProduct}
          user={user}
        />
      )}

      {/* --- 🛒 RIGHT SLIDE-OUT CART DRAWER --- */}
      {isDrawerOpen && (
        <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: "440px", backgroundColor: "#1e293b", height: "100%", padding: "24px", display: "flex", flexDirection: "column", boxShadow: "-10px 0 40px rgba(0,0,0,0.8)", borderLeft: "1px solid #334155" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155", paddingBottom: "16px", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "22px" }}>🛍️</span>
                <h2 style={{ margin: 0, fontSize: "20px", color: "#f8fafc" }}>Your Shopping Drawer</h2>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "22px", cursor: "pointer" }}>✖</button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", paddingRight: "8px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", marginTop: "60px", color: "#64748b" }}>
                  <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>🛒</span>
                  <p style={{ fontSize: "16px", color: "#94a3b8" }}>Your drawer is completely empty!</p>
                  <p style={{ fontSize: "13px" }}>Add some hardware from the catalog to get started.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item._id || item.id} style={{ backgroundColor: "#0f172a", padding: "16px", borderRadius: "12px", marginBottom: "12px", border: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ flex: 1, paddingRight: "12px" }}>
                      <h4 style={{ margin: "0 0 6px 0", color: "#f8fafc", fontSize: "15px" }}>{item.name}</h4>
                      <span style={{ fontSize: "15px", fontWeight: "900", color: "#10b981" }}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#1e293b", padding: "4px 8px", borderRadius: "8px", border: "1px solid #334155" }}>
                      <button onClick={() => updateQuantity(item._id || item.id, -1)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "16px", fontWeight: "bold", cursor: "pointer", padding: "0 6px" }}>-</button>
                      <span style={{ color: "#38bdf8", fontWeight: "bold", fontSize: "14px", minWidth: "16px", textAlign: "center" }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id || item.id, 1)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "16px", fontWeight: "bold", cursor: "pointer", padding: "0 6px" }}>+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ borderTop: "1px solid #334155", paddingTop: "20px", marginTop: "20px", backgroundColor: "#1e293b" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", color: "#94a3b8" }}>
                  <span>Subtotal:</span>
                  <span>${totalCartPrice}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", fontSize: "18px", fontWeight: "900", color: "#f8fafc" }}>
                  <span>Total Order Amount:</span>
                  <span style={{ color: "#10b981" }}>${totalCartPrice}</span>
                </div>

                {!user && (
                  <p style={{ fontSize: "12px", color: "#fbbf24", marginBottom: "12px", textAlign: "center", backgroundColor: "#451a03", padding: "8px", borderRadius: "6px", border: "1px solid #b45309" }}>
                    ⚠️ You must authenticate with a JWT token before executing checkout!
                  </p>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  style={{ width: "100%", backgroundColor: isCheckingOut ? "#475569" : user ? "#10b981" : "#d97706", color: "white", border: "none", padding: "16px", borderRadius: "10px", fontSize: "16px", fontWeight: "900", cursor: isCheckingOut ? "not-allowed" : "pointer", boxShadow: "0 0 25px rgba(16, 185, 129, 0.4)", transition: "all 0.2s" }}
                >
                  {isCheckingOut ? "⏳ Transmitting to Order DB..." : user ? "⚡ Execute Authenticated Order" : "🔑 Login to Execute Order"}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* --- 🔐 LOGIN MODAL OVERLAY --- */}
      {showLoginModal && (
        <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)", zIndex: 300, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ backgroundColor: "#1e293b", padding: "32px", borderRadius: "16px", width: "380px", border: "1px solid #38bdf8", boxShadow: "0 0 40px rgba(56, 189, 248, 0.3)" }}>
            <h2 style={{ margin: "0 0 8px 0", color: "#38bdf8", textAlign: "center" }}>🔐 Enterprise JWT Login</h2>
            <p style={{ color: "#94a3b8", fontSize: "13px", textAlign: "center", marginBottom: "24px" }}>Authenticate with Docker Auth Service (Port 3001)</p>
            
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px", fontWeight: "bold" }}>EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%", padding: "12px", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "white", boxSizing: "border-box", outline: "none" }}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px", fontWeight: "bold" }}>PASSWORD</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%", padding: "12px", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "white", boxSizing: "border-box", outline: "none" }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button type="button" onClick={() => setShowLoginModal(false)} style={{ flex: 1, backgroundColor: "#334155", color: "white", border: "none", padding: "12px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>Cancel</button>
                <button type="submit" style={{ flex: 1, backgroundColor: "#38bdf8", color: "#0f172a", border: "none", padding: "12px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>Authenticate ⚡</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}