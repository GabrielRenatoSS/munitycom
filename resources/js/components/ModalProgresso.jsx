import React, { useState, useEffect } from "react";

const NIVEIS = {
  1: {
    desktop:      "/images/progresso-desktop/nivel1.png",
    desktopAlt:   "/images/progresso-desktop/nivel1-popup.png",
    mobile:       "/images/progresso-mobile/n1-mob.png",
    mobileAlt:    "/images/progresso-mobile/n1-popup-mob.png",
  },
  2: {
    desktop:      "/images/progresso-desktop/nivel2.png",
    desktopAlt:   "/images/progresso-desktop/nivel2-popup.png",
    mobile:       "/images/progresso-mobile/n2-mob.png",
    mobileAlt:    "/images/progresso-mobile/n2-popup-mob.png",
  },
  3: {
    desktop:      "/images/progresso-desktop/nivel3.png",
    desktopAlt:   "/images/progresso-desktop/nivel3-popup.png",
    mobile:       "/images/progresso-mobile/n3-mob.png",
    mobileAlt:    "/images/progresso-mobile/n3-popup-mob.png",
  },
  4: {
    desktop:      "/images/progresso-desktop/nivel4.png",
    desktopAlt:   "/images/progresso-desktop/nivel4-popup.png",
    mobile:       "/images/progresso-mobile/n4-mob.png",
    mobileAlt:    "/images/progresso-mobile/n4-popup-mob.png",
  },
  5: {
    desktop:      "/images/progresso-desktop/nivel5.png",
    desktopAlt:   "/images/progresso-desktop/nivel5-popup.png",
    mobile:       "/images/progresso-mobile/n5-mob.png",
    mobileAlt:    "/images/progresso-mobile/n5-popup-mob.png",
  },
  6: {
    desktop:      "/images/progresso-desktop/nivel6.png",
    desktopAlt:   "/images/progresso-desktop/nivel6-popup.png",
    mobile:       "/images/progresso-mobile/n6-mob.png",
    mobileAlt:    "/images/progresso-mobile/n6-popup-mob.png",
  },
  7: {
    desktop:      "/images/progresso-desktop/nivel7.png",
    desktopAlt:   "/images/progresso-desktop/nivel7-popup.png",
    mobile:       "/images/progresso-mobile/n7-mob.png",
    mobileAlt:    "/images/progresso-mobile/n7-popup-mob.png",
  },
};

export default function ModalProgresso({ user, onClose }) {
  const nivel = user.progresso ?? 1;
  const config = NIVEIS[nivel] ?? NIVEIS[1];

  const [flipped, setFlipped] = useState(false);

  // Fecha com ESC
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Impede scroll do body enquanto modal aberto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <>
      {/* ══════════ DESKTOP ══════════ */}
      <div
        className="hidden md:flex"
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(100, 37, 216, 0.15)",
          backdropFilter: "blur(6px)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: "#ddd3f3",
            borderRadius: "24px",
            width: "clamp(480px, 65vw, 900px)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(100, 37, 216, 0.18)",
          }}
        >
          {/* Botão fechar */}
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "1rem 1.2rem 0.4rem",
            flexShrink: 0,
          }}>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <img
                src="/images/logout-menu.png"
                alt="fechar"
                style={{ width: 28, height: 28, objectFit: "contain", transform: "scaleX(-1)" }}
              />
            </button>
          </div>

          {/* Imagem */}
          <div style={{ padding: "0 1.5rem 1.5rem" }}>
            <img
              src={flipped ? config.desktopAlt : config.desktop}
              alt={`nível ${nivel}`}
              onClick={() => setFlipped(f => !f)}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                cursor: "pointer",
                borderRadius: "12px",
                display: "block",
              }}
            />
          </div>
        </div>
      </div>

      {/* ══════════ MOBILE ══════════ */}
      <div
        className="flex md:hidden"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          flexDirection: "column",
          alignItems: "stretch",
          padding: "calc(44px + 0.5rem) 0.6rem calc(44px + 0.6rem)",
          background: "rgba(100, 37, 216, 0.10)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: "#ddd3f3",
            borderRadius: "20px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          {/* Botão fechar */}
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "0.8rem 0.8rem 0.3rem",
            flexShrink: 0,
          }}>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <img
                src="/images/logout-menu.png"
                alt="fechar"
                style={{ width: 22, height: 22, objectFit: "contain", transform: "scaleX(-1)" }}
              />
            </button>
          </div>

          {/* Imagem */}
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 1rem 1rem",
            minHeight: 0,
          }}>
            <img
              src={flipped ? config.mobileAlt : config.mobile}
              alt={`nível ${nivel}`}
              onClick={() => setFlipped(f => !f)}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                cursor: "pointer",
                borderRadius: "10px",
                display: "block",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
