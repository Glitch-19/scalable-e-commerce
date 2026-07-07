import { useEffect, useRef, useState } from "react";
import axios from "axios";
import NavigationBar from "./components/NavigationBar.jsx";
import StatusToast from "./components/StatusToast.jsx";
import HeroBanner from "./components/HeroBanner.jsx";
import CategoryFilters from "./components/CategoryFilters.jsx";
import ProductGrid from "./components/ProductGrid.jsx";
import ProductDetailModal from "./components/ProductDetailModal.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import LoginModal from "./components/LoginModal.jsx";

const ORDERS_STORAGE_KEY = "vesta-orders";
const REALTIME_STORAGE_KEY = "vesta-realtime-event";
const REALTIME_CHANNEL_NAME = "vesta-realtime-channel";
const GOOGLE_CLIENT_ID = "74227941157-rnfin93c6vovmqfjvcaq4hdm0bh6gdai.apps.googleusercontent.com";

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const loadOrders = () => {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(ORDERS_STORAGE_KEY), []);
};

const saveOrders = (orders) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
};

const getProductKey = (product) => String(product._id || product.id);

const isGmailEmail = (value) => /@gmail\.com$/i.test(value.trim());

const formatOrderStatus = (order) => {
  if (order.status && order.status !== "Pending") return order.status;

  const createdAt = new Date(order.createdAt).getTime();
  const ageMs = Number.isFinite(createdAt) ? Date.now() - createdAt : 0;

  if (ageMs > 1000 * 60 * 60 * 24 * 2) return "Delivered";
  if (ageMs > 1000 * 60 * 60 * 24) return "Shipped";
  return "Pending";
};

function PaymentModal({ totalAmount, isProcessing, paymentError, cardNumber, setCardNumber, expiry, setExpiry, cvv, setCvv, onClose, onSubmit }) {
  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.62)", backdropFilter: "blur(4px)", zIndex: 450, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "460px", backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #d5d9d9", boxShadow: "0 12px 36px rgba(15, 17, 17, 0.2)", padding: "28px" }}>
        <h2 style={{ margin: 0, color: "#0f1111", fontSize: "24px" }}>Payment</h2>
        <p style={{ margin: "8px 0 20px", color: "#565959", fontSize: "14px" }}>Enter card details to authorize the order for ${totalAmount}.</p>

        {paymentError && (
          <div style={{ marginBottom: "16px", backgroundColor: "#fff4f4", color: "#b12704", border: "1px solid #ffd2d2", borderRadius: "8px", padding: "10px 12px", fontSize: "13px" }}>
            {paymentError}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: "700", color: "#565959" }}>CARD NUMBER</label>
            <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" inputMode="numeric" style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #d5d9d9", outline: "none" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "18px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: "700", color: "#565959" }}>EXPIRY</label>
              <input value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" inputMode="numeric" style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #d5d9d9", outline: "none" }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: "700", color: "#565959" }}>CVV</label>
              <input value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="123" inputMode="numeric" style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #d5d9d9", outline: "none" }} />
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button type="button" onClick={onClose} style={{ flex: 1, backgroundColor: "#f3f4f4", border: "1px solid #d5d9d9", color: "#111827", padding: "12px", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>Cancel</button>
            <button type="submit" disabled={isProcessing} style={{ flex: 1, backgroundColor: isProcessing ? "#d5d9d9" : "#ffd814", border: "1px solid #fcd200", color: "#111827", padding: "12px", borderRadius: "8px", fontWeight: "700", cursor: isProcessing ? "not-allowed" : "pointer" }}>
              {isProcessing ? "Processing..." : "Pay & Place Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProfileModal({ user, orders, onClose, onBuyAgain }) {
  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.62)", backdropFilter: "blur(4px)", zIndex: 420, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "960px", maxHeight: "90vh", overflowY: "auto", backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #d5d9d9", boxShadow: "0 12px 36px rgba(15, 17, 17, 0.2)", padding: "28px", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "18px", right: "18px", width: "40px", height: "40px", borderRadius: "8px", border: "1px solid #d5d9d9", backgroundColor: "#ffffff", cursor: "pointer" }}>✖</button>
        <h2 style={{ margin: 0, color: "#0f1111" }}>My Account</h2>
        <p style={{ margin: "8px 0 24px", color: "#565959" }}>{user.email}</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
          {orders.length === 0 ? (
            <div style={{ padding: "20px", border: "1px dashed #d5d9d9", borderRadius: "12px", color: "#565959" }}>No past orders yet.</div>
          ) : (
            orders.map((order) => (
              <div key={order.id} style={{ border: "1px solid #d5d9d9", borderRadius: "12px", padding: "16px", backgroundColor: "#f7f8f8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "10px" }}>
                  <div>
                    <div style={{ fontWeight: "700", color: "#0f1111" }}>Order #{order.id}</div>
                    <div style={{ color: "#565959", fontSize: "13px" }}>{new Date(order.createdAt).toLocaleString()}</div>
                  </div>
                  <div style={{ backgroundColor: "#ffffff", border: "1px solid #d5d9d9", borderRadius: "999px", padding: "6px 12px", fontSize: "12px", fontWeight: "700" }}>{formatOrderStatus(order)}</div>
                </div>
                <div style={{ color: "#565959", fontSize: "14px", marginBottom: "12px" }}>{order.products.map((item) => `${item.quantity} x ${item.name || item.productId}`).join(" • ")}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ color: "#b12704" }}>${Number(order.totalAmount).toFixed(2)}</strong>
                  <button onClick={() => onBuyAgain(order)} style={{ backgroundColor: "#ffd814", border: "1px solid #fcd200", color: "#111827", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>Buy it Again</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ user, products, liveOrders, onBackHome, onCreateProduct, adminDraft, setAdminDraft }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#eaeded", padding: "24px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ backgroundColor: "#131921", color: "#ffffff", borderRadius: "12px 12px 0 0", padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "12px", color: "#febd69", fontWeight: "700", textTransform: "uppercase" }}>Admin Dashboard</div>
            <h1 style={{ margin: "4px 0 0", fontSize: "22px" }}>God Mode • {user.email}</h1>
          </div>
          <button onClick={onBackHome} style={{ backgroundColor: "#febd69", border: "1px solid #f3a847", color: "#111827", padding: "10px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>Back to Store</button>
        </div>

        <div style={{ backgroundColor: "#ffffff", border: "1px solid #d5d9d9", borderTop: "none", borderRadius: "0 0 12px 12px", padding: "22px", display: "grid", gridTemplateColumns: "360px 1fr", gap: "20px" }}>
          <section style={{ border: "1px solid #d5d9d9", borderRadius: "12px", padding: "18px", backgroundColor: "#f7f8f8" }}>
            <h2 style={{ marginTop: 0, color: "#0f1111" }}>Add New Product</h2>
            <form onSubmit={onCreateProduct}>
              <input value={adminDraft.name} onChange={(e) => setAdminDraft((prev) => ({ ...prev, name: e.target.value }))} placeholder="Product name" style={{ width: "100%", marginBottom: "10px", padding: "10px", borderRadius: "8px", border: "1px solid #d5d9d9" }} />
              <textarea value={adminDraft.description} onChange={(e) => setAdminDraft((prev) => ({ ...prev, description: e.target.value }))} placeholder="Description" rows="4" style={{ width: "100%", marginBottom: "10px", padding: "10px", borderRadius: "8px", border: "1px solid #d5d9d9" }} />
              <input value={adminDraft.price} onChange={(e) => setAdminDraft((prev) => ({ ...prev, price: e.target.value }))} placeholder="Price" type="number" step="0.01" style={{ width: "100%", marginBottom: "10px", padding: "10px", borderRadius: "8px", border: "1px solid #d5d9d9" }} />
              <input value={adminDraft.stock} onChange={(e) => setAdminDraft((prev) => ({ ...prev, stock: e.target.value }))} placeholder="Stock" type="number" style={{ width: "100%", marginBottom: "10px", padding: "10px", borderRadius: "8px", border: "1px solid #d5d9d9" }} />
              <input value={adminDraft.category} onChange={(e) => setAdminDraft((prev) => ({ ...prev, category: e.target.value }))} placeholder="Category" style={{ width: "100%", marginBottom: "14px", padding: "10px", borderRadius: "8px", border: "1px solid #d5d9d9" }} />
              <button type="submit" style={{ width: "100%", backgroundColor: "#ffd814", border: "1px solid #fcd200", color: "#111827", padding: "12px", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>Create Product</button>
            </form>
          </section>

          <section style={{ display: "grid", gap: "18px" }}>
            <div style={{ border: "1px solid #d5d9d9", borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ padding: "14px 16px", backgroundColor: "#f7f8f8", borderBottom: "1px solid #d5d9d9", fontWeight: "700" }}>Live Order Feed</div>
              <div style={{ maxHeight: "340px", overflow: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#ffffff" }}>
                      <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid #d5d9d9" }}>Order</th>
                      <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid #d5d9d9" }}>Customer</th>
                      <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid #d5d9d9" }}>Status</th>
                      <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid #d5d9d9" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveOrders.length === 0 ? (
                      <tr><td colSpan="4" style={{ padding: "16px", color: "#565959" }}>No orders have been synced yet.</td></tr>
                    ) : (
                      liveOrders.map((order) => (
                        <tr key={order.id}>
                          <td style={{ padding: "12px", borderBottom: "1px solid #f0f0f0" }}>#{order.id}</td>
                          <td style={{ padding: "12px", borderBottom: "1px solid #f0f0f0" }}>{order.userEmail}</td>
                          <td style={{ padding: "12px", borderBottom: "1px solid #f0f0f0" }}>{formatOrderStatus(order)}</td>
                          <td style={{ padding: "12px", borderBottom: "1px solid #f0f0f0" }}>${Number(order.totalAmount).toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ border: "1px solid #d5d9d9", borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ padding: "14px 16px", backgroundColor: "#f7f8f8", borderBottom: "1px solid #d5d9d9", fontWeight: "700" }}>Current Catalog Snapshot</div>
              <div style={{ maxHeight: "280px", overflow: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid #d5d9d9" }}>Product</th>
                      <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid #d5d9d9" }}>Stock</th>
                      <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid #d5d9d9" }}>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 10).map((product) => (
                      <tr key={product._id || product.id}>
                        <td style={{ padding: "12px", borderBottom: "1px solid #f0f0f0" }}>{product.name}</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #f0f0f0" }}>{product.stock}</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #f0f0f0" }}>${product.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function UnauthorizedAdminPanel({ onBackHome }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#eaeded", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ backgroundColor: "#ffffff", border: "1px solid #d5d9d9", borderRadius: "12px", padding: "28px", maxWidth: "560px", textAlign: "center" }}>
        <h1 style={{ color: "#0f1111" }}>Admin access only</h1>
        <p style={{ color: "#565959" }}>This route is hidden unless your JWT contains role: Admin.</p>
        <button onClick={onBackHome} style={{ backgroundColor: "#ffd814", border: "1px solid #fcd200", color: "#111827", padding: "12px 18px", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>Back to Store</button>
      </div>
    </div>
  );
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authError, setAuthError] = useState("");
  const [email, setEmail] = useState("buyer@gmail.com");
  const [password, setPassword] = useState("securepassword123");

  const [cart, setCart] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [routePath, setRoutePath] = useState(() => window.location.pathname);
  const [allOrders, setAllOrders] = useState(() => loadOrders());
  const [adminDraft, setAdminDraft] = useState({ name: "", description: "", price: "", stock: "0", category: "" });
  const broadcastChannelRef = useRef(null);

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

  useEffect(() => {
    const handlePopState = () => setRoutePath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") return undefined;

    broadcastChannelRef.current = new BroadcastChannel(REALTIME_CHANNEL_NAME);

    const handleRealtimeEvent = (message) => {
      if (!message || !message.type) return;

      if (message.type === "inventory-updated" && message.stockUpdates) {
        setProducts((currentProducts) => currentProducts.map((product) => {
          const productKey = getProductKey(product);
          if (message.stockUpdates[productKey] === undefined) return product;
          return { ...product, stock: message.stockUpdates[productKey] };
        }));
      }

      if (message.type === "product-created" && message.product) {
        setProducts((currentProducts) => [message.product, ...currentProducts.filter((product) => getProductKey(product) !== getProductKey(message.product))]);
      }

      if (message.type === "order-created" && message.order) {
        setAllOrders((currentOrders) => {
          const nextOrders = [message.order, ...currentOrders.filter((order) => order.id !== message.order.id)];
          saveOrders(nextOrders);
          return nextOrders;
        });

        if (message.stockUpdates) {
          setProducts((currentProducts) => currentProducts.map((product) => {
            const productKey = getProductKey(product);
            if (message.stockUpdates[productKey] === undefined) return product;
            return { ...product, stock: message.stockUpdates[productKey] };
          }));
        }
      }
    };

    broadcastChannelRef.current.onmessage = (event) => handleRealtimeEvent(event.data);

    const handleStorageEvent = (event) => {
      if (event.key === REALTIME_STORAGE_KEY && event.newValue) {
        handleRealtimeEvent(safeParse(event.newValue, null));
      }
      if (event.key === ORDERS_STORAGE_KEY && event.newValue) {
        setAllOrders(safeParse(event.newValue, []));
      }
    };

    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener("storage", handleStorageEvent);
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
    };
  }, []);

  const broadcastRealtimeEvent = (payload) => {
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage(payload);
    }
    window.localStorage.setItem(REALTIME_STORAGE_KEY, JSON.stringify({ ...payload, ts: Date.now() }));
  };

  const updateProductStocks = (items) => {
    const stockUpdates = {};

    setProducts((currentProducts) => currentProducts.map((product) => {
      const matchedItem = items.find((cartItem) => getProductKey(cartItem) === getProductKey(product));
      if (!matchedItem) return product;

      const nextStock = Math.max(0, Number(product.stock || 0) - matchedItem.quantity);
      stockUpdates[getProductKey(product)] = nextStock;
      return { ...product, stock: nextStock };
    }));

    return stockUpdates;
  };

  const persistOrder = (orderRecord) => {
    setAllOrders((currentOrders) => {
      const nextOrders = [orderRecord, ...currentOrders.filter((order) => order.id !== orderRecord.id)];
      saveOrders(nextOrders);
      return nextOrders;
    });
  };

  const handleAddToCart = (product, quantity = 1) => {
    if ((Number(product.stock) || 0) <= 0) {
      setOrderStatus({ type: "error", message: `${product.name} is out of stock.` });
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => getProductKey(item) === getProductKey(product));
      if (existing) {
        return prevCart.map((item) => (getProductKey(item) === getProductKey(product) ? { ...item, quantity: item.quantity + quantity } : item));
      }
      return [...prevCart, { ...product, quantity }];
    });

    setOrderStatus({ type: "success", message: `🛒 Added ${product.name} to cart.` });
    setTimeout(() => setOrderStatus(null), 2500);
  };

  const handleBuyNow = (product) => {
    handleAddToCart(product);
    setIsDrawerOpen(true);
  };

  const updateQuantity = (productId, delta) => {
    setCart((prevCart) => prevCart
      .map((item) => {
        if (getProductKey(item) === String(productId)) {
          const nextQty = item.quantity + delta;
          return nextQty > 0 ? { ...item, quantity: nextQty } : null;
        }
        return item;
      })
      .filter(Boolean));
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError("");

    if (!isGmailEmail(email)) {
      const message = "Use a Gmail address to sign in or register.";
      setAuthError(message);
      setOrderStatus({ type: "error", message });
      return;
    }

    setOrderStatus({ type: "info", message: authMode === "register" ? "📝 Creating account..." : "🔐 Authenticating..." });

    const request = authMode === "register"
      ? axios.post("http://localhost:3000/auth/register", { email, password })
      : axios.post("http://localhost:3000/auth/login", { email, password });

    request
      .then((res) => {
        const authUser = {
          email: res.data.user?.email || email,
          token: res.data.token,
          role: res.data.user?.role || "Customer",
          is_verified: res.data.user?.is_verified ?? true,
          id: res.data.user?.id || null
        };

        setUser(authUser);
        setShowLoginModal(false);
        setOrderStatus({ type: "success", message: authMode === "register" ? `✅ Account created for ${authUser.email}` : `✅ Welcome back, ${authUser.email.split("@")[0]}!` });
        setTimeout(() => setOrderStatus(null), 4000);
      })
      .catch((err) => {
        const message = err.response?.data?.error || err.response?.data?.message || "Unable to authenticate.";
        setAuthError(message);
        setOrderStatus({ type: "error", message });
      });
  };

  const handleGoogleSignIn = (credential) => {
    if (!credential) {
      const message = "Google sign-in did not return a credential.";
      setAuthError(message);
      setOrderStatus({ type: "error", message });
      return;
    }

    setAuthError("");
    setOrderStatus({ type: "info", message: "🔐 Signing in with Google..." });

    axios.post("http://localhost:3000/auth/google", { credential })
      .then((res) => {
        const authUser = {
          email: res.data.user?.email,
          token: res.data.token,
          role: res.data.user?.role || "Customer",
          is_verified: res.data.user?.is_verified ?? true,
          id: res.data.user?.id || null
        };

        setUser(authUser);
        setShowLoginModal(false);
        setOrderStatus({ type: "success", message: `✅ Google sign-in successful for ${authUser.email}` });
        setTimeout(() => setOrderStatus(null), 4000);
      })
      .catch((err) => {
        const message = err.response?.data?.error || err.response?.data?.message || "Unable to authenticate with Google.";
        setAuthError(message);
        setOrderStatus({ type: "error", message });
      });
  };

  const handleCheckout = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (cart.length === 0) return;

    setPaymentError("");
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();

    const normalizedCard = cardNumber.replace(/\s+/g, "");
    const isValidCard = /^\d{13,19}$/.test(normalizedCard);
    const isValidExpiry = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);
    const isValidCvv = /^\d{3,4}$/.test(cvv);

    if (!isValidCard || !isValidExpiry || !isValidCvv) {
      setPaymentError("Enter a valid card number, expiry, and CVV.");
      return;
    }

    setIsCheckingOut(true);
    setShowPaymentModal(false);
    setOrderStatus({ type: "info", message: "💳 Payment authorized. Placing order..." });

    const orderPayload = {
      userId: String(user.email),
      products: cart.map((item) => ({
        productId: String(item._id || item.id),
        quantity: item.quantity,
        name: item.name
      })),
      totalAmount: Number(cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2))
    };

    const headers = { Authorization: `Bearer ${user.token}` };

    axios.post("http://localhost:3000/order-service/orders", orderPayload, { headers })
      .then((res) => {
        const stockUpdates = updateProductStocks(cart);
        const orderRecord = {
          id: res.data.order?._id || res.data._id || `order-${Date.now()}`,
          userEmail: user.email,
          products: cart.map((item) => ({
            productId: String(item._id || item.id),
            name: item.name,
            quantity: item.quantity
          })),
          totalAmount: Number(cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)),
          status: "Pending",
          createdAt: new Date().toISOString()
        };

        persistOrder(orderRecord);
        broadcastRealtimeEvent({ type: "order-created", order: orderRecord, stockUpdates });
        setCart([]);
        setIsDrawerOpen(false);
        setIsCheckingOut(false);
        setCardNumber("");
        setExpiry("");
        setCvv("");
        setOrderStatus({ type: "success", message: `🎉 Order confirmed! Order #${orderRecord.id} saved.` });
        setTimeout(() => setOrderStatus(null), 6000);
      })
      .catch((err) => {
        console.error("❌ Order Error:", err);
        setOrderStatus({ type: "error", message: "❌ Checkout failed. Check Docker logs." });
        setIsCheckingOut(false);
      });
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();

    const payload = {
      name: adminDraft.name.trim(),
      description: adminDraft.description.trim(),
      price: Number(adminDraft.price),
      stock: Number(adminDraft.stock),
      category: adminDraft.category.trim()
    };

    if (!payload.name || !payload.description || Number.isNaN(payload.price) || Number.isNaN(payload.stock)) {
      setOrderStatus({ type: "error", message: "Fill the product form before creating it." });
      return;
    }

    axios.post("http://localhost:3000/product-service/products", payload)
      .then((res) => {
        const createdProduct = res.data.product || payload;
        setProducts((currentProducts) => [createdProduct, ...currentProducts]);
        broadcastRealtimeEvent({ type: "product-created", product: createdProduct });
        setAdminDraft({ name: "", description: "", price: "", stock: "0", category: "" });
        setOrderStatus({ type: "success", message: "Product created." });
      })
      .catch((err) => {
        console.error("❌ Error creating product:", err);
        setOrderStatus({ type: "error", message: "Could not create product." });
      });
  };

  const handleOpenProfile = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setShowProfileModal(true);
  };

  const handleBuyAgain = (order) => {
    order.products.forEach((item) => {
      const matchingProduct = products.find((product) => getProductKey(product) === String(item.productId));
      if (matchingProduct) {
        handleAddToCart(matchingProduct, item.quantity);
      }
    });
    setIsDrawerOpen(true);
    setShowProfileModal(false);
  };

  const navigateHome = () => {
    window.history.pushState({}, "", "/");
    setRoutePath("/");
  };

  const navigateAdmin = () => {
    if (user?.role !== "Admin") {
      setOrderStatus({ type: "error", message: "Admin access only." });
      return;
    }
    window.history.pushState({}, "", "/admin");
    setRoutePath("/admin");
  };

  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalCartPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const myOrders = allOrders
    .filter((order) => order.userEmail === user?.email)
    .map((order) => ({ ...order, status: formatOrderStatus(order) }));

  if (routePath === "/admin") {
    if (!user || user.role !== "Admin") {
      return <UnauthorizedAdminPanel onBackHome={navigateHome} />;
    }

    return (
      <AdminDashboard
        user={user}
        products={products}
        liveOrders={allOrders.map((order) => ({ ...order, status: formatOrderStatus(order) }))}
        onBackHome={navigateHome}
        onCreateProduct={handleCreateProduct}
        adminDraft={adminDraft}
        setAdminDraft={setAdminDraft}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#eaeded", color: "#111827", paddingBottom: "80px" }}>
      <NavigationBar
        user={user}
        onLogout={() => setUser(null)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery("")}
        onOpenLogin={() => setShowLoginModal(true)}
        onOpenCart={() => setIsDrawerOpen(true)}
        onOpenProfile={handleOpenProfile}
        onOpenAdmin={navigateAdmin}
        isAdmin={user?.role === "Admin"}
        totalItemsCount={totalItemsCount}
        onResetFilters={() => {
          setSearchQuery("");
          setSelectedCategory("All");
        }}
      />

      <StatusToast orderStatus={orderStatus} />

      <HeroBanner onExploreAll={() => setSelectedCategory("All")} />

      <CategoryFilters selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      <ProductGrid
        loading={loading}
        filteredProducts={filteredProducts}
        handleAddToCart={handleAddToCart}
        handleBuyNow={handleBuyNow}
        onSelectProduct={setSelectedProduct}
      />

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          allProducts={products}
          onSelectProduct={setSelectedProduct}
          user={user}
        />
      )}

      {isDrawerOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setIsDrawerOpen(false)}
          updateQuantity={updateQuantity}
          totalCartPrice={totalCartPrice}
          isCheckingOut={isCheckingOut}
          user={user}
          handleCheckout={handleCheckout}
        />
      )}

      {showLoginModal && (
        <LoginModal
          authMode={authMode}
          onChangeAuthMode={setAuthMode}
          authError={authError}
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          handleAuthSubmit={handleAuthSubmit}
          onGoogleSignIn={handleGoogleSignIn}
          googleClientId={GOOGLE_CLIENT_ID}
          onClose={() => setShowLoginModal(false)}
        />
      )}

      {showPaymentModal && (
        <PaymentModal
          totalAmount={totalCartPrice}
          isProcessing={isCheckingOut}
          paymentError={paymentError}
          cardNumber={cardNumber}
          setCardNumber={setCardNumber}
          expiry={expiry}
          setExpiry={setExpiry}
          cvv={cvv}
          setCvv={setCvv}
          onClose={() => setShowPaymentModal(false)}
          onSubmit={handlePaymentSubmit}
        />
      )}

      {showProfileModal && user && (
        <ProfileModal
          user={user}
          orders={myOrders}
          onClose={() => setShowProfileModal(false)}
          onBuyAgain={handleBuyAgain}
        />
      )}
    </div>
  );
}
