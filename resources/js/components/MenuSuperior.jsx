import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function MenuSuperior() {
  const [search, setSearch] = useState("");

  function handleSearch() {
  if (!search.trim()) return;
  if (window.location.pathname === "/feed") {
    window.dispatchEvent(new CustomEvent("user-search", { detail: search.trim() }));
  } else {
    router.visit(`/feed?q=${encodeURIComponent(search.trim())}`);
  }
}
  
  return (
    <nav
      style={{
        background: "#8c52ff",
        borderRadius: "50px",
        display: "flex",
        alignItems: "center",
        padding: "0.4rem 1rem",
        gap: "0.6rem",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          flex: 1,
          background: "#c3a5ff",
          borderRadius: "50px",
          display: "flex",
          alignItems: "center",
          padding: "0.25rem 0.8rem",
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
            color: "#6425d8",
            lineHeight: 1,
            fontSize: "1rem",
          }}
        />
      </div>

      <button
        onClick={handleSearch}
        style={{ background: "none", border: "none", outline: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}
      >
        <img src="/images/lupa-menu.png" alt="Buscar" style={{ height: "1.4rem", width: "auto", display: "block" }} />
      </button>
    </nav>
  );
}
