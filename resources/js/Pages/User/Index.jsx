import React, { useState, useEffect } from "react";
import MenuNavegacaoAdm from "../../components/MenuNavegacaoAdm";
import MenuSuperiorAdm from "../../components/MenuSuperiorAdm";
import MenuInferiorAdm from "../../components/MenuInferiorAdm";
import UserAdm from "../../components/UserAdm";

export default function Index({ users }) {
  const [searchQuery, setSearchQuery] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("q") ?? "";
  });

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    setLoading(true);
    fetch(`/users/search?q=${encodeURIComponent(searchQuery.trim())}`, {
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((data) => setSearchResults(Array.isArray(data) ? data : []))
      .catch(() => setSearchResults([]))
      .finally(() => setLoading(false));
  }, [searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  const content = loading ? (
    <p style={{ fontFamily: "'Glacial Indifference', sans-serif", textAlign: "center", color: "#6425d8" }}>Buscando...</p>
  ) : isSearching ? (
    searchResults.length === 0
      ? <p style={{ fontFamily: "'Glacial Indifference', sans-serif", textAlign: "center", color: "#999" }}>Nenhum usuário encontrado.</p>
      : <UserAdm users={searchResults} />
  ) : (
    <UserAdm users={users} />
  );

  return (
    <>
      {/* ══════════ DESKTOP ══════════ */}
      <div
        className="hidden md:flex"
        style={{ flexDirection: "column", height: "100vh", overflow: "hidden", background: "white", paddingTop: "0.7rem", backgroundImage: "url('/images/adm-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat", }}
      >
        <div style={{ height: "8.15vh", flexShrink: 0, padding: "0 0.94%" }}>
          <MenuNavegacaoAdm onSearch={setSearchQuery} />
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            padding: "1rem 0.94% 0",
            overflow: "hidden",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <div
            className="hide-scrollbar"
            style={{
              width: "45%",
              height: "100%",
              overflowY: "auto",
              padding: "0 1%",
              boxSizing: "border-box",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {content}
          </div>
        </div>
      </div>

      {/* ══════════ MOBILE ══════════ */}
      <div
        className="flex md:hidden"
        style={{ flexDirection: "column", height: "100vh", overflow: "hidden", background: "white", paddingTop: "0.3rem" }}
      >
        <div style={{ flexShrink: 0, padding: "0.6rem 0.6rem 0", zIndex: 10 }}>
          <MenuSuperiorAdm onSearch={setSearchQuery} />
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0.6rem 0.6rem 0", minHeight: 0 }}>
          {content}
        </div>

        <div style={{ flexShrink: 0, padding: "0 0.6rem 0.6rem", zIndex: 10 }}>
          <MenuInferiorAdm />
        </div>
      </div>
    </>
  );
}
