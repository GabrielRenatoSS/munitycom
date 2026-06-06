import React from "react";
import { router } from "@inertiajs/react";

const NIVEIS = {
  0: { titulo: null,                    img: "/images/p-0.png" },
  1: { titulo: "Delegado Emergente",    img: "/images/p-1.png" },
  2: { titulo: "Delegado Ativo",        img: "/images/p-2.png" },
  3: { titulo: "Chair Reconhecido",     img: "/images/p-3.png" },
  4: { titulo: "Diretor de Conferência",img: "/images/p-4.png" },
  5: { titulo: "Secretário Honorário",  img: "/images/p-5.png" },
  6: { titulo: "Outstanding Delegate",  img: "/images/p-6.png" },
  7: { titulo: "Best Delegate",         img: "/images/p-7.png" },
};

export default function Progresso({ user }) {
  const isMun = user.tipo === 1;
  const nivel = isMun ? 0 : (user.progresso ?? 0);
  const config = NIVEIS[nivel] ?? NIVEIS[0];

  const btnLabel = isMun ? "GERENCIAR EDIÇÕES" : "VER PROGRESSO";
  const btnAction = isMun
    ? () => router.get(`/edicoes/${user.username}`)
    : () => router.get(`/profile/${user.username}/progresso`);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#ddd3f3",
        borderRadius: "13px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 0.8rem",
        overflow: "hidden",
      }}
    >
      {/* Título (só se tiver) */}
      {config.titulo && (
        <div
          style={{
            background: "#6425d8",
            borderRadius: "10px",
            padding: "0.4rem 1rem",
            width: "100%",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'AGRandir', sans-serif",
              fontSize: "clamp(0.9rem, 1.5vw, 1.4rem)",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {config.titulo}
          </span>
        </div>
      )}

      {/* Imagem central */}
      <img
        src={config.img}
        alt={config.titulo || "progresso"}
        style={{
          flex: 1,
          maxWidth: "100%",
          objectFit: "contain",
          minHeight: 0,
          padding: "0.5rem 0",
        }}
      />

      {/* Botão */}
      {(isMun || nivel > 0) && (
      <button
        onClick={btnAction}
        className="rounded-full transition-all hover:brightness-110 active:scale-95"
        style={{
          background: "#c3a5ff",
          border: "none",
          cursor: "pointer",
          width: "90%",
          padding: "0.4rem 0.6rem",
          wordBreak: "break-word",
          whiteSpace: "normal",
          textAlign: "center",
          fontFamily: "'AGRandir', sans-serif",
          fontSize: "clamp(0.5rem, 3vw, 1.2rem)",
          fontWeight: 700,
          color: "#6425d8",
          textTransform: "uppercase",
          borderRadius: "50px",
        }}
      >
        {btnLabel}
      </button>
      )}
    </div>
  );
}
