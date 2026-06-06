import React, { useEffect } from "react";
import Listagem from "./Listagem";

const TITULOS = {
  following: "contatos diplomáticos",
  followers: "audiências diplomáticas",
  friends:   "aliados de conferência",
};

export default function ModalLista({ user, tipo, isOwnProfile, onClose }) {
  const titulo = TITULOS[tipo] ?? tipo;

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
      {/* ══════════ DESKTOP — backdrop blur ══════════ */}
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
            width: "clamp(320px, 45vw, 600px)",
            maxHeight: "75vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(100, 37, 216, 0.18)",
          }}
        >
          {/* Cabeçalho */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.2rem 1.5rem 0.8rem",
            flexShrink: 0,
          }}>
            <h2 style={{
              fontFamily: "'Tan Nimbus', 'Agrandir', sans-serif",
              fontSize: "clamp(1.8rem, 3vw, 2rem)",
              color: "#8c52ff",
              margin: 0,
              fontWeight: 700,
              lineHeight: 1,
              textAlign: "center",
              flex: 1,
            }}>
              {titulo}
            </h2>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}
            >
              <img
                src="/images/logout-menu.png"
                alt="fechar"
                style={{ width: 28, height: 28, objectFit: "contain", transform: "scaleX(-1)" }}
              />
            </button>
          </div>

          {/* Lista com scroll branco */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "0 1.5rem 1.2rem",
            scrollbarColor: "#fff transparent",
            scrollbarWidth: "thin",
          }}>
            <style>{`
              .modal-lista-scroll::-webkit-scrollbar { width: 6px; }
              .modal-lista-scroll::-webkit-scrollbar-thumb { background: #fff; border-radius: 99px; }
              .modal-lista-scroll::-webkit-scrollbar-track { background: transparent; }
            `}</style>
            <div className="modal-lista-scroll" style={{ height: "100%" }}>
              <Listagem userId={user.username} tipo={tipo} isOwnProfile={isOwnProfile} />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ MOBILE — tela cheia entre menus ══════════ */}
      <div
        className="flex md:hidden"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          flexDirection: "column",
          alignItems: "stretch",
          padding: "calc(44px + 0.5rem) 0.6rem calc(44x + 0.6rem)",
          background: "rgba(100, 37, 216, 0.10)",
        }}
      >
        <div style={{
          background: "#ddd3f3",
          borderRadius: "20px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: 0,
        }}>
          {/* Cabeçalho */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1rem 0.6rem",
            flexShrink: 0,
          }}>
            <h2 style={{
              fontFamily: "'Tan Nimbus', 'Agrandir', sans-serif",
              fontSize: "clamp(1.2rem, 6vw, 1.8rem)",
              color: "#8c52ff",
              margin: 0,
              fontWeight: 700,
              lineHeight: 1,
              textAlign: "center",
              flex: 1,
            }}>
              {titulo}
            </h2>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}
            >
              <img
                src="/images/logout-menu.png"
                alt="fechar"
                style={{ width: 22, height: 22, objectFit: "contain", transform: "scaleX(-1)" }}
              />
            </button>
          </div>

          {/* Lista com scroll branco */}
          <div
            className="modal-lista-scroll"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "0 1rem 1rem",
              scrollbarColor: "#fff transparent",
              scrollbarWidth: "thin",
            }}
          >
            <style>{`
              .modal-lista-scroll::-webkit-scrollbar { width: 6px; }
              .modal-lista-scroll::-webkit-scrollbar-thumb { background: #fff; border-radius: 99px; }
              .modal-lista-scroll::-webkit-scrollbar-track { background: transparent; }
            `}</style>
            <Listagem userId={user.username} tipo={tipo} isOwnProfile={isOwnProfile} />
          </div>
        </div>
      </div>
    </>
  );
}
