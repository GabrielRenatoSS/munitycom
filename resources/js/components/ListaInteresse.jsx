import React, { useState } from "react";
import { router } from "@inertiajs/react";

const TEXT = {
  fontFamily: "'Glacial Indifference', sans-serif",
};

export default function ListaInteresse({ interests = [], isOwnProfile = false }) {
  const [page, setPage] = useState(0);
  const [editando, setEditando] = useState(false);
  const [lista, setLista] = useState(interests);
  const perPage = 6;
  const pages = Math.ceil(lista.length / perPage);
  const visible = lista.slice(page * perPage, page * perPage + perPage);

  function getToken() {
    return decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? "");
  }

  async function remover(mun) {
    try {
      await fetch("/interests/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "X-XSRF-TOKEN": getToken() },
        body: JSON.stringify({ mun_id: mun.id }),
      });
      setLista(l => l.filter(m => m.id !== mun.id));
    } catch {}
  }

  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        border: "2px solid #8c52ff",
        borderRadius: "13px",
        padding: "0.8rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
        overflow: "hidden",
      }}
    >
      {/* Cabeçalho */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Título + lápis */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span
            style={{
              ...TEXT,
              fontSize: "clamp(0.8rem, 3.5vw, 1.3rem)",
              fontWeight: 700,
              color: "#6425d8",
            }}
          >
            Lista de Interesse
          </span>
          {isOwnProfile && (
            <button
              onClick={() => setEditando(e => !e)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              title="Editar lista de interesse"
            >
              <img src="/images/editar.png" alt="editar" style={{ width: "clamp(14px, 4vw, 16px)", height: "clamp(14px, 4vw, 16px)", objectFit: "contain" }} />
            </button>
          )}
        </div>

        {/* Botões de navegação */}
        {pages > 1 && (
          <div style={{ display: "flex", gap: "0.3rem" }}>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, opacity: page === 0 ? 0.3 : 1 }}
            >
              <img src="/images/esquerda.png" alt="anterior" style={{ width: 22, height: 22, objectFit: "contain" }} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
              disabled={page === pages - 1}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, opacity: page === pages - 1 ? 0.3 : 1 }}
            >
              <img src="/images/direita.png" alt="próximo" style={{ width: 22, height: 22, objectFit: "contain" }} />
            </button>
          </div>
        )}
      </div>

      {/* Grade de MUNs */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0",
          flex: 1,
          overflow: "hidden",
          alignContent: "flex-start",
        }}
      >
        {visible.length === 0 ? (
          <span style={{ ...TEXT, fontSize: "0.7rem", color: "#999" }}>
            Nenhuma MUN na lista de interesse.
          </span>
        ) : (
          visible.map((mun) => (
            <div
              key={mun.id}
              style={{ position: "relative", width: "clamp(60px, 16.66%, 120px)", height: "clamp(60px, 16.66%, 120px)", flexShrink: 0 }}
            >
              <img
                src={mun.foto || "/storage/fotos_usuarios/foto.jpg"}
                alt={mun.name}
                onClick={() => !editando && router.get(`/profile/${mun.username}`)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                  display: "block",
                  cursor: editando ? "default" : "pointer",
                  filter: editando ? "blur(2px) brightness(0.7)" : "none",
                  transition: "filter 0.2s",
                }}
              />
              {editando && (
                <button
                  onClick={() => remover(mun)}
                  style={{
                    position: "absolute", inset: 0, background: "none", border: "none",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <img src="/images/excluir.png" alt="remover" style={{ width: "40%", height: "40%", objectFit: "contain" }} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
