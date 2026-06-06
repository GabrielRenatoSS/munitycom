import React, { useState, useRef, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";

const PURPLE = "#6425d8";
const BG     = "#c3a5ff";
const FONT   = "'Agrandir', sans-serif";

function Dropdown({ label, options, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handle = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const selectedStr   = selected != null ? String(selected) : null;
  const selectedLabel = selectedStr
    ? (options.find((o) => String(o.id) === selectedStr)?.name ?? label)
    : label;

  const truncate = (str, n = 22) => str.length > n ? str.slice(0, n) + "…" : str;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
          background: BG,
          border: "none",
          borderRadius: "999px",
          padding: "clamp(0.28rem, 1vw, 0.42rem) clamp(0.6rem, 2.5vw, 1.1rem)",
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: "clamp(0.68rem, 2.2vw, 0.85rem)",
          color: PURPLE,
          cursor: "pointer",
          whiteSpace: "nowrap",
          width: "100%",
          minWidth: 0,
          transition: "filter 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(0.93)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; }}
      >
        <span>{truncate(selectedLabel.toUpperCase())}</span>
        <img
          src="/images/baixo.png"
          alt=""
          style={{
            width: "clamp(0.65rem, 2vw, 0.9rem)",
            height: "clamp(0.65rem, 2vw, 0.9rem)",
            objectFit: "contain",
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 0.4rem)",
            left: 0,
            zIndex: 999,
            background: BG,
            borderRadius: "14px",
            boxShadow: "0 6px 24px rgba(100,37,216,0.18)",
            minWidth: "100%",
            maxWidth: "280px",
            maxHeight: "260px",
            overflowY: "auto",
            padding: "0.4rem 0",
          }}
        >
          {options.length === 0 && (
            <div style={{ padding: "0.6rem 1rem", color: PURPLE, fontFamily: FONT, fontSize: "0.8rem", opacity: 0.7 }}>
              Nenhum item
            </div>
          )}
          {options.map((opt) => {
            const isSelected = String(opt.id) === selectedStr;
            return (
              <button
                key={opt.id}
                onClick={() => { onSelect(opt.id); setOpen(false); }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: isSelected ? PURPLE : "transparent",
                  color: isSelected ? "white" : PURPLE,
                  border: "none",
                  padding: "0.55rem 1rem",
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "rgba(100,37,216,0.12)"; }}
                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
              >
                {opt.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function FiltroMun() {
  const { user, edicoes = [], filters = {} } = usePage().props;

  const edicaoSelecionada = filters.edicao_id ?? null;
  const comiteSelecionado = filters.comite_id ?? null;

  const edicaoAtual        = edicoes.find((e) => String(e.id) === String(edicaoSelecionada)) ?? null;
  const comitesDisponiveis = edicaoAtual?.comites ?? [];

  function navegar(params) {
    router.get(`/profile/${user.username}`, params, { preserveScroll: true, preserveState: false });
  }

  function selecionarEdicao(id) { navegar({ edicao_id: id }); }
  function selecionarComite(id) { navegar({ edicao_id: edicaoSelecionada, comite_id: id }); }

  if (!edicoes || edicoes.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", minWidth: "160px" }}>
      <Dropdown
        label="EDIÇÕES"
        options={edicoes.map((e) => ({ id: e.id, name: `${e.name}${e.ano ? " " + e.ano : ""}` }))}
        selected={edicaoSelecionada}
        onSelect={selecionarEdicao}
      />

      {edicaoSelecionada && comitesDisponiveis.length > 0 && (
        <Dropdown
          label="COMITÊS"
          options={comitesDisponiveis}
          selected={comiteSelecionado}
          onSelect={selecionarComite}
        />
      )}
    </div>
  );
}
