import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";

export default function MenuNavegacaoAdm({ onSearch }) {
  const { auth } = usePage().props;
  const user = auth?.user;

  const username = user?.username ?? "";
  const foto = user?.foto
    ? `/storage/${user.foto}`
    : "/storage/fotos_usuarios/foto.jpg";

  const [search, setSearch] = useState("");

  function handleSearch() {
    if (onSearch) {
      onSearch(search.trim());
    } else {
      router.visit(`/users?q=${encodeURIComponent(search.trim())}`);
    }
  }

  const icones = [
    { key: "users",    src: "/images/users-index.png",  alt: "Usuários", href: "/users" },
    { key: "feedback", src: "/images/reclame-menu.png", alt: "Feedback", href: "/feedback" },
    { key: "logout",   src: "/images/logout-menu.png",  alt: "Logout",   href: "/logout" },
  ];

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
        <img
          src={foto}
          alt={username}
          style={{ width: "2.4rem", height: "2.4rem", borderRadius: "50%", objectFit: "cover", display: "block" }}
        />
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
