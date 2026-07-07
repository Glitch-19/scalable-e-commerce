import { useEffect, useRef, useState } from "react";

const GOOGLE_SCRIPT_ID = "google-identity-services";

export default function LoginModal({ authMode, onChangeAuthMode, authError, email, password, setEmail, setPassword, handleAuthSubmit, onGoogleSignIn, googleClientId, onClose }) {
  const googleButtonRef = useRef(null);
  const [googleReady, setGoogleReady] = useState(false);

  useEffect(() => {
    if (!googleClientId || !onGoogleSignIn) return undefined;

    let cancelled = false;

    const renderGoogleButton = () => {
      if (cancelled || !window.google?.accounts?.id || !googleButtonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response) => {
          if (!cancelled) {
            onGoogleSignIn(response.credential);
          }
        }
      });

      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: 320,
        shape: "rectangular",
        text: "continue_with",
        logo_alignment: "left"
      });
      setGoogleReady(true);
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
      return () => {
        cancelled = true;
      };
    }

    let script = document.getElementById(GOOGLE_SCRIPT_ID);

    if (!script) {
      script = document.createElement("script");
      script.id = GOOGLE_SCRIPT_ID;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    script.addEventListener("load", renderGoogleButton, { once: true });

    return () => {
      cancelled = true;
      script.removeEventListener("load", renderGoogleButton);
    };
  }, [googleClientId, onGoogleSignIn]);

  return (
    <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)", zIndex: 300, display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "12px", width: "380px", border: "1px solid #d5d9d9", boxShadow: "0 8px 24px rgba(15, 17, 17, 0.18)" }}>
        <h2 style={{ margin: "0 0 8px 0", color: "#0f1111", textAlign: "center" }}>{authMode === "register" ? "Create your account" : "Sign in to your account"}</h2>
        <p style={{ color: "#565959", fontSize: "13px", textAlign: "center", marginBottom: "16px" }}>Use your Gmail password or continue with Google.</p>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "18px", minHeight: "44px" }}>
          <div ref={googleButtonRef} />
        </div>

        {!googleReady && googleClientId && (
          <div style={{ textAlign: "center", color: "#8a8a8a", fontSize: "12px", marginBottom: "18px" }}>
            Loading Google sign-in...
          </div>
        )}

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
