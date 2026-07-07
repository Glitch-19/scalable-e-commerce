import { useEffect, useState } from "react";

export default function HeroBanner({ onExploreAll }) {
  const promos = [
    {
      eyebrow: "Limited time deal",
      title: "Save on keyboards, audio gear, and more.",
      copy: "Fast shipping, clear pricing, and top-rated hardware in one place."
    },
    {
      eyebrow: "New arrivals",
      title: "Popular picks for workstations and gaming setups.",
      copy: "Browse updated listings with reviews, pricing, and inventory details."
    },
    {
      eyebrow: "Customer favorite",
      title: "Discover essentials that ship fast and sell well.",
      copy: "A simple storefront layout inspired by familiar marketplace shopping."
    }
  ];

  const [activePromo, setActivePromo] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePromo((current) => (current + 1) % promos.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [promos.length]);

  return (
    <header style={{ maxWidth: "1200px", margin: "24px auto", padding: "0 20px" }}>
      <div style={{ background: "linear-gradient(180deg, #ffffff 0%, #f7fafa 100%)", border: "1px solid #d5d9d9", borderRadius: "12px", padding: "34px 42px", position: "relative", overflow: "hidden", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "28px", alignItems: "center", boxShadow: "0 4px 16px rgba(15, 17, 17, 0.08)" }}>
        <div style={{ maxWidth: "600px", zIndex: 2 }}>
          <span style={{ backgroundColor: "#f3f4f4", color: "#0f1111", padding: "5px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.8px" }}>
            Great deals on hardware
          </span>
          <h1 style={{ fontSize: "44px", fontWeight: "700", margin: "18px 0 14px 0", lineHeight: "1.1", color: "#0f1111" }}>
            Shop hardware built for work, play, and everything in between.
          </h1>
          <p style={{ color: "#565959", fontSize: "16px", lineHeight: "1.6", margin: "0 0 22px 0" }}>
            Browse a straightforward marketplace layout with clear pricing, ratings, and product details.
          </p>
          <button onClick={onExploreAll} style={{ backgroundColor: "#febd69", color: "#111827", border: "1px solid #f3a847", padding: "12px 24px", borderRadius: "8px", fontSize: "15px", fontWeight: "700", cursor: "pointer", boxShadow: "0 2px 8px rgba(254, 189, 105, 0.35)" }}>
            Explore all products
          </button>
        </div>

        <div style={{ position: "relative", minHeight: "180px", overflow: "hidden", borderRadius: "10px", border: "1px solid #d5d9d9", backgroundColor: "#ffffff" }}>
          <div style={{ display: "flex", width: `${promos.length * 100}%`, height: "100%", transform: `translateX(-${activePromo * (100 / promos.length)}%)`, transition: "transform 0.55s ease" }}>
            {promos.map((promo) => (
              <div key={promo.title} style={{ width: `${100 / promos.length}%`, padding: "24px", display: "flex", flexDirection: "column", justifyContent: "center", background: "linear-gradient(180deg, #ffffff 0%, #fbfbfb 100%)" }}>
                <span style={{ color: "#c45500", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>{promo.eyebrow}</span>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "24px", lineHeight: "1.2", color: "#0f1111" }}>{promo.title}</h3>
                <p style={{ margin: 0, color: "#565959", fontSize: "15px", lineHeight: "1.5" }}>{promo.copy}</p>
              </div>
            ))}
          </div>

          <div style={{ position: "absolute", left: "16px", bottom: "14px", display: "flex", gap: "6px" }}>
            {promos.map((promo, index) => (
              <button
                key={promo.title}
                onClick={() => setActivePromo(index)}
                style={{ width: activePromo === index ? "18px" : "8px", height: "8px", borderRadius: "999px", border: "none", backgroundColor: activePromo === index ? "#232f3e" : "#c7c7c7", cursor: "pointer", padding: 0, transition: "all 0.2s" }}
                aria-label={`Show promotion ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
