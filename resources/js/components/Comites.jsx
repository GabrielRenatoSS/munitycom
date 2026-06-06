import React from "react";

export default function Comites({ comites = [] }) {
  if (comites.length === 0) return null;

  return (
    <div style={{ width: "100%" }}>
      <h2
        style={{
          fontFamily: "'Agrandir', sans-serif",
          fontSize: "1.3rem",
          fontWeight: 700,
          color: "#6425d8",
          textAlign: "center",
          margin: "1rem 0 0.7rem",
        }}
      >
        Comitês
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {comites.map((comite) => (
          <div
            key={comite.id}
            style={{
              border: "1.5px solid #6425d8",
              borderRadius: "0.75rem",
              padding: "0.65rem 0.9rem",
              background: "white",
              fontFamily: "'Glacial Indifference', sans-serif",
              fontSize: "0.95rem",
              color: "#333",
            }}
          >
            {comite.name}
          </div>
        ))}
      </div>
    </div>
  );
}
