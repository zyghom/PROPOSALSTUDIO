export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: "28px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#353535",
        color: "#fff",
        borderRadius: "999px",
        padding: "12px 24px",
        fontSize: "13px",
        fontWeight: 500,
        zIndex: 200,
      }}
    >
      {message}
    </div>
  );
}
