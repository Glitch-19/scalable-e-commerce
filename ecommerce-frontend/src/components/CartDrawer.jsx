export default function CartDrawer({ cart, onClose, updateQuantity, totalCartPrice, isCheckingOut, user, handleCheckout }) {
  return (
    <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)", zIndex: 200, display: "flex", justifyContent: "flex-end" }}>
      <div style={{ width: "440px", backgroundColor: "#ffffff", height: "100%", padding: "24px", display: "flex", flexDirection: "column", boxShadow: "-10px 0 30px rgba(15, 17, 17, 0.2)", borderLeft: "1px solid #d5d9d9" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #d5d9d9", paddingBottom: "16px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "22px" }}>🛍️</span>
            <h2 style={{ margin: 0, fontSize: "20px", color: "#0f1111" }}>Your Shopping Cart</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#565959", fontSize: "22px", cursor: "pointer", borderRadius: "6px" }}>✖</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", paddingRight: "8px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: "60px", color: "#565959" }}>
              <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>🛒</span>
              <p style={{ fontSize: "16px", color: "#565959" }}>Your cart is empty.</p>
              <p style={{ fontSize: "13px" }}>Add some hardware from the catalog to get started.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item._id || item.id} style={{ backgroundColor: "#ffffff", padding: "16px", borderRadius: "10px", marginBottom: "12px", border: "1px solid #d5d9d9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1, paddingRight: "12px" }}>
                  <h4 style={{ margin: "0 0 6px 0", color: "#0f1111", fontSize: "15px" }}>{item.name}</h4>
                  <span style={{ fontSize: "15px", fontWeight: "700", color: "#b12704" }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#f7f8f8", padding: "4px 8px", borderRadius: "8px", border: "1px solid #d5d9d9" }}>
                  <button onClick={() => updateQuantity(item._id || item.id, -1)} style={{ background: "none", border: "none", color: "#565959", fontSize: "16px", fontWeight: "bold", cursor: "pointer", padding: "0 6px" }}>-</button>
                  <span style={{ color: "#0f1111", fontWeight: "bold", fontSize: "14px", minWidth: "16px", textAlign: "center" }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id || item.id, 1)} style={{ background: "none", border: "none", color: "#565959", fontSize: "16px", fontWeight: "bold", cursor: "pointer", padding: "0 6px" }}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ borderTop: "1px solid #d5d9d9", paddingTop: "20px", marginTop: "20px", backgroundColor: "#ffffff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", color: "#565959" }}>
              <span>Subtotal:</span>
              <span>${totalCartPrice}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", fontSize: "18px", fontWeight: "700", color: "#0f1111" }}>
              <span>Total Order Amount:</span>
              <span style={{ color: "#b12704" }}>${totalCartPrice}</span>
            </div>

            {!user && (
              <p style={{ fontSize: "12px", color: "#7a2c00", marginBottom: "12px", textAlign: "center", backgroundColor: "#fff4e5", padding: "8px", borderRadius: "6px", border: "1px solid #f3a847" }}>
                ⚠️ You must authenticate with a JWT token before executing checkout!
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              style={{ width: "100%", backgroundColor: isCheckingOut ? "#b9c0c6" : user ? "#ffd814" : "#ffa41c", color: "#0f1111", border: "1px solid #d5d9d9", padding: "16px", borderRadius: "8px", fontSize: "16px", fontWeight: "700", cursor: isCheckingOut ? "not-allowed" : "pointer", boxShadow: "none", transition: "all 0.2s" }}
            >
              {isCheckingOut ? "⏳ Processing Payment..." : user ? "💳 Proceed to Payment" : "🔑 Login to Checkout"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
