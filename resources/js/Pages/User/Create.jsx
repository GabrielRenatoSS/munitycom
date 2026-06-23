import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import AuthCard from "../../components/AuthCard";

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    email: "",
    email_confirmation: "",
    password: "",
    password_confirmation: "",
    username: "",
    tipo: "",
    foto: null,
    pais: "",
    estado: "",
    cidade: "",
  });

  const [fotoNome, setFotoNome] = useState(null);

  // Validações client-side
  const clientErrors = {};
  if (data.email && data.email_confirmation && data.email !== data.email_confirmation) {
    clientErrors.email = "E-mail diferente da confirmação";
  }
  if (data.password && data.password_confirmation && data.password !== data.password_confirmation) {
    clientErrors.password = "Senha diferente da confirmação";
  }

  const mergedErrors = { ...errors, ...clientErrors };

  function submit(e) {
    e.preventDefault();
    if (Object.keys(clientErrors).length > 0) return;
    post("/register");
  }

  // Campos padrão passados pro AuthCard
  const fields = [
    { name: "email", label: "E-mail", type: "email" },
    { name: "email_confirmation", label: "Confirme o e-mail", type: "email" },
    { name: "username", label: "Username", type: "text" },
    { name: "name", label: "Nome completo", type: "text" },
    { name: "password", label: "Senha", type: "password" },
    { name: "password_confirmation", label: "Confirme sua senha", type: "password" },
  ];

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden"
      style={{
        backgroundImage: "url('/images/create-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* ── DESKTOP ── */}
      <div
        className="relative z-10 hidden md:flex w-full min-h-screen items-center"
        style={{ paddingTop: "8.6%", paddingBottom: "8.6%" }}
      >
        <div style={{ width: "5.63%", flexShrink: 0 }} />

        <div style={{ width: "44.22%", flexShrink: 0 }}>
          <AuthCard
            title="cadastre-se"
            titleSize="7.75rem"
            fields={fields}
            data={data}
            setData={setData}
            errors={mergedErrors}
            onSubmit={submit}
            processing={processing}
            submitLabel="CADASTRE-SE"
            extraContent={
              <ExtraFields
                data={data}
                setData={setData}
                fotoNome={fotoNome}
                setFotoNome={setFotoNome}
              />
            }
            links={[
              { sublabel: "Já tem uma conta?", label: "FAÇA LOGIN", href: "/login" },
            ]}
          />
        </div>
      </div>

      {/* ── MOBILE ── */}
      <div
        className="relative z-10 flex md:hidden w-full min-h-screen items-center justify-center"
        style={{
          paddingTop: "24.1%",
          paddingBottom: "24.1%",
          paddingLeft: "6.2%",
          paddingRight: "6.2%",
        }}
      >
        <div className="w-full">
          <AuthCard
            title="cadastre-se"
            titleSize="clamp(1.8rem, 7.75vw, 4.75rem)"
            fields={fields}
            data={data}
            setData={setData}
            errors={mergedErrors}
            onSubmit={submit}
            processing={processing}
            submitLabel="CADASTRE-SE"
            extraContent={
              <ExtraFields
                data={data}
                setData={setData}
                fotoNome={fotoNome}
                setFotoNome={setFotoNome}
              />
            }
            links={[
              { sublabel: "Já tem uma conta?", label: "FAÇA LOGIN", href: "/login" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

// Campos extras que não cabem no AuthCard genérico
function ExtraFields({ data, setData, fotoNome, setFotoNome }) {
  const labelStyle = {
    fontFamily: "'Glacial Indifference', sans-serif",
    fontSize: "clamp(0.85rem, 4vw, 2.5rem)",
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
    height: "clamp(1.8rem, 7vw, 3.2rem)",
    color: "#ffffff",
    width: "100%",
  };

  const radioStyle = {
    width: "clamp(1rem, 4vw, 1.5rem)",
    height: "clamp(1rem, 4vw, 1.5rem)",
    accentColor: "#c3a5ff",
    cursor: "pointer",
  };

  return (
    <div className="flex flex-col" style={{ gap: "clamp(0.3rem, 1.5vw, 0.6rem)" }}>

      {/* Tipo */}
      <div className="flex flex-col gap-1">
        <span style={labelStyle}>Você é:</span>
        <div className="flex gap-6 items-center">
          <label className="flex items-center gap-2" style={{ cursor: "pointer" }}>
            <input
              type="radio"
              value="0"
              checked={data.tipo === "0"}
              onChange={() => setData("tipo", "0")}
              style={radioStyle}
            />
            <span style={labelStyle}>Delegado</span>
          </label>
          <label className="flex items-center gap-2" style={{ cursor: "pointer" }}>
            <input
              type="radio"
              value="1"
              checked={data.tipo === "1"}
              onChange={() => setData("tipo", "1")}
              style={radioStyle}
            />
            <span style={labelStyle}>MUN</span>
          </label>
        </div>
      </div>

      {/* Foto */}
      <div className="flex flex-col gap-1">
        <span style={labelStyle}>Foto</span>
        <div className="flex items-center gap-3">
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
              display: "inline-block",
            }}
          >
            SELECIONE
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setData("foto", file);
                  setFotoNome(file.name);
                }
              }}
            />
          </label>
          {fotoNome && (
            <span style={{ ...labelStyle, fontSize: "clamp(0.7rem, 3vw, 1.2rem)" }}>
              {fotoNome}
            </span>
          )}
        </div>
      </div>

      {/* Localização */}
      <div className="flex flex-col gap-1">
        <span style={labelStyle}>Localização (cidade, país)</span>
        <input
          type="text"
          placeholder="Cidade"
          value={data.cidade}
          onChange={(e) => setData("cidade", e.target.value)}
          style={{ ...inputStyle, marginBottom: "0.3rem" }}
        />
        <input
          type="text"
          placeholder="Estado"
          value={data.estado}
          onChange={(e) => setData("estado", e.target.value)}
          style={{ ...inputStyle, marginBottom: "0.3rem" }}
        />
        <input
          type="text"
          placeholder="País"
          value={data.pais}
          onChange={(e) => setData("pais", e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Termos */}
      <label className="flex items-center gap-3 cursor-pointer" style={{ marginTop: "0.3rem" }}>
        <input
          type="checkbox"
          style={radioStyle}
        />
        <span style={labelStyle}>Li e aceito os termos de uso</span>
      </label>
    </div>
  );
}
