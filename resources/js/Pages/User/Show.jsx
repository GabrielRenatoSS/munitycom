import React from "react";
import { usePage } from "@inertiajs/react";
import { useState } from "react";
import MenuNavegacao from "../../components/MenuNavegacao";
import MenuSuperior from "../../components/MenuSuperior";
import MenuInferior from "../../components/MenuInferior";
import Informacoes from "../../components/Informacoes";
import ListaInteresse from "../../components/ListaInteresse";
import Progresso from "../../components/Progresso";
import FiltroPosts from "../../components/FiltroPosts";
import BarraPublications from "../../components/BarraPublications";
import FiltroMun from "../../components/FiltroMun";
import MembrosComite from "../../components/MembrosComite";
import BarraDocumentos from "../../components/BarraDocumentos";
import ListaDocumentos from "../../components/ListaDocumentos";

const BTN_MEMBROS = {
  background: "#c3a5ff",
  border: "none",
  borderRadius: "999px",
  padding: "0.38rem 1.2rem",
  fontFamily: "'Agrandir', sans-serif",
  fontWeight: 700,
  fontSize: "clamp(0.75rem, 1.5vw, 0.95rem)",
  color: "#6425d8",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

// Proporções das 3 colunas
// Margens laterais: 0.94% cada lado
// Colunas: 25.1% | 44.48% | 25.1%
// Gaps entre colunas: (100% - 0.94%*2 - 25.1%*2 - 44.48%) / 2 = 2.22%
const COL_GAP   = "2.22%";
const COL_LEFT  = "25.1%";
const COL_MID   = "44.48%";
const COL_RIGHT = "25.1%";
const SIDE_PAD  = "0.94%";

export default function Show() {
  const { user, is_own_profile, interests, filters = {}, membros, can_edit, comite } = usePage().props;
  const [showPublications, setShowPublications] = useState(false);
  const [showMembros,      setShowMembros]      = useState(false);
  const isMun          = user.tipo === 1;
  const comiteFiltrado = !!filters.comite_id;
  const GAP = "2.25%";

  // Mostra o grid de 3 colunas quando: perfil mun + comitê selecionado + membros disponíveis
  const showThreeColumns = isMun && comiteFiltrado && membros;

  return (
    <>
      {/* ══════════ DESKTOP ══════════ */}
      <div
        className="hidden md:flex flex-col"
        style={{
          height: "100vh",
          overflow: "hidden",
          background: "white",
          paddingTop: "0.7rem",
        }}
      >
        <div style={{ height: "8.15vh", flexShrink: 0, padding: "0 0.94%" }}>
          <MenuNavegacao />
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "1rem 0.94% 2rem" }}>
          <div style={{ display: "flex", gap: GAP, height: isMun ? "auto" : "85vh" }}>

            {/* Coluna 1 — 71.77% */}
            <div style={{ width: "71.77%", flexShrink: 0, height: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ height: "55.46%", flexShrink: 0 }}>
                <Informacoes user={user} isOwnProfile={is_own_profile} />
              </div>
              {!isMun && (
                <div style={{ height: "38.15%", flexShrink: 0, overflow: "hidden" }}>
                  <ListaInteresse interests={interests} isOwnProfile={is_own_profile} />
                </div>
              )}
            </div>

            {/* Coluna 2 — 25.1% */}
            <div style={{ width: "25.1%", flexShrink: 0, height: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ height: "66.1%", flexShrink: 0, borderRadius: "20px", overflow: "hidden" }}>
                <Progresso user={user} isOwnProfile={is_own_profile} />
              </div>
              {!isMun && (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <img src="/images/logo.png" alt="MUN.com" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                </div>
              )}
            </div>
          </div>

          {/* ── Botão membros do comitê — desktop ── */}
          {showThreeColumns && (
            <div style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>
              <button style={BTN_MEMBROS} onClick={() => setShowMembros(true)}>
                MEMBROS DO COMITÊ
              </button>
            </div>
          )}

          {/* ── Grid de 3 colunas scrolláveis (mun + comitê selecionado) ── */}
          {showThreeColumns && (
            <div
              style={{
                display: "flex",
                gap: COL_GAP,
                // sem padding: o pai (overflowY: auto) já tem padding: "1rem 0.94% 2rem"
                marginTop: "1rem",
                height: "calc(100vh - 8.15vh - 1rem - 2rem - 2.5rem)",
                boxSizing: "border-box",
                alignItems: "flex-start", // colunas crescem pelo conteúdo, não pela altura do flex
              }}
            >
              {/* Coluna esquerda — 25.1% */}
              <div
                style={{
                  width: COL_LEFT,
                  flexShrink: 0,
                  overflowY: "auto",
                  borderRadius: "16px",
                  // sem height: 100% — cresce pelo conteúdo do BarraDocumentos
                }}
              >
                <BarraDocumentos comiteId={filters.comite_id ? Number(filters.comite_id) : null} />
              </div>

              {/* Coluna central — 44.48% */}
              <div
                style={{
                  width: COL_MID,
                  flexShrink: 0,
                  overflowY: "auto",
                  borderRadius: "16px",
                }}
              >
                <ListaDocumentos />
              </div>

              {/* Coluna direita — 25.1% */}
              <div
                style={{
                  width: COL_RIGHT,
                  flexShrink: 0,
                  overflowY: "auto",
                  borderRadius: "16px",
                }}
              >
                {/* conteúdo futuro */}
              </div>
            </div>
          )}

          {/* FiltroPosts — só aparece quando NÃO está no modo 3 colunas */}
          {!showThreeColumns && (
            <div style={{ width: "50%", margin: "1.5rem auto 0" }}>
              <FiltroPosts username={user.username} showFilters={!isMun} />
            </div>
          )}
        </div>
      </div>

      {/* ══════════ MOBILE ══════════ */}
      <div
        className="flex md:hidden flex-col"
        style={{ height: "100vh", overflow: "hidden", background: "white" }}
      >
        {/* Menu superior fixo */}
        <div style={{ flexShrink: 0, padding: "0.5rem 0.6rem 0", zIndex: 10 }}>
          <MenuSuperior />
        </div>
        {showPublications ? (
          <div style={{ flex: 1, padding: "0.6rem", minHeight: 0 }}>
            <BarraPublications mobile />
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: "auto", padding: "0.6rem 0.6rem 0" }}>

            <div style={{ background: "white", borderRadius: "13px", marginBottom: "0.6rem" }}>
              <Informacoes user={user} isOwnProfile={is_own_profile} />
            </div>

            {/* Lista de Interesse + Progresso lado a lado */}
            <div style={{ display: "flex", gap: "0.6rem", marginBottom: "0.6rem", alignItems: "stretch", justifyContent: isMun ? "center" : undefined }}>
              {!isMun && (
                <div style={{ flex: 1, minWidth: 0 }}>
                  <ListaInteresse interests={interests} isOwnProfile={is_own_profile} />
                </div>
              )}
              {isMun && (
                <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", overflow: "hidden" }}>
                  <FiltroMun />
                </div>
              )}
              <div style={{ flexShrink: 0, width: "38%", minWidth: "80px", borderRadius: "13px", overflow: "hidden" }}>
                <Progresso user={user} isOwnProfile={is_own_profile} />
              </div>
            </div>

            {/* Botão membros do comitê — mobile */}
            {isMun && comiteFiltrado && membros && (
              <div style={{ marginBottom: "0.6rem", display: "flex", justifyContent: "center" }}>
                <button style={BTN_MEMBROS} onClick={() => setShowMembros(true)}>
                  MEMBROS DO COMITÊ
                </button>
              </div>
            )}

            {/* Colunas mobile — só aparece quando mun + comitê selecionado + membros */}
            {isMun && comiteFiltrado && membros ? (
              <div style={{ marginBottom: "0.6rem" }}>
                {/* Coluna 1 — BarraDocumentos — 70% da largura, centralizado */}
                <div style={{ width: "62%", margin: "0 auto 0.6rem" }}>
                <BarraDocumentos mobile comiteId={filters.comite_id ? Number(filters.comite_id) : null} />
                </div>

                {/* Coluna 2 — ListaDocumentos — largura total */}
                <div style={{ width: "100%" }}>
                  <ListaDocumentos />
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: "0.6rem" }}>
                <FiltroPosts username={user.username} showFilters={!isMun} />
              </div>
            )}

          </div>
        )}

        {/* Menu inferior fixo */}
        <div style={{ flexShrink: 0, padding: "0 0.6rem 0.6rem", zIndex: 10 }}>
          <MenuInferior 
            onTogglePublications={() => setShowPublications(p => !p)}
            showPublications={showPublications}
          />
        </div>
      </div>

      {/* Modal membros */}
      {showMembros && membros && comite && (
        <MembrosComite
          comite={comite}
          membros={membros}
          canEdit={can_edit ?? false}
          onClose={() => setShowMembros(false)}
        />
      )}
    </>
  );
}
