import React from "react";
import { router } from "@inertiajs/react";

export default function CadastrarEdicao({ mobile = false }) {
  return (
    <div
      style={{
        background: "#ddd3f3",
        borderRadius: mobile ? "1.5rem" : "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        maxHeight: mobile ? "28vh" : "none",
        padding: mobile ? "2vh" : "1rem",
        boxSizing: "border-box",
        overflow: mobile ? "hidden" : "visible",
      }}
    >
      {/* Imagem */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0 }}>
        <img
          src="/images/certificado.png"
          alt="Cadastrar Edição"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      <button
        onClick={() => router.visit('/edicoes/create')}
        style={{
          width: "100%",
          maxWidth: mobile ? "200px" : "280px",
          background: "#c3a5ff",
          borderRadius: "50px",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: mobile ? "4vh" : "2.2rem",
          fontFamily: "'Agrandir', sans-serif",
          fontSize: mobile ? "1rem" : "1.56rem",
          fontWeight: 700,
          color: "#6425d8",
          letterSpacing: "0.02em",
          cursor: "pointer",
        }}
      >
        CADASTRAR NOVA
      </button>
    </div>
  );
}
