import React, { useState } from "react";
import MenuNavegacao from "../components/MenuNavegacao";
import MenuSuperior from "../components/MenuSuperior";
import MenuInferior from "../components/MenuInferior";
import CadastrarEdicao from "../components/CadastrarEdicao";
import EdicoesLista from "../components/EdicoesLista";
import { usePage } from "@inertiajs/react";

export default function Edicao() {
  const [showPublications, setShowPublications] = useState(false);
  const { edicoes, can_manage } = usePage().props;

  return (
    <>
      {/* ══════════ DESKTOP ══════════ */}
      <div
        className="hidden md:flex"
        style={{ flexDirection: "column", height: "100vh", overflow: "hidden", paddingTop: "0.7rem", backgroundImage: "url('/images/edicoes-bg.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", }}
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
            gap: "2.215%",
          }}
        >
          {/* Coluna 1 */}
          <div style={{ width: "25.1%", flexShrink: 0, height: "100%", overflow: "hidden", paddingBottom: "0.7rem" }}>
            <EdicoesLista edicoes={edicoes} canManage={can_manage} />
          </div>

          {/* Coluna 2 */}
          <div
            style={{
              width: "45.37%",
              flexShrink: 0,
              height: "100%",
              overflowY: "auto",
              boxSizing: "border-box",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
          </div>

          {/* Coluna 3 */}
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
            <div style={{ height: "40%", width: "100%", paddingBottom: "0.7rem" }}>
              <CadastrarEdicao />
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

        <div style={{ flex: 1, overflowY: "auto", padding: "0.6rem 0.6rem 0", minHeight: 0 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.8rem" }}>
            <div style={{ width: "70%" }}>
              <CadastrarEdicao mobile />
            </div>
          </div>
          <EdicoesLista edicoes={edicoes} canManage={can_manage} />
        </div>

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
