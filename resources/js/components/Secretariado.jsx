import React from "react";
import { router } from "@inertiajs/react";

export default function Secretariado({ membros = [] }) {
  if (membros.length === 0) return null;

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
        Secretariado
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {membros.map((membro, i) => (
          <button
            key={i}
            onClick={() => router.visit(`/profile/${membro.username}`)}
            style={{
              border: "1.5px solid #6425d8",
              borderRadius: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.5rem 0.9rem",
              background: "white",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
            }}
          >
            <img
              src={membro.foto}
              alt={membro.username}
              style={{ width: "2.4rem", height: "2.4rem", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontFamily: "'Glacial Indifference', sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#6425d8",
                }}
              >
                @{membro.username}
              </span>
              <span
                style={{
                  fontFamily: "'Glacial Indifference', sans-serif",
                  fontSize: "0.85rem",
                  color: "#333",
                }}
              >
                {membro.cargo}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
