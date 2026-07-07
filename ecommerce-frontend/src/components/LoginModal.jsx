export default function LoginModal({ authMode, onChangeAuthMode, authError, email, password, setEmail, setPassword, handleAuthSubmit, onClose }) {
  return (
    <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)", zIndex: 300, display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "12px", width: "380px", border: "1px solid #d5d9d9", boxShadow: "0 8px 24px rgba(15, 17, 17, 0.18)" }}>
        <h2 style={{ margin: "0 0 8px 0", color: "#0f1111", textAlign: "center" }}>{authMode === "register" ? "Create your account" : "Sign in to your account"}</h2>
        <p style={{ color: "#565959", fontSize: "13px", textAlign: "center", marginBottom: "20px" }}>Authenticate with Docker Auth Service (Port 3001)</p>

        <div style={{ display: "flex", gap: "8px", marginBottom: "18px", backgroundColor: "#f7f8f8", padding: "4px", borderRadius: "8px", border: "1px solid #d5d9d9" }}>
          <button type="button" onClick={() => onChangeAuthMode("login")} style={{ flex: 1, border: "none", borderRadius: "6px", padding: "10px", cursor: "pointer", backgroundColor: authMode === "login" ? "#232f3e" : "transparent", color: authMode === "login" ? "#ffffff" : "#111827", fontWeight: "700" }}>
            Login
          </button>
          <button type="button" onClick={() => onChangeAuthMode("register")} style={{ flex: 1, border: "none", borderRadius: "6px", padding: "10px", cursor: "pointer", backgroundColor: authMode === "register" ? "#232f3e" : "transparent", color: authMode === "register" ? "#ffffff" : "#111827", fontWeight: "700" }}>
            Register
          </button>
        </div>

        <form onSubmit={handleAuthSubmit}>
          {authError && (
            <div style={{ marginBottom: "14px", backgroundColor: "#fff4f4", color: "#b12704", border: "1px solid #ffd2d2", borderRadius: "8px", padding: "10px 12px", fontSize: "13px", lineHeight: "1.4" }}>
              {authError}
            </div>
          )}

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#565959", marginBottom: "6px", fontWeight: "700" }}>EMAIL ADDRESS</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "12px", backgroundColor: "#ffffff", border: "1px solid #d5d9d9", borderRadius: "8px", color: "#111827", boxSizing: "border-box", outline: "none" }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#565959", marginBottom: "6px", fontWeight: "700" }}>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "12px", backgroundColor: "#ffffff", border: "1px solid #d5d9d9", borderRadius: "8px", color: "#111827", boxSizing: "border-box", outline: "none" }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button type="button" onClick={onClose} style={{ flex: 1, backgroundColor: "#f3f4f4", color: "#111827", border: "1px solid #d5d9d9", padding: "12px", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>Cancel</button>
            <button type="submit" style={{ flex: 1, backgroundColor: "#ffd814", color: "#111827", border: "1px solid #fcd200", padding: "12px", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>{authMode === "register" ? "Create account" : "Sign in"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
