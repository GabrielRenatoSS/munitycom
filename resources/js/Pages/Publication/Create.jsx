import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";

const labelStyle = {
  fontFamily: "'Glacial Indifference', sans-serif",
  fontSize: "clamp(0.85rem, 4vw, 2.3rem)",
  color: "#6425d8",
  lineHeight: 1.1,
};

const inputStyle = {
  background: "#c3a5ff",
  borderRadius: "50px",
  border: "none",
  outline: "none",
  padding: `0 clamp(0.6rem, 2vw, 1.4rem)`,
  fontFamily: "'Glacial Indifference', sans-serif",
  fontSize: "clamp(0.75rem, 3.5vw, 1.69rem)",
  height: "clamp(1.4rem, 7vw, 2.8rem)",
  color: "#ffffff",
  width: "100%",
};

const obrigStyle = {
  fontFamily: "'Glacial Indifference', sans-serif",
  fontSize: "clamp(0.6rem, 2.5vw, 1.2rem)",
  color: "#8c52ff",
};

function Field({ label, name, value, onChange, type = "text", required = false }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2">
        <span style={labelStyle}>{label}</span>
        {required && <span style={obrigStyle}>*Obrigatório</span>}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        style={inputStyle}
      />
    </div>
  );
}

function FileButton({ label, onChange, multiple = false, accept = "image/*" }) {
  const [nomes, setNomes] = useState([]);
  return (
    <div className="flex flex-col gap-1">
      <span style={labelStyle}>{label}</span>
      <label
        className="rounded-full cursor-pointer transition-all hover:brightness-110"
        style={{
          background: "#c3a5ff",
          padding: `clamp(0.2rem, 1vw, 0.4rem) clamp(0.8rem, 2vw, 1.5rem)`,
          fontFamily: "'AGRandir', sans-serif",
          fontSize: "clamp(0.75rem, 3.5vw, 1.56rem)",
          color: "#6425d8",
          fontWeight: 700,
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "clamp(1.4rem, 7vw, 2.5rem)",
        }}
      >
        SELECIONE
        <input
          type="file"
          accept={accept}
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
        <span style={{ ...labelStyle, fontSize: "clamp(0.65rem, 2.5vw, 1rem)" }}>
          {nomes.join(", ")}
        </span>
      )}
    </div>
  );
}

function TipoInscricao({ data, setData }) {
  return (
    <>
      <Field label="Nome da Simulação" name="mun" value={data.mun} onChange={setData} required />
      <Field label="Primeira Opção de Comitê" name="comite" value={data.comite} onChange={setData} />
      <Field label="Primeira Opção de Delegação" name="delegation" value={data.delegation} onChange={setData} />
    </>
  );
}

function TipoDelegacao({ data, setData }) {
  return (
    <>
      <Field label="Nome da Simulação" name="mun" value={data.mun} onChange={setData} required />
      <Field label="Nome do Comitê" name="comite" value={data.comite} onChange={setData} required />
      <Field label="Nome da Delegação" name="delegation" value={data.delegation} onChange={setData} required />
    </>
  );
}

function TipoPresenca({ data, setData }) {
  return (
    <>
      <Field label="Nome da Simulação" name="mun" value={data.mun} onChange={setData} required />
      <Field label="Primeiro dia da MUN" name="descricao" value={data.descricao} onChange={setData} type="date" required />
    </>
  );
}

function TipoMemoria({ data, setData }) {
  return (
    <>
      <Field label="Nome da Simulação" name="mun" value={data.mun} onChange={setData} required />
      <Field label="Descrição" name="descricao" value={data.descricao} onChange={setData} />
      <FileButton
        label="Selecione até 4 fotos"
        multiple
        onChange={(files) => setData("images", files.slice(0, 4))}
      />
    </>
  );
}

function TipoPost({ data, setData }) {
  return (
    <>
      <Field label="Descrição" name="descricao" value={data.descricao} onChange={setData} />
      <FileButton
        label="Selecione até 10 fotos"
        multiple
        onChange={(files) => setData("images", files.slice(0, 10))}
      />
    </>
  );
}

const TYPE_CONFIG = {
  0: { title: "inscrição",  bg: "/images/inscricao-bg.png" },
  1: { title: "delegação",  bg: "/images/delegacao-bg.png" },
  2: { title: "presença",   bg: "/images/presenca-bg.png" },
  3: { title: "memória",    bg: "/images/memoria-bg.png" },
  4: { title: "post",       bg: "/images/post-bg.png" },
};

export default function Create() {
  const { type } = usePage().props;
  const config = TYPE_CONFIG[type] ?? TYPE_CONFIG[4];

  const { data, setData, post, processing, errors } = useForm({
    type,
    mun: "",
    comite: "",
    delegation: "",
    descricao: "",
    fixo: false,
    images: [],
  });

  const firstError = Object.values(errors)[0];

  function submit(e) {
    e.preventDefault();
    post("/publications");
  }

  function renderFields() {
    switch (type) {
      case 0: return <TipoInscricao data={data} setData={setData} />;
      case 1: return <TipoDelegacao data={data} setData={setData} />;
      case 2: return <TipoPresenca data={data} setData={setData} />;
      case 3: return <TipoMemoria data={data} setData={setData} />;
      case 4: return <TipoPost data={data} setData={setData} />;
      default: return null;
    }
  }

  const btnStyle = {
    background: "#c3a5ff",
    border: "none",
    cursor: "pointer",
    padding: "clamp(0.2rem, 1vw, 0.4rem) 0.8rem",
    fontFamily: "'AGRandir', sans-serif",
    fontSize: "clamp(0.75rem, 3.5vw, 1.56rem)",
    color: "#6425d8",
    fontWeight: 700,
    textTransform: "uppercase",
    height: "clamp(1.4rem, 7vw, 2.5rem)",
  };

  const card = (
    <div
      className="rounded-[2rem] flex flex-col w-full"
      style={{
        background: "#ddd3f3",
        paddingTop: "clamp(1.5rem, 4%, 3rem)",
        paddingBottom: "clamp(1.5rem, 4%, 3rem)",
        paddingLeft: "clamp(1rem, 6%, 4rem)",
        paddingRight: "clamp(1rem, 6%, 4rem)",
        gap: "clamp(0.5rem, 2vw, 1rem)",
      }}
    >
      <h1
        style={{
          fontFamily: "'TAN Nimbus', serif",
          fontSize: "clamp(1.8rem, 7.75vw, 4.6rem)",
          textAlign: "center",
          color: "#8c52ff",
          lineHeight: 1.0,
          fontWeight: 700,
          marginBottom: "0.5rem",
        }}
      >
        {config.title}
      </h1>

      {renderFields()}

      {firstError && (
        <p style={{ ...labelStyle, fontSize: "clamp(0.7rem, 3vw, 1.56rem)", textAlign: "center" }}>
          *{firstError}
        </p>
      )}

      <div className="flex gap-3 mt-2">
        <button
          onClick={submit}
          disabled={processing}
          className="rounded-full transition-all hover:brightness-110 active:scale-95 flex-1"
          style={btnStyle}
        >
          COMPARTILHAR
        </button>
        <button
          onClick={() => window.history.back()}
          className="rounded-full transition-all hover:brightness-110 active:scale-95 flex-1"
          style={btnStyle}
        >
          DESCARTAR
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden"
      style={{
        backgroundImage: `url('${config.bg}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* DESKTOP */}
      <div
        className="relative z-10 hidden md:flex w-full min-h-screen items-center"
        style={{ paddingTop: "8.6%", paddingBottom: "8.6%" }}
      >
        <div style={{ width: "5.63%", flexShrink: 0 }} />
        <div style={{ width: "44.22%", flexShrink: 0 }}>{card}</div>
      </div>

      {/* MOBILE */}
      <div
        className="relative z-10 flex md:hidden w-full min-h-screen items-center justify-center"
        style={{
          paddingTop: "24.1%",
          paddingBottom: "24.1%",
          paddingLeft: "6.2%",
          paddingRight: "6.2%",
        }}
      >
        <div className="w-full">{card}</div>
      </div>
    </div>
  );
}
