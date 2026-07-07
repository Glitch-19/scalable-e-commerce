import { useState } from "react";
import { getProductImages } from "./productImages.js";

export default function ProductCard({ item, onAddToCart, onBuyNow, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const images = getProductImages(item);
  const rating = item.rating || 4.8;
  const reviewsCount = item.reviews || 124;
  const oldPrice = (item.price * 1.25).toFixed(2);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveImgIndex(0);
      }}
      onClick={() => onSelect(item)}
      style={{
        backgroundColor: "#ffffff",
        border: isHovered ? "1px solid #f0ad64" : "1px solid #d5d9d9",
        borderRadius: "12px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: isHovered ? "0 8px 24px rgba(15, 17, 17, 0.12)" : "0 2px 8px rgba(15, 17, 17, 0.08)",
        transition: "all 0.3s ease",
        transform: isHovered ? "translateY(-5px)" : "translateY(0)",
        cursor: "pointer"
      }}
    >
      <div style={{ position: "relative", height: "210px", backgroundColor: "#f7f8f8", overflow: "hidden" }}>
        <img
          src={images[activeImgIndex]}
          alt={item.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease", transform: isHovered ? "scale(1.08)" : "scale(1)" }}
        />
        <span style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "#cc0c39", color: "white", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "700" }}>
          20% OFF 🔥
        </span>

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

      <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
            <span style={{ color: "#ffa41c", fontSize: "14px" }}>⭐⭐⭐⭐⭐</span>
            <span style={{ color: "#007185", fontSize: "12px", fontWeight: "700" }}>({rating}) • {reviewsCount} reviews</span>
          </div>
          <h3 style={{ margin: "0 0 8px 0", color: "#0f1111", fontSize: "18px", fontWeight: "700" }}>{item.name}</h3>
          <p style={{ color: "#565959", fontSize: "13px", lineHeight: "1.5", margin: "0 0 16px 0", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {item.description || "High-performance hardware with per-key RGB backlighting and aerospace aluminum construction."}
          </p>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "16px" }}>
            <span style={{ fontSize: "24px", fontWeight: "700", color: "#b12704" }}>${item.price}</span>
            <span style={{ fontSize: "14px", color: "#565959", textDecoration: "line-through" }}>${oldPrice}</span>
          </div>

          <div style={{ display: "flex", gap: "10px" }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onAddToCart(item)}
              style={{ flex: 1, backgroundColor: "#ffd814", color: "#0f1111", border: "1px solid #fcd200", padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
            >
              Add to Cart
            </button>
            <button
              onClick={() => onBuyNow(item)}
              style={{ flex: 1, backgroundColor: "#ffa41c", color: "#0f1111", border: "1px solid #e47911", padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
