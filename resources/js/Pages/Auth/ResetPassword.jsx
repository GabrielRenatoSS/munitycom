import React from "react";
import { useForm } from "@inertiajs/react";

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
  height: "clamp(1.5rem, 7vw, 2.8rem)",
  color: "#ffffff",
  width: "100%",
};

const btnStyle = {
  background: "#c3a5ff",
  border: "none",
  cursor: "pointer",
  padding: "clamp(0.2rem, 1vw, 0.4rem) 3rem",
  fontFamily: "'AGRandir', sans-serif",
  fontSize: "clamp(0.75rem, 3.5vw, 1.56rem)",
  color: "#6425d8",
  fontWeight: 700,
  textTransform: "uppercase",
  borderRadius: "50px",
  minWidth: "clamp(8rem, 50vw, 16rem)",
  height: "clamp(1.5rem, 7vw, 2.6rem)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default function ResetPassword() {
  const { data, setData, post, processing, errors } = useForm({
    password: "",
    password_confirmation: "",
  });

  function submit(e) {
    e.preventDefault();
    post("/reset-password");
  }

  const firstError = errors.password || errors.password_confirmation;

  const card = (
    <div
      className="rounded-[2rem] flex flex-col"
      style={{
        background: "#ddd3f3",
        paddingTop: "clamp(1.5rem, 4%, 3rem)",
        paddingBottom: "clamp(1.5rem, 4%, 3rem)",
        paddingLeft: "clamp(1rem, 6%, 4rem)",
        paddingRight: "clamp(1rem, 6%, 4rem)",
        gap: "clamp(0.3rem, 1.5vw, 0.8rem)",
        width: "100%",
      }}
    >
      {/* Título */}
      <h1
        style={{
          fontFamily: "'TAN Nimbus', serif",
          fontSize: "clamp(1.8rem, 7.75vw, 4.6rem)",
          color: "#8c52ff",
          lineHeight: 1.0,
          fontWeight: 700,
          textAlign: "center",
          marginBottom: "clamp(0.2rem, 1vw, 0.5rem)",
        }}
      >
        redefina<br />sua senha
      </h1>

      {/* Nova senha */}
      <div className="flex flex-col gap-1">
        <label style={labelStyle}>Nova senha</label>
        <input
          type="password"
          value={data.password}
          onChange={(e) => setData("password", e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Confirmar senha */}
      <div className="flex flex-col gap-1">
        <label style={labelStyle}>Confirme a nova senha</label>
        <input
          type="password"
          value={data.password_confirmation}
          onChange={(e) => setData("password_confirmation", e.target.value)}
          style={inputStyle}
          onKeyDown={(e) => e.key === "Enter" && submit(e)}
        />
      </div>

      {/* Botão */}
      <div className="flex justify-center mt-2">
        <button
          onClick={submit}
          disabled={processing}
          className="transition-all hover:brightness-110 active:scale-95"
          style={btnStyle}
        >
          REDEFINIR
        </button>
      </div>

      {/* Erro */}
      <div style={{ minHeight: "clamp(1rem, 4vw, 1.8rem)", textAlign: "center" }}>
        {firstError && (
          <p
            style={{
              fontFamily: "'Glacial Indifference', sans-serif",
              fontSize: "clamp(0.7rem, 3vw, 1.56rem)",
              color: "#6425d8",
              lineHeight: 1.2,
            }}
          >
            *{firstError === "The password field confirmation does not match."
              ? "As senhas não coincidem"
              : firstError}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden"
      style={{
        backgroundImage: "url('/images/recsenha.png')",
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
