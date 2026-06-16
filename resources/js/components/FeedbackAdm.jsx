import React from "react";
import { router } from "@inertiajs/react";

export default function FeedbackAdm({ feedbacks, currentIndex, onPrev, onNext, isMobile = false }) {
  const feedback = feedbacks[currentIndex];

  if (!feedback) {
    return (
      <p style={{ fontFamily: "'Glacial Indifference', sans-serif", textAlign: "center", color: "#999" }}>
        Nenhum feedback encontrado.
      </p>
    );
  }

  function handleToggleLeitura() {
    router.patch(`/feedback/${feedback.id}/leitura`, {}, { preserveScroll: true });
  }

  // ── valores que mudam entre mobile e desktop ──────────────────────────
  const arrowSize   = isMobile ? "2rem"   : "3.5rem";
  const cardPad     = isMobile ? "1rem 1.1rem 0.9rem" : "2rem 2.2rem 1.5rem";
  const cardGap     = isMobile ? "0.75rem" : "1.5rem";
  const cardHeight  = isMobile ? "45vh"   : "60vh";   // mesma altura, mas padding menor já resolve
  const textSize    = isMobile ? "0.78rem" : "1.08rem";
  const lineHeight  = isMobile ? 1.2     : 1.65;
  const btnFontSize = isMobile ? "0.7rem"  : "1rem";
  const btnPad      = isMobile ? "0.35rem 1.4rem" : "0.55rem 2.5rem";
  const counterSize = isMobile ? "0.78rem" : "1.05rem";
  const gap         = isMobile ? "0.6rem"  : "1.2rem";

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        gap,
      }}
    >
      {/* Seta esquerda */}
      <button
        onClick={onPrev}
        disabled={currentIndex === 0}
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-60%)",
          background: "none",
          border: "none",
          cursor: currentIndex === 0 ? "not-allowed" : "pointer",
          opacity: currentIndex === 0 ? 0.3 : 1,
          zIndex: 2,
          padding: "0.3rem",
        }}
      >
        <img
          src="/images/esquerda.png"
          alt="Anterior"
          style={{ width: arrowSize, height: arrowSize, objectFit: "contain" }}
        />
      </button>

      {/* Card */}
      <div
        style={{
          background: "#e8dcf8",
          borderRadius: "2rem",
          padding: cardPad,
          width: isMobile ? "calc(100% - 5rem)" : "calc(100% - 8rem)",
          maxWidth: "520px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: cardGap,
          boxShadow: "0 2px 16px rgba(100,37,216,0.07)",
          height: cardHeight,
          boxSizing: "border-box",
        }}
      >
        <p
          style={{
            fontFamily: "'Glacial Indifference', sans-serif",
            fontSize: textSize,
            color: "#3a006f",
            textAlign: "justify",
            margin: 0,
            lineHeight,
            flex: 1,
            overflowY: "auto",
            width: "100%",
          }}
        >
          "{feedback.mensagem}"
        </p>

        <button
          onClick={handleToggleLeitura}
          style={{
            background: "#c3a5ff",
            border: "none",
            borderRadius: "1.5rem",
            cursor: "pointer",
            padding: btnPad,
            fontFamily: "'AGRandir', sans-serif",
            fontSize: btnFontSize,
            color: "#6425d8",
            fontWeight: 700,
            textTransform: "uppercase",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          MARCAR COMO LIDA
        </button>
      </div>

      {/* Seta direita */}
      <button
        onClick={onNext}
        disabled={currentIndex === feedbacks.length - 1}
        style={{
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-60%)",
          background: "none",
          border: "none",
          cursor: currentIndex === feedbacks.length - 1 ? "not-allowed" : "pointer",
          opacity: currentIndex === feedbacks.length - 1 ? 0.3 : 1,
          zIndex: 2,
          padding: "0.3rem",
        }}
      >
        <img
          src="/images/direita.png"
          alt="Próximo"
          style={{ width: arrowSize, height: arrowSize, objectFit: "contain" }}
        />
      </button>

      {/* Counter */}
      <p
        style={{
          fontFamily: "'Glacial Indifference', sans-serif",
          color: "#6425d8",
          fontSize: counterSize,
          margin: 0,
          textAlign: "center",
        }}
      >
        Você tem {feedbacks.length} feedback{feedbacks.length !== 1 ? "s" : ""} não lido
        {feedbacks.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
