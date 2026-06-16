import React, { useRef, useState } from "react";
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
  height: "clamp(1.5rem, 7vw, 2.8rem)",
  color: "#ffffff",
  width: "100%",
};

const btnStyle = {
  background: "#c3a5ff",
  border: "none",
  cursor: "pointer",
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
  padding: "clamp(0.2rem, 1vw, 0.4rem) 3rem",
};

export default function VerifyCode({ resetEmail }) {
  const { errors } = usePage().props;

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [resending, setResending] = useState(false);
  const hiddenRef = useRef(null);

  function handleHiddenChange(e) {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    const next = Array(6).fill("");
    for (let i = 0; i < val.length; i++) next[i] = val[i];
    setDigits(next);
    if (val.length === 6) submitCode(val);
  }

  function focusHidden() {
    hiddenRef.current?.focus();
  }

  function submitCode(code) {
    router.post(
      "/verify-code",
      { code },
      { preserveScroll: true }
    );
  }

  function resend() {
    setResending(true);
    router.post(
      "/forgot-password",
      { email: resetEmail },
      {
        preserveScroll: true,
        onFinish: () => setResending(false),
      }
    );
  }

  const firstError = errors?.code;

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
        recupere<br />sua senha
      </h1>

      {/* Label */}
      <p style={labelStyle}>Digite o código enviado</p>

      {/* Bubbles — input oculto único, visual distribuído */}
      <div
        className="flex justify-between"
        style={{ gap: "clamp(0.3rem, 2vw, 0.8rem)", position: "relative" }}
        onClick={focusHidden}
      >
        <input
          ref={hiddenRef}
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={digits.join("")}
          onChange={handleHiddenChange}
          style={{
            position: "absolute",
            opacity: 0,
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            cursor: "text",
            zIndex: 10,
            border: "none",
            outline: "none",
          }}
        />
        {digits.map((d, i) => (
          <div
            key={i}
            onClick={focusHidden}
            style={{
              flex: 1,
              aspectRatio: "1",
              background: "#c3a5ff",
              borderRadius: "35%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "text",
              fontFamily: "'Glacial Indifference', sans-serif",
              fontSize: "clamp(1rem, 5vw, 2.2rem)",
              color: "white",
              fontWeight: 700,
              userSelect: "none",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Erro */}
      {firstError && (
        <p
          style={{
            fontFamily: "'Glacial Indifference', sans-serif",
            fontSize: "clamp(0.7rem, 3vw, 1.56rem)",
            color: "#6425d8",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          *Código de verificação incorreto
        </p>
      )}

      {/* Reenviar — variante com email */}
      {resetEmail ? (
        <div className="flex flex-col items-center gap-1 mt-1">
          <p style={labelStyle}>Esse é seu e-mail?</p>
          <div
            style={{
              ...inputStyle,
              display: "flex",
              alignItems: "center",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            {resetEmail}
          </div>
          <p
            style={{
              fontFamily: "'Glacial Indifference', sans-serif",
              fontSize: "clamp(0.7rem, 3vw, 1.4rem)",
              color: "#6425d8",
              textAlign: "center",
              marginTop: "0.2rem",
            }}
          >
            Se sim
          </p>
          <button
            onClick={resend}
            disabled={resending}
            className="transition-all hover:brightness-110 active:scale-95"
            style={btnStyle}
          >
            REENVIAR
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1 mt-1">
          <p
            style={{
              fontFamily: "'Glacial Indifference', sans-serif",
              fontSize: "clamp(0.7rem, 3vw, 1.4rem)",
              color: "#6425d8",
              textAlign: "center",
            }}
          >
            Não recebeu?
          </p>
          <button
            onClick={resend}
            disabled={resending}
            className="transition-all hover:brightness-110 active:scale-95"
            style={btnStyle}
          >
            REENVIAR
          </button>
        </div>
      )}
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
