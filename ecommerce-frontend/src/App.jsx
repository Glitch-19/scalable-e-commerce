import { useState, useEffect } from "react";
import axios from "axios";
import NavigationBar from "./components/NavigationBar.jsx";
import StatusToast from "./components/StatusToast.jsx";
import HeroBanner from "./components/HeroBanner.jsx";
import CategoryFilters from "./components/CategoryFilters.jsx";
import ProductGrid from "./components/ProductGrid.jsx";
import ProductDetailModal from "./components/ProductDetailModal.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import LoginModal from "./components/LoginModal.jsx";

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
  const [email, setEmail] = useState("buyer@example.com");
  const [password, setPassword] = useState("securepassword123");

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

  const handleBuyNow = (product) => {
    handleAddToCart(product);
    setIsDrawerOpen(true);
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

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError("");
    setOrderStatus({ type: "info", message: authMode === "register" ? "📝 Creating account with Docker Auth Service..." : "🔐 Authenticating with Docker Auth Service..." });

    if (authMode === "register") {
      axios.post("http://localhost:3000/auth/register", { email, password })
        .then((res) => {
          const token = res.data.token;
          setUser({ email, token });
          setShowLoginModal(false);
          setOrderStatus({ type: "success", message: `✅ Account created for ${email} and signed in!` });
          setTimeout(() => setOrderStatus(null), 4000);
        })
        .catch((err) => {
          const message = err.response?.data?.error || err.response?.data?.message || "Registration failed. Try a different email.";
          setAuthError(message);
          setOrderStatus({ type: "error", message });
        });
      return;
    }

    axios.post("http://localhost:3000/auth/login", { email, password })
      .then((res) => {
        const token = res.data.token;
        setUser({ email, token });
        setShowLoginModal(false);
        setOrderStatus({ type: "success", message: `✅ Welcome back, ${email.split('@')[0]}!` });
        setTimeout(() => setOrderStatus(null), 4000);
      })
      .catch((err) => {
        const message = err.response?.data?.error || err.response?.data?.message || "Unable to authenticate. Check your email and password.";
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

    setIsCheckingOut(true);
    setOrderStatus({ type: "info", message: "⚡ Transmitting Authenticated Order to PostgreSQL..." });

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
        setOrderStatus({ type: "success", message: `🎉 ORDER CONFIRMED! Order #${res.data._id || res.data.order?._id || Math.floor(Math.random() * 1000)} locked into DB!` });
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
    <div style={{ minHeight: "100vh", backgroundColor: "#eaeded", color: "#111827", paddingBottom: "80px" }}>
      <NavigationBar
        user={user}
        onLogout={() => setUser(null)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery("")}
        onOpenLogin={() => setShowLoginModal(true)}
        onOpenCart={() => setIsDrawerOpen(true)}
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
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </div>
  );
}
