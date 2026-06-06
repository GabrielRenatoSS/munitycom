import React, { useState, useEffect } from "react";
import MenuNavegacao from "../components/MenuNavegacao";
import MenuSuperior from "../components/MenuSuperior";
import MenuInferior from "../components/MenuInferior";
import BarraPublications from "../components/BarraPublications";
import FeedPosts from "../components/FeedPosts";
import DiscoverMuns from "../components/DiscoverMuns";
import UserSearch from "../components/UserSearch";
import { usePage } from "@inertiajs/react";

export default function Feed() {
  const { auth } = usePage().props;
  const tipo = auth?.user?.tipo ?? 0;
  const [showPublications, setShowPublications] = useState(false);
const [searchQuery, setSearchQuery] = useState(() => {
  const params = new URLSearchParams(window.location.search);
  return params.get("q") ?? "";
});

useEffect(() => {
  function onSearch(e) { setSearchQuery(e.detail); }
  window.addEventListener("user-search", onSearch);
  return () => window.removeEventListener("user-search", onSearch);
}, []);

  const isSearching = searchQuery.trim().length > 0;

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
            gap: "2.6%",
          }}
        >
          <div style={{ width: "25.1%", flexShrink: 0, height: "100%", overflow: "hidden", paddingBottom: "0.7rem" }}>
            <BarraPublications />
          </div>

          <div className="hide-scrollbar"
            style={{
              width: "44.48%",
              flexShrink: 0,
              height: "100%",
              overflowY: "auto",
              padding: "0 1%",
              boxSizing: "border-box",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {isSearching ? <UserSearch initialQuery={searchQuery} /> : <FeedPosts />}
          </div>

          <div
            style={{
              width: "25.1%",
              flexShrink: 0,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            {tipo === 0 && (
              <div style={{ height: "40%", width: "100%", paddingBottom: "0.7rem" }}>
                <DiscoverMuns />
              </div>
            )}
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

        {showPublications ? (
          <div style={{ flex: 1, padding: "0.6rem", minHeight: 0 }}>
            <BarraPublications mobile />
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: "auto", padding: "0.6rem 0.6rem 0", minHeight: 0 }}>
            {isSearching ? (
              <UserSearch initialQuery={searchQuery} />
            ) : (
              <>
                {tipo === 0 && (
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.6rem" }}>
                    <div style={{ width: "80%" }}>
                      <DiscoverMuns mobile />
                    </div>
                  </div>
                )}
                <FeedPosts />
              </>
            )}
          </div>
        )}

        <div style={{ flexShrink: 0, padding: "0 0.6rem 0.6rem", zIndex: 10 }}>
          <MenuInferior
            onTogglePublications={() => setShowPublications(p => !p)}
            showPublications={showPublications}
          />
        </div>
      </div>
    </>
  );
}
