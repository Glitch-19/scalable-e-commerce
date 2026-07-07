export default function CategoryFilters({ selectedCategory, onSelectCategory }) {
  const categories = ["All", "Keyboards", "Audio", "Monitors", "Laptops"];

  return (
    <section style={{ maxWidth: "1200px", margin: "0 auto 26px", padding: "0 20px", display: "flex", gap: "10px", overflowX: "auto" }}>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          style={{
            backgroundColor: selectedCategory === category ? "#232f3e" : "#ffffff",
            color: selectedCategory === category ? "#ffffff" : "#111827",
            border: `1px solid ${selectedCategory === category ? "#232f3e" : "#d5d9d9"}`,
            padding: "8px 18px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: selectedCategory === category ? "0 2px 6px rgba(35, 47, 62, 0.2)" : "none"
          }}
        >
          {category}
        </button>
      ))}
    </section>
  );
}
