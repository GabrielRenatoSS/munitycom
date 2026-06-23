import React from "react";
import { useForm, usePage, router } from "@inertiajs/react";

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
  padding: "0 clamp(0.6rem, 2vw, 1.4rem)",
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

const TYPE_CONFIG = {
  0: { title: "prêmio",      bg: "/images/premio-bg.png",      descLabel: "Prêmio Conquistado" },
  1: { title: "peer choice", bg: "/images/peerchoice-bg.png",  descLabel: "Título Conquistado" },
};

export default function CreateAward() {
  const { tipo, auth } = usePage().props;
  const isMun = auth?.user?.tipo === 1;
  const config = TYPE_CONFIG[tipo] ?? TYPE_CONFIG[0];

  const { data, setData, post, processing, errors } = useForm({
    tipo,
    mun: "",
    comite: "",
    delegation: "",
    name: "",
    data_award: null,
    username: "",
  });

  const firstError = Object.values(errors)[0];

  function submit(e) {
    e.preventDefault();
    post("/awards");
  }

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
          fontSize: "clamp(1.8rem, 7.75vw, 4.4rem)",
          textAlign: "center",
          color: "#8c52ff",
          lineHeight: 1.0,
          fontWeight: 700,
          marginBottom: "0.5rem",
        }}
      >
        {config.title}
      </h1>

      {/* Campos comuns */}
      {!isMun && (
        <Field label="Nome da Simulação" name="mun" value={data.mun} onChange={setData} required />
      )}
      <Field label="Nome do Comitê"    name="comite"     value={data.comite}     onChange={setData} required />
      <Field label="Nome da Delegação" name="delegation" value={data.delegation} onChange={setData} required />
      <Field label={config.descLabel}  name="name"  value={data.name}  onChange={setData} required />

      {/* Data — só para usuário comum */}
      {!isMun && (
        <Field
          label="Data"
          name="data_award"
          value={data.data_award ?? ""}
          onChange={setData}
          type="date"
          required
        />
      )}

      {/* Username — só para MUN */}
      {isMun && (
        <Field label="Username do premiado" name="username" value={data.username} onChange={setData} required />
      )}

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
        backgroundAttachment: "fixed",
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
