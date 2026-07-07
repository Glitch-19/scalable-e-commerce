export default function StatusToast({ orderStatus }) {
  if (!orderStatus) return null;

  return (
    <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 300, padding: "14px 18px", borderRadius: "10px", fontWeight: "700", backgroundColor: orderStatus.type === "success" ? "#f0fff4" : orderStatus.type === "error" ? "#fff5f5" : "#eef6fb", color: "#111827", border: `1px solid ${orderStatus.type === "success" ? "#d6f5de" : orderStatus.type === "error" ? "#ffd7d7" : "#cfe4f2"}`, boxShadow: "0 6px 18px rgba(15, 17, 17, 0.12)", animation: "slideIn 0.3s ease" }}>
      {orderStatus.message}
    </div>
  );
}
