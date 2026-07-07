export default function NavigationBar({ user, onLogout, searchQuery, onSearchChange, onClearSearch, onOpenLogin, onOpenCart, onOpenProfile, onOpenAdmin, isAdmin, totalItemsCount, onResetFilters }) {
  return (
    <nav style={{ backgroundColor: "#131921", borderBottom: "1px solid #232f3e", padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 10px rgba(0,0,0,0.15)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={onResetFilters}>
        <span style={{ fontSize: "28px" }}>🛒</span>
        <span style={{ fontSize: "22px", fontWeight: "700", color: "#ffffff", letterSpacing: "0.3px" }}>
          VESTA STORE
        </span>
      </div>

      <div style={{ flex: "0 1 450px", position: "relative" }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search keyboards, audio, hardware..."
          style={{ width: "100%", padding: "11px 16px 11px 42px", backgroundColor: "#ffffff", border: "1px solid #cdcdcd", borderRadius: "8px", color: "#111827", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
        />
        <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#666", fontSize: "16px" }}>🔍</span>
        {searchQuery && (
          <button onClick={onClearSearch} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#666", cursor: "pointer" }}>
            ✖
          </button>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button onClick={onOpenProfile} style={{ backgroundColor: "#232f3e", color: "#ffffff", border: "1px solid #37475a", padding: "7px 14px", borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}>
              👤 <strong>{user.email.split("@")[0]}</strong>
            </button>
            {isAdmin && (
              <button onClick={onOpenAdmin} style={{ backgroundColor: "#0f1111", color: "#febd69", border: "1px solid #37475a", padding: "7px 14px", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontWeight: "700" }}>
                Admin
              </button>
            )}
            <button onClick={onLogout} style={{ background: "none", border: "none", color: "#febd69", cursor: "pointer", fontWeight: "bold", marginLeft: "4px" }}>Logout</button>
          </div>
        ) : (
          <button onClick={onOpenLogin} style={{ backgroundColor: "#37475a", color: "#ffffff", border: "1px solid #5c6f82", padding: "8px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s" }}>
            🔑 Login / Register
          </button>
        )}

        <button
          onClick={onOpenCart}
          style={{ backgroundColor: "#febd69", border: "1px solid #f3a847", padding: "10px 20px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", color: "#111827", fontWeight: "700", boxShadow: totalItemsCount > 0 ? "0 4px 12px rgba(254, 189, 105, 0.35)" : "none", transition: "all 0.3s ease" }}
        >
          <span>🛍️ Cart</span>
          <span style={{ backgroundColor: "#ffffff", color: "#111827", padding: "2px 8px", borderRadius: "12px", fontSize: "13px" }}>{totalItemsCount}</span>
        </button>
      </div>
    </nav>
  );
}
