import React from "react";
import { Link, usePage } from "@inertiajs/react";

const BOTOES_TIPO_0 = [
  { label: "INSCRIÇÃO",   href: "/publications/create?type=0" },
  { label: "DELEGAÇÃO",   href: "/publications/create?type=1" },
  { label: "PRESENÇA",    href: "/publications/create?type=2" },
  { label: "MEMÓRIA",     href: "/publications/create?type=3" },
  { label: "PRÊMIO",      href: "/awards/create?tipo=0" },
  { label: "PEER CHOICE", href: "/awards/create?tipo=1" },
];

const BOTOES_TIPO_0_PROGRESSO_7 = [
  ...BOTOES_TIPO_0,
  { label: "VÍDEO CURTO", href: "/publications/create?type=5" },
];

const BOTOES_TIPO_1 = [
  { label: "POST",        href: "/publications/create?type=4" },
  { label: "PRÊMIO",      href: "/awards/create?tipo=0" },
  { label: "PEER CHOICE", href: "/awards/create?tipo=1" },
  { label: "VÍDEO CURTO", href: "/publications/create?type=5" },
];

function getBotoes(tipo, progresso) {
  if (tipo === 1) return BOTOES_TIPO_1;
  if (tipo === 0 && progresso === 7) return BOTOES_TIPO_0_PROGRESSO_7;
  return BOTOES_TIPO_0;
}

export default function BarraPublications({ mobile = false }) {
  const { auth } = usePage().props;
  const user = auth?.user;

  const tipo = user?.tipo ?? 0;
  const progresso = user?.progresso ?? 0;
  const botoes = getBotoes(tipo, progresso);

  return (
    <div
      style={{
        background: "#ddd3f3",
        borderRadius: "2rem",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        paddingTop: "1rem",
      }}
    >
      {/* Imagem — ocupa o espaço restante */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 0,
          marginBottom: "1rem",
        }}
      >
        <img
          src="/images/palanque-feed.png"
          alt="Palanque"
          style={{
            width: "80%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Botões — sempre no fundo */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          padding: "0 1rem 1.2rem",
          flexShrink: 0,
        }}
      >
        {botoes.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              textDecoration: "none",
              justifyContent: "center",
            }}
          >
            {/* Ícone + */}
            <span
              style={{
                width: mobile ? "1.5rem" : "1.8rem",
                height: mobile ? "1.5rem" : "1.8rem",
                borderRadius: "50%",
                background: "#6425d8",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                fontWeight: 700,
                flexShrink: 0,
                lineHeight: 1,
              }}
            >
              +
            </span>

            {/* Botão */}
            <span
              style={{
                flex: 1,
                background: "#c3a5ff",
                borderRadius: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: mobile ? "1.5rem" : "2rem",
                fontFamily: "'Agrandir', sans-serif",
                fontWeight: 700,
                color: "#6425d8",
                letterSpacing: "0.02em",
                fontSize: mobile ? "1rem" : "1.4rem",
                maxWidth: mobile ? "180px" : "240px",
              }}
            >
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
