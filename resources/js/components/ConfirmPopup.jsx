import React, { useRef, useEffect } from "react";

export default function ConfirmPopup({ mensagem, onConfirm, onCancel, style = {} }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onCancel();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onCancel]);

  const btnStyle = {
    background: "#c3a5ff",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    fontFamily: "'Agrandir', sans-serif",
    fontSize: "clamp(1rem, 3.5vw, 1.4rem)",
    padding: "0rem clamp(0.8rem, 3vw, 1.5rem)",
    color: "#6425d8",
    fontWeight: 700,
    maxHeight: "2.5rem",
  };

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        right: 0,
        top: "2rem",
        background: "#ddd3f3",
        borderRadius: "15%",
        padding: "0.8rem 1rem",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.6rem",
        minWidth: "180px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
      }}
    >
      <p
        style={{
          fontFamily: "'Glacial Indifference', sans-serif",
          fontSize: "clamp(0.85rem, 3.5vw, 1.2rem)",
          color: "#000",
          textAlign: "center",
          lineHeight: 1.2,
          margin: 0,
        }}
      >
        {mensagem}
      </p>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={onConfirm} style={btnStyle}>SIM</button>
        <button onClick={onCancel}  style={btnStyle}>NÃO</button>
      </div>
    </div>
  );
}
