import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";


export default function MenuNavegacao() {
  const { auth } = usePage().props;
  const user = auth?.user;

  const tipo = user?.tipo ?? 0;
  const progresso = user?.progresso ?? 0;
  const username = user?.username ?? "";
  const foto = user?.foto
    ? `/storage/${user.foto}`
    : "/storage/fotos_usuarios/foto.jpg";

  const [search, setSearch] = useState("");

  function handleSearch() {
  if (!search.trim()) return;
  if (window.location.pathname === "/feed") {
    window.dispatchEvent(new CustomEvent("user-search", { detail: search.trim() }));
  } else {
    router.visit(`/feed?q=${encodeURIComponent(search.trim())}`);
  }
}

  const icones = [
    { key: "home",         src: "/images/home-menu.png",          alt: "Home",         href: "/feed",            show: tipo === 0 || tipo === 1 },
    { key: "notificacoes", src: "/images/notificacoes-menu.png",   alt: "Notificações", href: "/notificacoes",    show: tipo === 0 || tipo === 1 },
    { key: "favoritos",    src: "/images/favoritos-menu.png",      alt: "Favoritos",    href: "/favoritos",       show: tipo === 1 || progresso >= 6 },
    { key: "ranking",      src: "/images/ranking-menu.png",        alt: "Ranking",      href: "/ranking",         show: progresso >= 2 },
    { key: "reclame",      src: "/images/reclame-menu.png",        alt: "Feedback",     href: "/feedback/create", show: tipo === 0 || tipo === 1 },
    { key: "logout",       src: "/images/logout-menu.png",         alt: "Logout",       href: "/logout",          show: true },
  ].filter((i) => i.show);

  return (
    <nav
      style={{
        background: "#8c52ff",
        borderRadius: "50px",
        display: "flex",
        alignItems: "center",
        padding: "0.4rem 1.2rem",
        gap: "1rem",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Esquerda: foto + username */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
        <button
          onClick={() => router.visit(`/profile/${username}`)}
          style={{ background: "none", border: "none", outline: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <img
            src={foto}
            alt={username}
            style={{ width: "2.4rem", height: "2.4rem", borderRadius: "50%", objectFit: "cover", display: "block" }}
          />
        </button>
        <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: "1.1rem", color: "#ffffff", whiteSpace: "nowrap" }}>
          {username}
        </span>
      </div>

      {/* Centro: barra de pesquisa */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
        <div
          style={{
            background: "#c3a5ff",
            borderRadius: "50px",
            display: "flex",
            alignItems: "center",
            padding: "0.25rem 0.8rem",
            width: "100%",
            maxWidth: "420px",
          }}
        >
          <input
            type="text"
            placeholder="Digite aqui"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "'Glacial Indifference', sans-serif",
              fontSize: "1rem",
              color: "#6425d8",
              lineHeight: 1,
            }}
          />
        </div>
        <button
          onClick={handleSearch}
          style={{ background: "none", border: "none", outline: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <img src="/images/lupa-menu.png" alt="Buscar" style={{ height: "1.4rem", width: "auto", display: "block" }} />
        </button>
      </div>

      {/* Direita: ícones */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", flexShrink: 0 }}>
        {icones.map((icone) => (
          <button
            key={icone.key}
            onClick={() => icone.key === "logout" ? router.post("/logout") : router.visit(icone.href)}
            style={{ background: "none", border: "none", outline: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <img src={icone.src} alt={icone.alt} style={{ height: "1.8rem", width: "auto", display: "block" }} />
          </button>
        ))}
      </div>
    </nav>
  );
}
