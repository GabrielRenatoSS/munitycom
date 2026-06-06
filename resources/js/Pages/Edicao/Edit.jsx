import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import MenuNavegacao from "../../components/MenuNavegacao";
import MenuSuperior from "../../components/MenuSuperior";
import MenuInferior from "../../components/MenuInferior";
import CadastrarEdicao from "../../components/CadastrarEdicao";
import EdicoesLista from "../../components/EdicoesLista";

// ─── estilos reutilizáveis ────────────────────────────────────────────────────

const inputStyle = {
  background: "#c3a5ff",
  border: "none",
  borderRadius: "50px",
  padding: "0.25rem 0.8rem",
  fontFamily: "'Glacial Indifference', sans-serif",
  fontSize: "0.9rem",
  color: "#6425d8",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const iconBtn = {
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
};

const sectionTitle = {
  fontFamily: "'Agrandir', sans-serif",
  fontSize: "clamp(1rem, 1.8vw, 1.3rem)",
  fontWeight: 700,
  color: "#6425d8",
  textAlign: "center",
  margin: "1rem 0 0.7rem",
};

const cardStyle = {
  border: "1.5px solid #6425d8",
  borderRadius: "0.75rem",
  display: "flex",
  alignItems: "center",
  padding: "0.5rem 0.9rem",
  background: "white",
  gap: "0.75rem",
  boxSizing: "border-box",
  width: "100%",
};

const actionIcons = (onEdit, onDelete) => (
  <div style={{ display: "flex", gap: "0.4rem", marginLeft: "auto", flexShrink: 0 }}>
    <button onClick={onEdit} style={iconBtn}>
      <img src="/images/editar.png" alt="Editar" style={{ height: "1rem", width: "auto" }} />
    </button>
    <button onClick={onDelete} style={iconBtn}>
      <img src="/images/excluir.png" alt="Excluir" style={{ height: "1rem", width: "auto" }} />
    </button>
  </div>
);

// ─── componente principal ─────────────────────────────────────────────────────

export default function Edit() {
  const { edicao, edicoes, can_manage } = usePage().props;
  const [showPublications, setShowPublications] = useState(false);

  // estado editável
  const [name, setName]           = useState(edicao.name ?? "");
  const [dtInicio, setDtInicio]   = useState(edicao.dt_inicio ?? "");
  const [dtTermino, setDtTermino] = useState(edicao.dt_termino ?? "");

  const [secretariado, setSecretariado] = useState(
    (edicao.secretariado ?? []).map(s => ({ ...s, editing: false }))
  );
  const [comites, setComites] = useState(
    (edicao.comites ?? []).map(c => ({ ...c, editing: false }))
  );

  // ── secretariado helpers ──────────────────────────────────────────────────

  function toggleEditSecretariado(i) {
    setSecretariado(prev => prev.map((s, idx) => idx === i ? { ...s, editing: !s.editing } : s));
  }

  function updateSecretariado(i, field, value) {
    setSecretariado(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  }

  function removeSecretariado(i) {
    setSecretariado(prev => prev.filter((_, idx) => idx !== i));
  }

  function addSecretariado() {
    setSecretariado(prev => [...prev, { id: null, user_username: "", cargo: "", user_foto: "/fotos_usuarios/foto.png", editing: true }]);
  }

  // ── comites helpers ───────────────────────────────────────────────────────

  function toggleEditComite(i) {
    setComites(prev => prev.map((c, idx) => idx === i ? { ...c, editing: !c.editing } : c));
  }

  function updateComite(i, value) {
    setComites(prev => prev.map((c, idx) => idx === i ? { ...c, name: value } : c));
  }

  function removeComite(i) {
    setComites(prev => prev.filter((_, idx) => idx !== i));
  }

  function addComite() {
    setComites(prev => [...prev, { id: null, name: "", editing: true }]);
  }

  // ── submit ────────────────────────────────────────────────────────────────

  function handleSave() {
    router.put(`/${edicao.id}`, {
      name,
      dt_inicio: dtInicio,
      dt_termino: dtTermino,
      secretariado: secretariado.map(s => ({
        id: s.id ?? null,
        username: s.user_username,
        cargo: s.cargo,
      })),
      comites: comites.map(c => ({
        id: c.id ?? null,
        name: c.name,
      })),
    });
  }

  function handleDiscard() {
    router.visit(`/${edicao.id}/detalhes`);
  }

  // ── render central ────────────────────────────────────────────────────────

  const conteudo = (
    <div
      style={{
        background: "#ddd3f3",
        borderRadius: "1.5rem",
        width: "100%",
        height: "100%",
        overflowY: "auto",
        padding: "1.2rem 1.5rem 1rem",
        boxSizing: "border-box",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
      }}
    >
      {/* Nome */}
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        style={{
          ...inputStyle,
          fontSize: "clamp(1.2rem, 2.5vw, 2.2rem)",
          fontFamily: "'Agrandir', sans-serif",
          fontWeight: 700,
          textAlign: "center",
          borderRadius: "50px",
          padding: "0.3rem 1rem",
        }}
      />

      {/* Datas */}
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: "clamp(0.8rem, 1.5vw, 1rem)", fontWeight: 700, color: "#333" }}>
            Data início:
          </span>
          <input
            type="date"
            value={dtInicio}
            onChange={e => setDtInicio(e.target.value)}
            style={{ ...inputStyle, width: "auto" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: "clamp(0.8rem, 1.5vw, 1rem)", fontWeight: 700, color: "#333" }}>
            Data término:
          </span>
          <input
            type="date"
            value={dtTermino}
            onChange={e => setDtTermino(e.target.value)}
            style={{ ...inputStyle, width: "auto" }}
          />
        </div>
      </div>

      {/* ── Secretariado ── */}
      <h2 style={sectionTitle}>Secretariado</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {secretariado.map((s, i) => (
          <div key={i} style={cardStyle}>
            <img
              src={s.user_foto}
              alt={s.user_username}
              style={{ width: "2.4rem", height: "2.4rem", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            />
            {s.editing ? (
              <div style={{ display: "flex", gap: "0.5rem", flex: 1, flexWrap: "wrap" }}>
                <input
                  placeholder="Username"
                  value={s.user_username}
                  onChange={e => updateSecretariado(i, "user_username", e.target.value)}
                  style={{ ...inputStyle, flex: 1, minWidth: "80px" }}
                />
                <input
                  placeholder="Cargo"
                  value={s.cargo}
                  onChange={e => updateSecretariado(i, "cargo", e.target.value)}
                  style={{ ...inputStyle, flex: 1, minWidth: "80px" }}
                />
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "#6425d8" }}>
                  @{s.user_username}
                </span>
                <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: "0.85rem", color: "#333" }}>
                  {s.cargo}
                </span>
              </div>
            )}
            {actionIcons(() => toggleEditSecretariado(i), () => removeSecretariado(i))}
          </div>
        ))}

        {/* Adicionar membro */}
        <button
          onClick={addSecretariado}
          style={{ ...cardStyle, cursor: "pointer", border: "1.5px dashed #6425d8", background: "transparent", justifyContent: "flex-start", gap: "0.75rem" }}
        >
          <img src="/images/adicionar-menu.png" alt="Adicionar" style={{ width: "2.4rem", height: "2.4rem", opacity: 0.6 }} />
          <div style={{ display: "flex", gap: "0.5rem", flex: 1 }}>
            <div style={{ ...inputStyle, flex: 1, color: "#9b6de0", pointerEvents: "none" }}>Username</div>
            <div style={{ ...inputStyle, flex: 1, color: "#9b6de0", pointerEvents: "none" }}>Cargo</div>
          </div>
        </button>
      </div>

      {/* ── Comitês ── */}
      <h2 style={sectionTitle}>Comitês</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {comites.map((c, i) => (
          <div key={i} style={cardStyle}>
            {c.editing ? (
              <input
                placeholder="Nome do comitê"
                value={c.name}
                onChange={e => updateComite(i, e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
              />
            ) : (
              <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: "0.95rem", color: "#333", flex: 1 }}>
                {c.name}
              </span>
            )}
            {actionIcons(() => toggleEditComite(i), () => removeComite(i))}
          </div>
        ))}

        {/* Adicionar comitê */}
        <button
          onClick={addComite}
          style={{ ...cardStyle, cursor: "pointer", border: "1.5px dashed #6425d8", background: "transparent", justifyContent: "flex-start" }}
        >
          <img src="/images/adicionar-menu.png" alt="Adicionar" style={{ width: "2.4rem", height: "2.4rem", opacity: 0.6 }} />
          <div style={{ ...inputStyle, flex: 1, color: "#9b6de0", pointerEvents: "none" }}>Nome</div>
        </button>
      </div>

      {/* ── Botões ── */}
      <div style={{ display: "flex", gap: "1rem", marginTop: "0.8rem", justifyContent: "center" }}>
        <button
          onClick={handleSave}
          style={{
            flex: 1,
            background: "#c3a5ff",
            border: "none",
            borderRadius: "50px",
            fontFamily: "'Agrandir', sans-serif",
            fontSize: "clamp(1rem, 1.5vw, 1.3rem)",
            fontWeight: 700,
            color: "#6425d8",
            padding: "0.5rem 0",
            cursor: "pointer",
          }}
        >
          SALVAR
        </button>
        <button
          onClick={handleDiscard}
          style={{
            flex: 1,
            background: "#c3a5ff",
            border: "none",
            borderRadius: "50px",
            fontFamily: "'Agrandir', sans-serif",
            fontSize: "clamp(1rem, 1.5vw, 1.3rem)",
            fontWeight: 700,
            color: "#6425d8",
            padding: "0.5rem 0",
            cursor: "pointer",
          }}
        >
          DESCARTAR
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ══════════ DESKTOP ══════════ */}
      <div
        className="hidden md:flex"
        style={{ flexDirection: "column", height: "100vh", overflow: "hidden", paddingTop: "0.7rem", backgroundImage: "url('/images/edicoes-bg.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
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
          <div style={{ width: "25.1%", flexShrink: 0, height: "100%", overflowY: "auto", paddingBottom: "0.7rem", scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <EdicoesLista edicoes={edicoes} canManage={can_manage} initialSelectedId={edicao?.id} />
          </div>

          {/* Coluna 2 — editor */}
          <div style={{ width: "45.37%", flexShrink: 0, height: "100%", boxSizing: "border-box", paddingBottom: "0.7rem" }}>
            {conteudo}
          </div>

          {/* Coluna 3 */}
          <div style={{ width: "25.1%", flexShrink: 0, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
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
          <div style={{ marginBottom: "0.8rem" }}>
            <EdicoesLista edicoes={edicoes} canManage={can_manage} initialSelectedId={edicao?.id} />
          </div>
          {conteudo}
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
