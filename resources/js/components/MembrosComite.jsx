import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import ConfirmPopup from "./ConfirmPopup";

const PURPLE  = "#6425d8";
const LILAC   = "#ddd3f3";
const BG_BTN  = "#c3a5ff";
const FONT_AG = "'Agrandir', sans-serif";
const FONT_GL = "'Glacial Indifference', sans-serif";

const inputStyle = {
  background: BG_BTN,
  border: "none",
  borderRadius: "50px",
  padding: "0.25rem 0.8rem",
  fontFamily: FONT_GL,
  fontSize: "0.9rem",
  color: PURPLE,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const cardStyle = {
  border: "1.5px solid " + PURPLE,
  borderRadius: "0.75rem",
  display: "flex",
  alignItems: "center",
  padding: "0.5rem 0.9rem",
  background: "white",
  gap: "0.75rem",
  boxSizing: "border-box",
  width: "100%",
  position: "relative",
};

// ─── linha de membro ──────────────────────────────────────────────────────────

function MembroCard({ membro, canEdit, onSave, onDelete }) {
  const [editing,    setEditing]    = useState(false);
  const [username,   setUsername]   = useState(membro.username);
  const [delegacao,  setDelegacao]  = useState(membro.delegacao);
  const [confirmDel, setConfirmDel] = useState(false);

  function salvar() {
    router.put(`/membros/${membro.id}`, { username, delegacao }, {
      preserveScroll: true,
      onSuccess: () => setEditing(false),
    });
  }

  return (
    <div style={cardStyle}>
      <img
        src={membro.foto}
        alt={membro.username}
        style={{ width: "2.4rem", height: "2.4rem", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
      />

      {editing ? (
        <div style={{ display: "flex", gap: "0.5rem", flex: 1, flexWrap: "wrap" }}>
          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ ...inputStyle, flex: 1, minWidth: "80px" }}
          />
          <input
            placeholder="Delegação"
            value={delegacao}
            onChange={e => setDelegacao(e.target.value)}
            style={{ ...inputStyle, flex: 1, minWidth: "80px" }}
          />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <span style={{ fontFamily: FONT_GL, fontSize: "0.95rem", fontWeight: 700, color: PURPLE }}>
            @{membro.username}
          </span>
          <span style={{ fontFamily: FONT_GL, fontSize: "0.85rem", color: "#333" }}>
            {membro.delegacao}
          </span>
        </div>
      )}

      {canEdit && (
        <div style={{ display: "flex", gap: "0.4rem", marginLeft: "auto", flexShrink: 0 }}>
          {editing ? (
            <button
              onClick={salvar}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              title="Salvar"
            >
              <img src="/images/editar.png" alt="Salvar" style={{ height: "1rem", width: "auto", opacity: 0.6 }} />
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              title="Editar"
            >
              <img src="/images/editar.png" alt="Editar" style={{ height: "1rem", width: "auto" }} />
            </button>
          )}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setConfirmDel(c => !c)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              title="Excluir"
            >
              <img src="/images/excluir.png" alt="Excluir" style={{ height: "1rem", width: "auto" }} />
            </button>
            {confirmDel && (
              <ConfirmPopup
                mensagem="Remover este membro?"
                onConfirm={() => {
                  setConfirmDel(false);
                  router.delete(`/membros/${membro.id}`, { preserveScroll: true });
                }}
                onCancel={() => setConfirmDel(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── linha de adição ──────────────────────────────────────────────────────────

function AdicionarMembro({ comiteId }) {
  const [username,  setUsername]  = useState("");
  const [delegacao, setDelegacao] = useState("");
  const [erro,      setErro]      = useState(null);

  function adicionar() {
    if (!username.trim() || !delegacao.trim()) return;
    router.post(`/comites/${comiteId}/membros`, { username, delegacao }, {
      preserveScroll: true,
      onSuccess: () => { setUsername(""); setDelegacao(""); setErro(null); },
      onError: (errors) => setErro(errors.username ?? "Erro ao adicionar."),
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      <button
        onClick={adicionar}
        style={{
          ...cardStyle,
          cursor: "pointer",
          border: "1.5px dashed " + PURPLE,
          background: "transparent",
          justifyContent: "flex-start",
        }}
      >
        <img src="/images/adicionar-menu.png" alt="Adicionar" style={{ width: "2.4rem", height: "2.4rem", opacity: 0.6, flexShrink: 0 }} />
        <div style={{ display: "flex", gap: "0.5rem", flex: 1, flexWrap: "wrap" }}>
          <input
            placeholder="Username"
            value={username}
            onClick={e => e.stopPropagation()}
            onChange={e => { e.stopPropagation(); setUsername(e.target.value); }}
            style={{ ...inputStyle, flex: 1, minWidth: "80px" }}
          />
          <input
            placeholder="Delegação"
            value={delegacao}
            onClick={e => e.stopPropagation()}
            onChange={e => { e.stopPropagation(); setDelegacao(e.target.value); }}
            style={{ ...inputStyle, flex: 1, minWidth: "80px" }}
          />
        </div>
      </button>
      {erro && (
        <span style={{ fontFamily: FONT_GL, fontSize: "0.8rem", color: "red", paddingLeft: "0.5rem" }}>
          {erro}
        </span>
      )}
    </div>
  );
}

// ─── modal principal ──────────────────────────────────────────────────────────

export default function MembrosComite({ comite, membros, canEdit, onClose }) {
  // Fecha com ESC
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Trava scroll do body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const Inner = ({ mobile }) => (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        background: LILAC,
        borderRadius: "24px",
        width: mobile ? "100%" : "clamp(320px, 48vw, 620px)",
        maxHeight: mobile ? "100%" : "78vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: mobile ? "none" : "0 8px 40px rgba(100,37,216,0.18)",
        flex: mobile ? 1 : undefined,
      }}
    >
      {/* Cabeçalho */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: mobile ? "1rem 1rem 0.6rem" : "1.2rem 1.5rem 0.8rem",
        flexShrink: 0,
      }}>
        {/* seta esquerda — placeholder de navegação futura */}
        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, opacity: 0.4, flexShrink: 0 }}>
          <img
            src="/images/logout-menu.png"
            alt="anterior"
            style={{ width: mobile ? 22 : 28, height: mobile ? 22 : 28, objectFit: "contain", transform: "scaleX(1)" }}
          />
        </button>

        <h2 style={{
          fontFamily: "'Tan Nimbus', 'Agrandir', sans-serif",
          fontSize: mobile ? "clamp(1.2rem, 6vw, 1.8rem)" : "clamp(1.6rem, 2.5vw, 2rem)",
          color: "#8c52ff",
          margin: 0,
          fontWeight: 700,
          lineHeight: 1,
          textAlign: "center",
          flex: 1,
        }}>
          membros do comitê
        </h2>

        {/* seta direita / fechar */}
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}
        >
          <img
            src="/images/logout-menu.png"
            alt="fechar"
            style={{ width: mobile ? 22 : 28, height: mobile ? 22 : 28, objectFit: "contain", transform: "scaleX(-1)" }}
          />
        </button>
      </div>

      {/* Lista */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: mobile ? "0 1rem 1rem" : "0 1.5rem 1.2rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        scrollbarColor: "#fff transparent",
        scrollbarWidth: "thin",
      }}>
        <style>{`
          .membros-scroll::-webkit-scrollbar { width: 6px; }
          .membros-scroll::-webkit-scrollbar-thumb { background: #fff; border-radius: 99px; }
          .membros-scroll::-webkit-scrollbar-track { background: transparent; }
        `}</style>
        <div className="membros-scroll" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {membros.map(m => (
            <MembroCard
              key={m.id}
              membro={m}
              canEdit={canEdit}
              onDelete={() => {}}
            />
          ))}

          {canEdit && <AdicionarMembro comiteId={comite.id} />}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ══ DESKTOP ══ */}
      <div
        className="hidden md:flex"
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(100,37,216,0.15)",
          backdropFilter: "blur(6px)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Inner mobile={false} />
      </div>

      {/* ══ MOBILE ══ */}
      <div
        className="flex md:hidden"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          flexDirection: "column",
          alignItems: "stretch",
          padding: "calc(44px + 0.5rem) 0.6rem calc(44px + 0.6rem)",
          background: "rgba(100,37,216,0.10)",
        }}
      >
        <Inner mobile={true} />
      </div>
    </>
  );
}
