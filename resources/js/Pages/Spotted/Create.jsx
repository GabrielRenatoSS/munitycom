import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";

const labelStyle = {
  fontFamily: "'Glacial Indifference', sans-serif",
  fontSize: "clamp(0.85rem, 4vw, 2.3rem)",
  color: "#6425d8",
  lineHeight: 1.1,
};

const obrigStyle = {
  fontFamily: "'Glacial Indifference', sans-serif",
  fontSize: "clamp(0.6rem, 2.5vw, 1.2rem)",
  color: "#8c52ff",
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

function Field({ label, name, value, onChange, required = false }) {
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

function RadioGroup({ label, required, options, value, onChange }) {
  return (
    <div className="flex flex-col" style={{ gap: "0.2rem" }}>
      <div className="flex items-baseline gap-2">
        <span style={labelStyle}>{label}</span>
        {required && <span style={obrigStyle}>*Obrigatório</span>}
      </div>
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        {options.map((opt) => (
          <label
            key={String(opt.value)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
              ...labelStyle,
            }}
          >
            <span
              onClick={() => onChange(opt.value)}
              style={{
                width: "clamp(1rem, 4vw, 1.8rem)",
                height: "clamp(1rem, 4vw, 1.8rem)",
                borderRadius: "50%",
                background: value === opt.value ? "#c3a5ff" : "#b8a0e8",
                display: "inline-block",
                flexShrink: 0,
                cursor: "pointer",
                boxShadow: value === opt.value ? "0 0 0 3px #6425d8 inset" : "none",
                transition: "box-shadow 0.15s",
              }}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}

export default function Create() {
  const { can_anonimo, comite_id } = usePage().props;

  const { data, setData, post, processing, errors, transform } = useForm({
    username_destinatario: "",
    mensagem: "",
    tipo: null,
    anonimo: null,
    comite_id: comite_id ?? "",
  });

  transform((d) => ({
    ...d,
    tipo:      d.tipo !== null ? Number(d.tipo) : null,
    anonimo:   d.anonimo !== null ? (d.anonimo ? 1 : 0) : null,
    comite_id: d.comite_id !== "" ? Number(d.comite_id) : "",
  }));

  const [submitError, setSubmitError] = useState(null);

  function submit(e) {
    e.preventDefault();
    setSubmitError(null);

    if (data.tipo === null) {
      setSubmitError("Selecione a privacidade da mensagem.");
      return;
    }
    if (can_anonimo && data.anonimo === null) {
      setSubmitError("Selecione o tipo de remetente.");
      return;
    }

    post("/spotteds");
  }

  const firstError = Object.values(errors)[0] ?? submitError;

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
        spotted
      </h1>

      <Field
        label="Username destinatário"
        name="username_destinatario"
        value={data.username_destinatario}
        onChange={setData}
        required
      />

      <Field
        label="Mensagem"
        name="mensagem"
        value={data.mensagem}
        onChange={setData}
        required
      />

      <RadioGroup
        label="Privacidade"
        required
        options={[
          { label: "Público",  value: 0 },
          { label: "Privado", value: 1 },
        ]}
        value={data.tipo}
        onChange={(v) => setData("tipo", v)}
      />

      {can_anonimo && (
        <RadioGroup
          label="Remetente"
          required
          options={[
            { label: "Identificado", value: false },
            { label: "Anônimo",      value: true },
          ]}
          value={data.anonimo}
          onChange={(v) => setData("anonimo", v)}
        />
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
          ENVIAR
        </button>
        <button
          onClick={() => window.history.back()}
          type="button"
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
        backgroundImage: "url('/images/spotted-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* DESKTOP */}
      <div
        className="relative z-10 hidden md:flex w-full min-h-screen"
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
