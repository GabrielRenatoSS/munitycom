import React from "react";
import { Link } from "@inertiajs/react";

export default function BarraDocumentos({ mobile = false, comiteId = null }) {
  const botoes = [
    { label: "SPOTTED",         href: `/spotteds/create?comite_id=${comiteId}` },
    { label: "POSITION PAPER",  href: `/documentos/create?tipo=0&comite_id=${comiteId}` },
    { label: "TRABALHO",        href: `/documentos/create?tipo=1&comite_id=${comiteId}` },
    { label: "CRISE",           href: `/documentos/create?tipo=2&comite_id=${comiteId}` },
    { label: "RESOLUÇÃO FINAL", href: `/documentos/create?tipo=3&comite_id=${comiteId}` },
    { label: "A. MULTILATERAL", href: `/documentos/create?tipo=4&comite_id=${comiteId}` },
    { label: "AGENDA",          href: `/documentos/create?tipo=5&comite_id=${comiteId}` },
    { label: "CARTA À IMP.",    href: `/documentos/create?tipo=6&comite_id=${comiteId}` },
    { label: "NOTÍCIA",         href: `/documentos/create?tipo=7&comite_id=${comiteId}` },
  ];
  return (
    <div
      style={{
        background: "#ddd3f3",
        borderRadius: "2rem",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        // sem height: 100% — altura definida pelo conteúdo dos botões
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: mobile ? "0.25rem" : "0.5rem",
          padding: mobile ? "0.5rem 0.5rem 0.6rem" : "1rem 1rem 1.2rem",
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
                width: mobile ? "1rem" : "1.8rem",
                height: mobile ? "1rem" : "1.8rem",
                borderRadius: "50%",
                background: "#6425d8",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: mobile ? "0.75rem" : "1.2rem",
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
                height: mobile ? "1rem" : "2rem",
                fontFamily: "'Agrandir', sans-serif",
                fontWeight: 700,
                color: "#6425d8",
                letterSpacing: "0.02em",
                fontSize: mobile ? "0.6rem" : "1.4rem",
                maxWidth: mobile ? "120px" : "240px",
                pointerEvents: "none",
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
