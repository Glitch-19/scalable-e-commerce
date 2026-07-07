import { useState } from "react";
import { getProductImages } from "./productImages.js";

export default function ProductDetailModal({ product, onClose, onAddToCart, onBuyNow, allProducts, onSelectProduct, user }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const images = getProductImages(product);

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
      name: user ? user.email.split("@")[0] : "Verified Buyer",
      rating: Number(newRating),
      date: "Just now",
      comment: newComment
    };

    setReviews([newEntry, ...reviews]);
    setNewComment("");
  };

  const suggestedProducts = allProducts
    .filter((item) => (item.category === product.category || !product.category) && (item._id || item.id) !== (product._id || product.id))
    .slice(0, 3);

  return (
    <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 400, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }} onClick={onClose}>
      <div style={{ backgroundColor: "#ffffff", width: "100%", maxWidth: "950px", maxHeight: "90vh", borderRadius: "12px", border: "1px solid #d5d9d9", overflowY: "auto", boxShadow: "0 8px 32px rgba(15, 17, 17, 0.2)", position: "relative", padding: "32px" }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: "absolute", top: "20px", right: "24px", background: "#ffffff", border: "1px solid #d5d9d9", color: "#111827", width: "40px", height: "40px", borderRadius: "8px", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>✖</button>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "32px", marginBottom: "40px" }}>
          <div>
            <div style={{ width: "100%", height: "320px", backgroundColor: "#f7f8f8", borderRadius: "12px", overflow: "hidden", border: "1px solid #d5d9d9", marginBottom: "16px" }}>
              <img src={images[activeImgIndex]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              {images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  style={{ flex: 1, height: "80px", borderRadius: "10px", overflow: "hidden", border: activeImgIndex === idx ? "2px solid #ffa41c" : "1px solid #d5d9d9", cursor: "pointer", opacity: activeImgIndex === idx ? 1 : 0.75, transition: "all 0.2s" }}
                >
                  <img src={img} alt="Thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <span style={{ backgroundColor: "#f3f4f4", color: "#0f1111", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "700", border: "1px solid #d5d9d9" }}>
                {product.category || "Pro Hardware"} • Stock: {product.stock} Units
              </span>
              <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#0f1111", margin: "12px 0 8px 0" }}>{product.name}</h1>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <span style={{ color: "#ffa41c", fontSize: "16px" }}>⭐⭐⭐⭐⭐</span>
                <span style={{ color: "#007185", fontWeight: "700", fontSize: "14px" }}>4.8 out of 5</span>
                <span style={{ color: "#565959" }}>• ({reviews.length} Customer Reviews)</span>
              </div>

              <p style={{ color: "#565959", fontSize: "15px", lineHeight: "1.7", marginBottom: "20px" }}>
                {product.description || "Engineered for elite developers and gamers. Features custom mechanical switches, per-key RGB WebGL lighting mapping, ultra-low latency wireless controller, and aerospace-grade aluminum chassis construction."}
              </p>

              <div style={{ backgroundColor: "#f7f8f8", padding: "16px", borderRadius: "12px", border: "1px solid #d5d9d9", marginBottom: "24px" }}>
                <h4 style={{ margin: "0 0 10px 0", color: "#0f1111", fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px" }}>Technical highlights</h4>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#111827", fontSize: "13px", lineHeight: "1.8" }}>
                  <li><strong>Connectivity:</strong> Ultra-Fast Bluetooth 5.3 + Type-C Braided Cable</li>
                  <li><strong>Compatibility:</strong> Windows, macOS, Linux Ubuntu, and Docker Nodes</li>
                  <li><strong>Warranty:</strong> 2-Year Enterprise Replacement Guarantee</li>
                </ul>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "16px" }}>
                <span style={{ fontSize: "36px", fontWeight: "700", color: "#b12704" }}>${product.price}</span>
                <span style={{ fontSize: "18px", color: "#565959", textDecoration: "line-through" }}>${(product.price * 1.25).toFixed(2)}</span>
                <span style={{ backgroundColor: "#feeccf", color: "#7a2c00", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }}>Save 20%</span>
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  style={{ flex: 1, backgroundColor: "#ffd814", color: "#0f1111", border: "1px solid #fcd200", padding: "14px", borderRadius: "8px", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    onBuyNow(product);
                    onClose();
                  }}
                  style={{ flex: 1, backgroundColor: "#ffa41c", color: "#0f1111", border: "1px solid #e47911", padding: "14px", borderRadius: "8px", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: "#d5d9d9", margin: "40px 0" }} />

        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "24px", color: "#0f1111", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span>💬</span> Customer Reviews & Comments ({reviews.length})
          </h2>

          <form onSubmit={handleAddReview} style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #d5d9d9", marginBottom: "24px" }}>
            <h4 style={{ margin: "0 0 12px 0", color: "#0f1111" }}>Write a Review for {product.name}</h4>
            <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
              <select
                value={newRating}
                onChange={(e) => setNewRating(e.target.value)}
                style={{ backgroundColor: "#ffffff", color: "#111827", border: "1px solid #d5d9d9", padding: "10px", borderRadius: "8px", fontWeight: "700", outline: "none" }}
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
                style={{ flex: 1, padding: "10px 16px", backgroundColor: "#ffffff", border: "1px solid #d5d9d9", borderRadius: "8px", color: "#111827", outline: "none" }}
              />
              <button type="submit" style={{ backgroundColor: "#232f3e", color: "white", border: "none", padding: "10px 24px", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>Post Review</button>
            </div>
          </form>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {reviews.map((rev) => (
              <div key={rev.id} style={{ backgroundColor: "#ffffff", padding: "16px", borderRadius: "12px", border: "1px solid #d5d9d9" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontWeight: "700", color: "#0f1111" }}>👤 {rev.name}</span>
                  <span style={{ fontSize: "12px", color: "#565959" }}>{rev.date}</span>
                </div>
                <div style={{ color: "#ffa41c", fontSize: "13px", marginBottom: "8px" }}>{"⭐".repeat(rev.rating)}</div>
                <p style={{ margin: 0, color: "#111827", fontSize: "14px", lineHeight: "1.5" }}>"{rev.comment}"</p>
              </div>
            ))}
          </div>
        </div>

        <hr style={{ borderColor: "#d5d9d9", margin: "40px 0" }} />

        <div>
          <h2 style={{ fontSize: "24px", color: "#0f1111", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span>🤖</span> You Might Also Like (Suggested Hardware)
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
            {suggestedProducts.map((simItem) => {
              const simImg = getProductImages(simItem)[0];
              return (
                <div
                  key={simItem._id || simItem.id}
                  onClick={() => {
                    setActiveImgIndex(0);
                    onSelectProduct(simItem);
                  }}
                  style={{ backgroundColor: "#ffffff", border: "1px solid #d5d9d9", borderRadius: "12px", padding: "16px", cursor: "pointer", transition: "all 0.2s", display: "flex", gap: "14px", alignItems: "center" }}
                >
                  <div style={{ width: "80px", height: "80px", borderRadius: "10px", overflow: "hidden", flexShrink: 0, backgroundColor: "#f7f8f8" }}>
                    <img src={simImg} alt={simItem.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", color: "#0f1111", fontSize: "15px" }}>{simItem.name}</h4>
                    <span style={{ color: "#007185", fontSize: "12px", display: "block", marginBottom: "6px" }}>{simItem.category}</span>
                    <span style={{ fontWeight: "700", color: "#b12704", fontSize: "16px" }}>${simItem.price}</span>
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
