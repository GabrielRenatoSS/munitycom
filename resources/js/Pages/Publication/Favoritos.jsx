import React from "react";
import MenuNavegacao from "@/components/MenuNavegacao";
import MenuSuperior from "@/components/MenuSuperior";
import MenuInferior from "@/components/MenuInferior";
import FavoritosPosts from "@/components/FavoritosPosts";
import { usePage } from "@inertiajs/react";

export default function Favoritos() {
  const { favoritos } = usePage().props;

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
            justifyContent: "center",
          }}
        >
          <div
            className="hide-scrollbar"
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
            <FavoritosPosts initialData={favoritos} />
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

        <div style={{ flex: 1, overflowY: "auto", padding: "0.6rem 0.6rem 0", minHeight: 0 }}>
          <FavoritosPosts initialData={favoritos} />
        </div>

        <div style={{ flexShrink: 0, padding: "0 0.6rem 0.6rem", zIndex: 10 }}>
          <MenuInferior />
        </div>
      </div>
    </>
  );
}
