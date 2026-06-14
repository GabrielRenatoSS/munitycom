import React from "react";

const MEDAL = {
  1: "/images/ouro.png",
  2: "/images/prata.png",
  3: "/images/bronze.png",
};

function getBg(posicao) {
  if (posicao <= 3) return "#8c52ff";
  if (posicao <= 10) return "#c5a7ff";
  return "#ffffff";
}

function getTextColor(posicao) {
  return posicao <= 10 ? "#ffffff" : "#6425d8";
}

function getSubTextColor(posicao) {
  return posicao <= 10 ? "#f0e8ff" : "#555";
}

export default function Premiado({ posicao, username, awards_count, foto }) {
  const bg = getBg(posicao);
  const textColor = getTextColor(posicao);
  const subColor = getSubTextColor(posicao);
  const medal = MEDAL[posicao];
  const posStr = String(posicao).padStart(2, "0");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: bg,
        borderRadius: "1rem",
        padding: "clamp(0.5rem, 2vw, 1rem) clamp(0.6rem, 2.5vw, 1.1rem)",
        marginBottom: "0.5rem",
        position: "relative",
        boxShadow: posicao <= 3 ? "0 2px 12px #8c52ff44" : "none",
        border: posicao > 10 ? "1.5px solid #e0d0ff" : "none",
        minHeight: "clamp(3rem, 8vw, 4.8rem)",
      }}
    >
      {/* Número */}
      <span
        style={{
          fontFamily: "Agrandir, sans-serif",
          fontWeight: 900,
          fontSize: "clamp(1rem, 4vw, 1.6rem)",
          color: textColor,
          minWidth: "clamp(1.8rem, 6vw, 3rem)",
          letterSpacing: "-0.02em",
        }}
      >
        {posStr}
      </span>

      {/* Avatar */}
      <div
        style={{
          width: "clamp(2rem, 7vw, 3rem)",
          height: "clamp(2rem, 7vw, 3rem)",
          borderRadius: "50%",
          overflow: "hidden",
          background: "#d4b8ff",
          flexShrink: 0,
          marginRight: "clamp(0.4rem, 2vw, 0.9rem)",
        }}
      >
        {foto ? (
          <img
            src={foto}
            alt={username}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
            <circle cx="20" cy="16" r="8" fill="#a07ee0" />
            <ellipse cx="20" cy="34" rx="13" ry="8" fill="#a07ee0" />
          </svg>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "Glacial Indifference, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(0.7rem, 3vw, 1rem)",
            color: textColor,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          @{username}
        </div>
        <div
          style={{
            fontFamily: "Glacial Indifference, sans-serif",
            fontSize: "clamp(0.6rem, 2.5vw, 0.82rem)",
            color: subColor,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {String(awards_count).padStart(2, "0")} prêmio{awards_count !== 1 ? "s" : ""} em MUNs
        </div>
      </div>

      {/* Medalha */}
      {medal && (
      <img
        src={medal}
        alt={`${posicao}º lugar`}
        style={{
          height: "clamp(2.5rem, 8vw, 4.2rem)",
          width: "auto",
          position: "absolute",
          right: "clamp(0.3rem, 2vw, 0.7rem)",
          top: 0,
        }}
      />
    )}
    </div>
  );
}
