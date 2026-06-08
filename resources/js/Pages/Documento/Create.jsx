import React, { useState, useCallback } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";

const PURPLE     = "#6425d8";
const LILAC_DARK = "#8c52ff";
const LILAC_MID  = "#c3a5ff";
const LILAC_LIGHT= "#ddd3f3";
const WHITE      = "#ffffff";

const FONT_NIMBUS  = "'TAN Nimbus', serif";
const FONT_AGRANDIR= "'AGRandir', sans-serif";
const FONT_GLACIAL = "'Glacial Indifference', sans-serif";

const labelStyle = {
  fontFamily: FONT_GLACIAL,
  fontSize: "clamp(0.85rem, 4vw, 2.3rem)",
  color: PURPLE,
  lineHeight: 1.1,
};

const sectionLabelStyle = {
  fontFamily: FONT_GLACIAL,
  fontSize: "clamp(0.9rem, 3.5vw, 1.6rem)",
  color: LILAC_DARK,
  lineHeight: 1.1,
};

const obrigStyle = {
  fontFamily: FONT_GLACIAL,
  fontSize: "clamp(0.6rem, 2.5vw, 1.2rem)",
  color: LILAC_DARK,
};

const inputStyle = {
  background: LILAC_MID,
  borderRadius: "50px",
  border: "none",
  outline: "none",
  padding: "0 clamp(0.6rem, 2vw, 1.4rem)",
  fontFamily: FONT_GLACIAL,
  fontSize: "clamp(0.75rem, 3.5vw, 1.69rem)",
  height: "clamp(1.4rem, 7vw, 2.8rem)",
  color: WHITE,
  width: "100%",
  boxSizing: "border-box",
};

// ── Textarea style: mesmas cores do input mas com altura livre ──
const textareaStyle = {
  background: LILAC_MID,
  borderRadius: "1.2rem",
  border: "none",
  outline: "none",
  padding: "clamp(0.5rem, 1.5vw, 0.9rem) clamp(0.6rem, 2vw, 1.4rem)",
  fontFamily: FONT_GLACIAL,
  fontSize: "clamp(0.75rem, 3.5vw, 1.1rem)",
  color: WHITE,
  width: "100%",
  boxSizing: "border-box",
  resize: "vertical",
  minHeight: "clamp(8rem, 20vw, 14rem)",
  lineHeight: 1.6,
};

const btnStyle = {
  background: LILAC_MID,
  border: "none",
  cursor: "pointer",
  padding: "clamp(0.2rem, 1vw, 0.4rem) 0.8rem",
  fontFamily: FONT_AGRANDIR,
  fontSize: "clamp(0.75rem, 3.5vw, 1.56rem)",
  color: PURPLE,
  fontWeight: 700,
  textTransform: "uppercase",
  height: "clamp(1.4rem, 7vw, 2.5rem)",
};

const memberCardStyle = {
  border: `1.5px solid ${PURPLE}`,
  borderRadius: "0.75rem",
  display: "flex",
  alignItems: "center",
  padding: "0.5rem 0.9rem",
  background: WHITE,
  gap: "0.75rem",
  boxSizing: "border-box",
  width: "100%",
};

const memberInputStyle = {
  background: LILAC_MID,
  border: "none",
  borderRadius: "50px",
  padding: "0.25rem 0.8rem",
  fontFamily: FONT_GLACIAL,
  fontSize: "clamp(0.7rem, 3vw, 0.9rem)",
  color: PURPLE,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const TYPE_CONFIG = {
  0: { title: "position\npaper",       bg: "/images/documento-bg.png", submitLabel: "DOCUMENTAR" },
  1: { title: "documento\nde trabalho", bg: "/images/documento-bg.png", submitLabel: "DOCUMENTAR" },
  2: { title: "documento\nde crise",    bg: "/images/documento-bg.png", submitLabel: "DOCUMENTAR" },
  3: { title: "resolução\nfinal",       bg: "/images/documento-bg.png", submitLabel: "DOCUMENTAR" },
  4: { title: "acordo\nmultilateral",   bg: "/images/documento-bg.png", submitLabel: "DOCUMENTAR" },
  5: { title: "agenda",                 bg: "/images/documento-bg.png", submitLabel: "DOCUMENTAR" },
  6: { title: "carta à\nimprensa",      bg: "/images/documento-bg.png", submitLabel: "DOCUMENTAR" },
  7: { title: "notícia",                bg: "/images/documento-bg.png", submitLabel: "DIVULGAR"   },
};

// ─── TextField (linha única — mantido para outros usos) ───────────────────────
function TextField({ label, name, value, onChange, required = false }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2">
        <span style={labelStyle}>{label}</span>
        {required && <span style={obrigStyle}>*Obrigatório</span>}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        style={inputStyle}
      />
    </div>
  );
}

// ─── TextareaField (multi-parágrafo) ─────────────────────────────────────────
function TextareaField({ label, name, value, onChange, required = false }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2">
        <span style={labelStyle}>{label}</span>
        {required && <span style={obrigStyle}>*Obrigatório</span>}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        style={textareaStyle}
        placeholder="Use Enter para separar parágrafos..."
      />
    </div>
  );
}

function FileButton({ label, onChange, multiple = false, buttonLabel = "SELECIONE" }) {
  const [nomes, setNomes] = useState([]);
  return (
    <div className="flex flex-col gap-1">
      <span style={labelStyle}>{label}</span>
      <label
        className="rounded-full cursor-pointer transition-all hover:brightness-110"
        style={{
          background: LILAC_MID,
          padding: `clamp(0.2rem, 1vw, 0.4rem) clamp(0.8rem, 2vw, 1.5rem)`,
          fontFamily: FONT_AGRANDIR,
          fontSize: "clamp(0.75rem, 3.5vw, 1.56rem)",
          color: PURPLE,
          fontWeight: 700,
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "clamp(1.4rem, 7vw, 2.5rem)",
        }}
      >
        {buttonLabel}
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files);
            setNomes(files.map((f) => f.name));
            onChange(files);
          }}
        />
      </label>
      {nomes.length > 0 && (
        <span style={{ ...labelStyle, fontSize: "clamp(0.65rem, 2.5vw, 1rem)", color: LILAC_DARK }}>
          {nomes.join(", ")}
        </span>
      )}
    </div>
  );
}

function MemberRow({ username, delegacao, onRemove }) {
  return (
    <div style={memberCardStyle}>
      <div style={{
        width: "2rem", height: "2rem", borderRadius: "50%",
        background: LILAC_MID, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" fill={PURPLE} opacity="0.5"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={PURPLE} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
        </svg>
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
        <span style={{ fontFamily: FONT_GLACIAL, fontSize: "clamp(0.75rem, 3vw, 0.95rem)", fontWeight: 700, color: PURPLE }}>
          @{username}
        </span>
        <span style={{ fontFamily: FONT_GLACIAL, fontSize: "clamp(0.65rem, 2.5vw, 0.85rem)", color: "#333" }}>
          {delegacao}
        </span>
      </div>
      <button
        onClick={onRemove}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginLeft: "auto", flexShrink: 0 }}
        title="Remover"
      >
        <img src="/images/excluir.png" alt="Remover" style={{ height: "1rem", width: "auto" }} />
      </button>
    </div>
  );
}

function AddMemberRow({ onAdd, error }) {
  const [input, setInput] = useState("");
  function handleAdd() {
    const v = input.trim();
    if (!v) return;
    onAdd(v);
    setInput("");
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      <div style={{ ...memberCardStyle, border: `1.5px dashed ${PURPLE}`, background: "transparent" }}>
        <button
          onClick={handleAdd}
          style={{
            width: "2rem", height: "2rem", borderRadius: "50%",
            background: LILAC_MID, flexShrink: 0, border: "none",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
          title="Adicionar"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke={PURPLE} strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>
        <input
          placeholder="Username"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } }}
          style={{ ...memberInputStyle, flex: 1 }}
        />
      </div>
      {error && (
        <span style={{ fontFamily: FONT_GLACIAL, fontSize: "0.8rem", color: "red", paddingLeft: "0.5rem" }}>
          {error}
        </span>
      )}
    </div>
  );
}

function MemberList({ label, members, onAdd, onRemove, addError }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <span style={sectionLabelStyle}>{label}</span>
      {members.map((m, i) => (
        <MemberRow key={i} username={m.username} delegacao={m.delegacao} onRemove={() => onRemove(i)} />
      ))}
      <AddMemberRow onAdd={onAdd} error={addError} />
    </div>
  );
}

// ─── Per-type field sections — todos usam TextareaField para conteudo ─────────

function TipoPaper({ data, setData }) {
  return (
    <>
      <TextareaField label="Texto do documento" name="conteudo" value={data.conteudo} onChange={setData} required />
      <FileButton label="Brasão" onChange={(files) => setData("brasao", files[0] ?? null)} />
    </>
  );
}

function TipoComPatrocinadoresESignatarios({ data, setData, patrocinadores, signatarios, onAddPatrocinador, onRemovePatrocinador, onAddSignatario, onRemoveSignatario, addPatrError, addSignError }) {
  return (
    <>
      <TextareaField label="Texto do documento" name="conteudo" value={data.conteudo} onChange={setData} required />
      <MemberList label="Adicione os patrocinadores" members={patrocinadores} onAdd={onAddPatrocinador} onRemove={onRemovePatrocinador} addError={addPatrError} />
      <MemberList label="Adicione os signatários"    members={signatarios}    onAdd={onAddSignatario}    onRemove={onRemoveSignatario}    addError={addSignError} />
    </>
  );
}

function TipoSoTexto({ data, setData }) {
  return (
    <TextareaField label="Texto do documento" name="conteudo" value={data.conteudo} onChange={setData} required />
  );
}

function TipoComSignatarios({ data, setData, signatarios, onAddSignatario, onRemoveSignatario, addSignError }) {
  return (
    <>
      <TextareaField label="Texto do documento" name="conteudo" value={data.conteudo} onChange={setData} required />
      <MemberList label="Adicione os signatários" members={signatarios} onAdd={onAddSignatario} onRemove={onRemoveSignatario} addError={addSignError} />
    </>
  );
}

function TipoNoticia({ data, setData }) {
  return (
    <>
      <TextareaField label="Descrição" name="conteudo" value={data.conteudo} onChange={setData} required />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <span style={labelStyle}>Imagens (até 4)</span>
        <FileButton label="" multiple onChange={(files) => setData("fotos", files.slice(0, 4))} />
      </div>
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Create() {
  const { tipo, comite_id, membros = [] } = usePage().props;
  const config = TYPE_CONFIG[tipo] ?? TYPE_CONFIG[2];

  const { data, setData, post, processing, errors } = useForm({
    tipo,
    comite_id,
    conteudo: "",
    brasao: null,
    foto1: null, foto2: null, foto3: null, foto4: null,
    patrocinadores: [],
    signatarios: [],
  });

  const [patrocinadores, setPatrocinadores] = useState([]);
  const [signatarios,    setSignatarios]    = useState([]);
  const [addPatrError,   setAddPatrError]   = useState(null);
  const [addSignError,   setAddSignError]   = useState(null);

  function findMembro(username) {
    return membros.find((m) => m.username?.toLowerCase() === username.toLowerCase());
  }

  function handleAddPatrocinador(username) {
    const membro = findMembro(username);
    if (!membro) { setAddPatrError("Usuário não encontrado neste comitê."); return; }
    if (patrocinadores.find((p) => p.username === membro.username)) { setAddPatrError("Já adicionado."); return; }
    const next = [...patrocinadores, { username: membro.username, delegacao: membro.delegacao }];
    setPatrocinadores(next);
    setData("patrocinadores", next.map((p) => p.username));
    setAddPatrError(null);
  }

  function handleRemovePatrocinador(index) {
    const next = patrocinadores.filter((_, i) => i !== index);
    setPatrocinadores(next);
    setData("patrocinadores", next.map((p) => p.username));
  }

  function handleAddSignatario(username) {
    const membro = findMembro(username);
    if (!membro) { setAddSignError("Usuário não encontrado neste comitê."); return; }
    if (signatarios.find((s) => s.username === membro.username)) { setAddSignError("Já adicionado."); return; }
    const next = [...signatarios, { username: membro.username, delegacao: membro.delegacao }];
    setSignatarios(next);
    setData("signatarios", next.map((s) => s.username));
    setAddSignError(null);
  }

  function handleRemoveSignatario(index) {
    const next = signatarios.filter((_, i) => i !== index);
    setSignatarios(next);
    setData("signatarios", next.map((s) => s.username));
  }

  function handleFotos(files) {
    ["foto1","foto2","foto3","foto4"].forEach((key, i) => setData(key, files[i] ?? null));
  }

  function submit(e) {
    e.preventDefault();
    post("/documentos", { forceFormData: true });
  }

  function renderFields() {
    switch (tipo) {
      case 0: return <TipoPaper data={data} setData={setData} />;
      case 1: case 3: case 4:
        return (
          <TipoComPatrocinadoresESignatarios
            data={data} setData={setData}
            patrocinadores={patrocinadores} signatarios={signatarios}
            onAddPatrocinador={handleAddPatrocinador} onRemovePatrocinador={handleRemovePatrocinador}
            onAddSignatario={handleAddSignatario}     onRemoveSignatario={handleRemoveSignatario}
            addPatrError={addPatrError} addSignError={addSignError}
          />
        );
      case 2: case 5: return <TipoSoTexto data={data} setData={setData} />;
      case 6:
        return (
          <TipoComSignatarios
            data={data} setData={setData}
            signatarios={signatarios}
            onAddSignatario={handleAddSignatario} onRemoveSignatario={handleRemoveSignatario}
            addSignError={addSignError}
          />
        );
      case 7:
        return (
          <TipoNoticia
            data={{ ...data, fotos: [data.foto1, data.foto2, data.foto3, data.foto4].filter(Boolean) }}
            setData={(key, val) => { if (key === "fotos") handleFotos(val); else setData(key, val); }}
          />
        );
      default: return null;
    }
  }

  const firstError = Object.values(errors)[0];

  const card = (
    <div
      className="rounded-[2rem] flex flex-col w-full"
      style={{
        background: LILAC_LIGHT,
        paddingTop: "clamp(1.5rem, 4%, 3rem)",
        paddingBottom: "clamp(1.5rem, 4%, 3rem)",
        paddingLeft: "clamp(1rem, 6%, 4rem)",
        paddingRight: "clamp(1rem, 6%, 4rem)",
        gap: "clamp(0.5rem, 2vw, 1rem)",
      }}
    >
      <h1
        style={{
          fontFamily: FONT_NIMBUS,
          fontSize: "clamp(1.6rem, 6.5vw, 4rem)",
          textAlign: "center",
          color: LILAC_DARK,
          lineHeight: 1.0,
          fontWeight: 700,
          marginBottom: "0.25rem",
          whiteSpace: "pre-line",
        }}
      >
        {config.title}
      </h1>

      {renderFields()}

      {firstError && (
        <p style={{ ...labelStyle, fontSize: "clamp(0.7rem, 3vw, 1.1rem)", textAlign: "center", color: "red" }}>
          *{firstError}
        </p>
      )}

      <div className="flex gap-3 mt-2">
        <button onClick={submit} disabled={processing} className="rounded-full transition-all hover:brightness-110 active:scale-95 flex-1" style={btnStyle}>
          {config.submitLabel}
        </button>
        <button onClick={() => window.history.back()} className="rounded-full transition-all hover:brightness-110 active:scale-95 flex-1" style={btnStyle}>
          DESCARTAR
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden"
      style={{ backgroundImage: `url('${config.bg}')`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}
    >
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* DESKTOP */}
      <div className="relative z-10 hidden md:flex w-full min-h-screen items-center" style={{ paddingTop: "8.6%", paddingBottom: "8.6%" }}>
        <div style={{ width: "5.63%", flexShrink: 0 }} />
        <div style={{ width: "44.22%", flexShrink: 0 }}>{card}</div>
      </div>

      {/* MOBILE */}
      <div className="relative z-10 flex md:hidden w-full min-h-screen items-center justify-center" style={{ paddingTop: "24.1%", paddingBottom: "24.1%", paddingLeft: "6.2%", paddingRight: "6.2%" }}>
        <div className="w-full">{card}</div>
      </div>
    </div>
  );
}
