import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ loading, filteredProducts, handleAddToCart, handleBuyNow, onSelectProduct }) {
  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
      {loading ? (
        <div style={{ textAlign: "center", padding: "100px 0", backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #d5d9d9" }}>
          <h2 style={{ color: "#232f3e" }}>Loading catalog...</h2>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", backgroundColor: "#ffffff", borderRadius: "12px", border: "1px dashed #d5d9d9" }}>
          <span style={{ fontSize: "48px" }}>📦</span>
          <h3 style={{ color: "#111827", margin: "16px 0 8px 0" }}>No matching hardware found!</h3>
          <p style={{ color: "#565959", fontSize: "14px" }}>Try a different keyword or select "All" categories.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "22px" }}>
          {filteredProducts.map((item) => (
            <ProductCard
              key={item._id || item.id}
              item={item}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      )}
    </main>
  );
}
