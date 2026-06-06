import React from "react";
import { Link } from "@inertiajs/react";

export default function AuthCard({
  title,
  fields,
  data,
  setData,
  errors,
  onSubmit,
  processing,
  submitLabel = "ENTRAR",
  links = [],
  extraContent = null,
}) {
  const firstError = fields.map((f) => errors[f.name]).find(Boolean);

  return (
    <div
      className="rounded-[2rem] flex flex-col"
      style={{
        background: "#ddd3f3",
        paddingTop: "clamp(1.5rem, 4%, 3rem)",
        paddingBottom: "clamp(1.5rem, 4%, 3rem)",
        paddingLeft: "clamp(1rem, 6%, 4rem)",
        paddingRight: "clamp(1rem, 6%, 4rem)",
        width: "100%",
        justifyContent: "center",
        gap: "clamp(0.3rem, 1.5vw, 0.6rem)",
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
        {title}
      </h1>

      {/* Campos */}
      {fields.map(({ name, label, type = "text" }) => (
        <div key={name} className="flex flex-col gap-1">
          <label
            style={{
              fontFamily: "'Glacial Indifference', sans-serif",
              fontSize: "clamp(0.85rem, 4vw, 2.5rem)",
              color: "#6425d8",
              lineHeight: 1.1,
            }}
          >
            {label}
          </label>
          <input
            type={type}
            value={data[name]}
            onChange={(e) => setData(name, e.target.value)}
            style={{
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
            }}
          />
        </div>
      ))}

      {/* Conteúdo extra (campos customizados) */}
      {extraContent}

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
            *{firstError}
          </p>
        )}
      </div>

      {/* Botão submit */}
      <div className="flex justify-center">
        <button
          onClick={onSubmit}
          disabled={processing}
          className="rounded-full transition-all hover:brightness-110 active:scale-95"
          style={{
            background: "#c3a5ff",
            border: "none",
            cursor: "pointer",
            padding: "clamp(0.2rem, 1vw, 0.4rem) 3rem",
            fontFamily: "'AGRandir', sans-serif",
            fontSize: "clamp(0.75rem, 3.5vw, 1.56rem)",
            color: "#6425d8",
            fontWeight: 700,
            textTransform: "uppercase",
            width: "auto",
            minWidth: "clamp(8rem, 50vw, 16rem)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "clamp(1.5rem, 7vw, 2.6rem)",
          }}
        >
          {submitLabel}
        </button>
      </div>

      {/* Links inferiores */}
      {links.length > 0 && (
        <div className="flex flex-row justify-center gap-2 mt-1 flex-wrap">
          {links.map(({ sublabel, label, href }) => (
            <div key={href} className="flex flex-col items-center gap-1 flex-1">
              <span
                style={{
                  fontFamily: "'Glacial Indifference', sans-serif",
                  fontSize: "clamp(0.7rem, 3vw, 1.56rem)",
                  color: "#6425d8",
                  textAlign: "center",
                }}
              >
                {sublabel}
              </span>
              <Link
                href={href}
                className="rounded-full transition-all hover:brightness-110 w-full"
                style={{
                  background: "#c3a5ff",
                  padding: "clamp(0.2rem, 1vw, 0.4rem) 1rem",
                  fontFamily: "'AGRandir', sans-serif",
                  fontSize: "clamp(0.75rem, 3.5vw, 1.56rem)",
                  color: "#6425d8",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  width: "auto",
                  minWidth: "clamp(3rem, 35vw, 16rem)",
                  height: "clamp(1.5rem, 7vw, 2.6rem)",
                }}
              >
                {label}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
