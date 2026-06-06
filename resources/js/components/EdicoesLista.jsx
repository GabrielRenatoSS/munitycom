import React, { useState } from "react";
import { router } from "@inertiajs/react";
import ConfirmPopup from "./ConfirmPopup";

export default function EdicoesLista({ edicoes = [], canManage = false, initialSelectedId = null }) {
  const [selectedId, setSelectedId] = useState(initialSelectedId);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  if (edicoes.length === 0) {
    return (
      <div style={{ fontFamily: "'Glacial Indifference', sans-serif", color: "#6425d8", padding: "1rem 0" }}>
        Nenhuma edição cadastrada.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem", width: "100%", overflow: "visible" }}>
      {edicoes.map((edicao) => (
        <div
          key={edicao.id}
          style={{
            border: "1.5px solid #6425d8",
            borderRadius: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.7rem 1rem",
            background: "white",
            boxSizing: "border-box",
            overflow: "visible",
          }}
        >
          {/* Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span
                style={{
                  fontFamily: "'Glacial Indifference', sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 500,
                  color: "#6425d8",
                }}
              >
                {edicao.name}
              </span>

              {canManage && (
                <>
                  <button
                    onClick={() => {
                      router.visit(`/${edicao.id}/edit`);
                    }}
                    style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}
                  >
                    <img src="/images/editar.png" alt="Editar" style={{ height: "1rem", width: "auto" }} />
                  </button>
                  <div style={{ position: "relative", overflow: "visible" }}>
                    <button
                      onClick={() => setConfirmDeleteId(edicao.id)}
                      style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}
                    >
                      <img src="/images/excluir.png" alt="Excluir" style={{ height: "1rem", width: "auto" }} />
                    </button>
                    {confirmDeleteId === edicao.id && (
                      <ConfirmPopup
                        mensagem="Excluir esta edição?"
                        style={{ left: 0, right: "auto" }}
                        onConfirm={() => {
                          setConfirmDeleteId(null);
                          router.delete(`/${edicao.id}`);
                        }}
                        onCancel={() => setConfirmDeleteId(null)}
                      />
                    )}
                  </div>
                </>
              )}
            </div>

            <span
              style={{
                fontFamily: "'Glacial Indifference', sans-serif",
                fontSize: "0.9rem",
                color: "black",
              }}
            >
              {edicao.dt_inicio} - {edicao.dt_termino}
            </span>
          </div>

          {/* Botão VER */}
          <button
            onClick={() => {
              setSelectedId(edicao.id);
              router.visit(`/${edicao.id}/detalhes`);
            }}
            style={{
              background: selectedId === edicao.id ? "#6425d8" : "#ddd3f3",
              color: selectedId === edicao.id ? "#ddd3f3" : "#6425d8",
              border: "none",
              borderRadius: "50px",
              padding: "0rem 2rem",
              fontFamily: "'Glacial Indifference', sans-serif",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            VER
          </button>
        </div>
      ))}
    </div>
  );
}
