import React from "react";
import Secretariado from "./Secretariado";
import Comites from "./Comites";

export default function EdicaoDetalhe({ edicao }) {
  if (!edicao) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Glacial Indifference', sans-serif",
          color: "#6425d8",
          fontSize: "1rem",
        }}
      >
        Selecione uma edição para visualizar.
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#ddd3f3",
        borderRadius: "1.5rem",
        width: "100%",
        height: "100%",
        overflowY: "auto",
        padding: "1.5rem 1.5rem 1rem",
        boxSizing: "border-box",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* Nome */}
      <h1
        style={{
          fontFamily: "'Agrandir', sans-serif",
          fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
          fontWeight: 700,
          color: "#6425d8",
          textAlign: "center",
          margin: "0 0 0.6rem",
        }}
      >
        {edicao.name}
      </h1>

      {/* Datas */}
      <p
        style={{
          fontFamily: "'Glacial Indifference', sans-serif",
          fontSize: "clamp(0.9rem, 1.5vw, 1.2rem)",
          color: "black",
          textAlign: "center",
          margin: "0 0 0.5rem",
        }}
      >
        <strong>Data início</strong>: {edicao.dt_inicio}&nbsp;&nbsp;
        <strong>Data término</strong>: {edicao.dt_termino}
      </p>

      <Secretariado membros={edicao.secretariado ?? []} />
      <Comites comites={edicao.comites ?? []} />
    </div>
  );
}
