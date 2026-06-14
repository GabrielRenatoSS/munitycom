import React from "react";
import { usePage } from "@inertiajs/react";
import MenuNavegacao from "../../components/MenuNavegacao";
import MenuSuperior from "../../components/MenuSuperior";
import MenuInferior from "../../components/MenuInferior";
import Premiado from "../../components/Premiado";

export default function Ranking() {
  const { ranking, authCard } = usePage().props;

  function AuthCardDesktop() {
    if (!authCard) return null;
    const entry = authCard;
    const posStr = String(entry.posicao).padStart(2, "0");
    const awardsStr = String(entry.awards_count).padStart(2, "0");
    return (
      <div
        style={{
          background: "#ede5ff",
          borderRadius: "1.4rem",
          padding: "2rem 1.5rem 1.8rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          height: "72%",
          justifyContent: "center"
        }}
      >
        {/* Posição */}
        <div style={{ fontFamily: "Agrandir, sans-serif", fontWeight: 900, fontSize: "3.5rem", color: "#6425d8", lineHeight: 1 }}>
          nº {posStr}
        </div>

        {/* Prêmios */}
        <div style={{ fontFamily: "Glacial Indifference, sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#1a1a1a", lineHeight: 1.1 }}>
          {awardsStr} prêmio{entry.awards_count !== 1 ? "s" : ""}
        </div>

        {/* Avatar */}
        <div
          style={{
            width: "10rem",
            height: "10rem",
            borderRadius: "50%",
            overflow: "hidden",
            background: "#c5a7ff",
            marginTop: "0.8rem",
            flexShrink: 0,
          }}
        >
          {entry.foto ? (
            <img
              src={entry.foto}
              alt={entry.username}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
              <circle cx="20" cy="16" r="8" fill="#a07ee0" />
              <ellipse cx="20" cy="34" rx="13" ry="8" fill="#a07ee0" />
            </svg>
          )}
        </div>

        {/* Username */}
        <div style={{ fontFamily: "Agrandir, sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#6425d8", marginTop: "0.5rem" }}>
          @{entry.username}
        </div>
      </div>
    );
  }

  function AuthCardMobile() {
    if (!authCard) return null;
    const entry = authCard;
    const posStr = String(entry.posicao).padStart(2, "0");
    const awardsStr = String(entry.awards_count).padStart(2, "0");
    return (
      <div
        style={{
          background: "#ede5ff",
          borderRadius: "1.4rem",
          padding: "0.8rem 1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.9rem",
          width: "100%",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: "4rem",
            height: "4rem",
            borderRadius: "50%",
            overflow: "hidden",
            background: "#a07ee0",
            flexShrink: 0,
          }}
        >
          {entry.foto ? (
            <img
              src={entry.foto}
              alt={entry.username}
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
        <div style={{ display: "flex", flexDirection: "column", gap: "0.05rem" }}>
          <div style={{ fontFamily: "Agrandir, sans-serif", fontWeight: 900, fontSize: "1.2rem", color: "#6425d8", lineHeight: 1 }}>
            nº {posStr}
          </div>
          <div style={{ fontFamily: "Glacial Indifference, sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#1a1a1a" }}>
            {awardsStr} prêmio{entry.awards_count !== 1 ? "s" : ""}
          </div>
          <div style={{ fontFamily: "Agrandir, sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#6425d8" }}>
            @{entry.username}
          </div>
        </div>
      </div>
    );
  }

  function Titulo() {
    return (
      <h1
        style={{
          fontFamily: "Agrandir, sans-serif",
          fontWeight: 999,
          fontSize: "clamp(1.2rem, 3vw, 2rem)",
          color: "#6425d8",
          textAlign: "center",
          lineHeight: 0.9,
          marginBottom: "0",
        }}
      >
        ranking de usuários com<br />mais premiações
      </h1>
    );
  }

  return (
    <>
      {/* ══════════ DESKTOP ══════════ */}
      <div
        className="hidden md:flex"
        style={{ flexDirection: "column", height: "100vh", overflow: "hidden", background: "white", paddingTop: "0.7rem" }}
      >
        <div style={{ height: "8.15vh", flexShrink: 0, padding: "0 0.94%" }}>
          <MenuNavegacao />
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            padding: "1rem 0.94% 0",
            overflow: "hidden",
            gap: "1%",
          }}
        >
          {/* Coluna esquerda: AuthCard — mesma largura que BarraPublications no Feed */}
          <div
            style={{
              width: "25.1%",
              flexShrink: 0,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingBottom: "0.7rem",
            }}
          >
            <AuthCardDesktop />
          </div>

          {/* Coluna do meio: título + lista — mesma largura do feed central */}
          <div
            style={{
              width: "44.48%",
              flexShrink: 0,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Titulo />

            <div
              className="hide-scrollbar"
              style={{
                flex: 1,
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                paddingBottom: "0.5rem",
              }}
            >
              {ranking.map((user) => (
                <Premiado
                  key={user.username}
                  posicao={user.posicao}
                  username={user.username}
                  name={user.name}
                  awards_count={user.awards_count}
                  foto={user.foto}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ MOBILE ══════════ */}
      <div
        className="flex md:hidden"
        style={{ flexDirection: "column", height: "100vh", overflow: "hidden", background: "white", paddingTop: "0.3rem" }}
      >
        <div style={{ flexShrink: 0, padding: "0.6rem 0.6rem 0", zIndex: 10 }}>
          <MenuSuperior />
        </div>

        <div style={{ flexShrink: 0, height: "0.6rem" }} />

        {/* Título + lista numa área rolável com fundo lilás */}
        <div
          className="hide-scrollbar"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0.7rem 0.7rem 0.7rem",
            margin: "0 0.6rem",
            minHeight: 0,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            background: "#ede5ff",
            borderRadius: "1.4rem",
          }}
        >
          {/* Card do título */}
          <div style={{
            padding: "0.4rem 0rem 0.6rem",
            overflow: "hidden",
          }}>
            <Titulo />
          </div>

          {ranking.map((user) => (
            <Premiado
              key={user.username}
              posicao={user.posicao}
              username={user.username}
              name={user.name}
              awards_count={user.awards_count}
              foto={user.foto}
            />
          ))}
        </div>

        {/* AuthCard mobile */}
        <div style={{ flexShrink: 0, padding: "0.5rem 0.7rem" }}>
          <AuthCardMobile />
        </div>

        <div style={{ flexShrink: 0, padding: "0 0.6rem 0.6rem", zIndex: 10 }}>
          <MenuInferior />
        </div>
      </div>
    </>
  );
}
