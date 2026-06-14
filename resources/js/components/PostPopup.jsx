import React, { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import axios from "axios";
import ConfirmPopup from "@/components/ConfirmPopup";
import { PostCard } from "@/Pages/Publication/Show";

const FONT   = "'Glacial Indifference', sans-serif";
const PURPLE = "#8c52ff";

// ─── Linha de comentário ──────────────────────────────────────────────────────

function ComentarioCard({ comentario, postId, onDeleted }) {
  const [editing,    setEditing]    = useState(false);
  const [texto,      setTexto]      = useState(comentario.texto);
  const [confirmDel, setConfirmDel] = useState(false);

  function salvar() {
    if (!texto.trim()) return;
    axios.put(`/comentarios/${comentario.id}`, { texto }).then(() => {
      setEditing(false);
    }).catch(() => {
      setTexto(comentario.texto); // reverte se falhar
      setEditing(false);
    });
  }

  function excluir() {
    axios.delete(`/comentarios/${comentario.id}`).then(() => {
      setConfirmDel(false);
      onDeleted(comentario.id);
    });
  }

  return (
    <div style={{
      display: "flex",
      gap: "0.6rem",
      alignItems: "flex-start",
      padding: "0.5rem 0",
      borderBottom: "1px solid #ede8fb",
    }}>
      <img
        src={comentario.user_foto}
        alt={comentario.username}
        onClick={() => router.visit(`/profile/${comentario.username}`)}
        style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0, cursor: "pointer" }}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.15rem" }}>
        <span style={{ fontFamily: FONT, fontSize: "0.8rem", fontWeight: 700, color: PURPLE }}>
          @{comentario.username}
        </span>
        {editing ? (
          <textarea
            value={texto}
            onChange={e => setTexto(e.target.value)}
            rows={2}
            style={{
              fontFamily: FONT,
              fontSize: "0.88rem",
              color: "#222",
              border: "1px solid #c3a3ff",
              borderRadius: "8px",
              padding: "0.3rem 0.5rem",
              resize: "vertical",
              outline: "none",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
        ) : (
          <span style={{ fontFamily: FONT, fontSize: "0.88rem", color: "#222", whiteSpace: "pre-wrap" }}>
            {texto}
          </span>
        )}
        <span style={{ fontFamily: FONT, fontSize: "0.72rem", color: "#999" }}>
          {comentario.created_at}
        </span>
      </div>

      {(comentario.can_edit || comentario.can_delete) && (
        <div style={{ display: "flex", gap: "0.3rem", flexShrink: 0, alignItems: "center" }}>
          {comentario.can_edit && (
            editing ? (
              <button
                onClick={salvar}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                <img src="/images/editar.png" alt="Salvar" style={{ height: 16, width: "auto", opacity: 0.6 }} />
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                <img src="/images/editar.png" alt="Editar" style={{ height: 16, width: "auto" }} />
              </button>
            )
          )}
          {comentario.can_delete && (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setConfirmDel(c => !c)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                <img src="/images/excluir.png" alt="Excluir" style={{ height: 16, width: "auto" }} />
              </button>
              {confirmDel && (
                <ConfirmPopup
                  mensagem="Tem certeza que quer excluir o comentário?"
                  onConfirm={excluir}
                  onCancel={() => setConfirmDel(false)}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Formulário de novo comentário ────────────────────────────────────────────

function NovoComentario({ postId, onAdded }) {
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  function enviar() {
    if (!texto.trim() || enviando) return;
    setEnviando(true);
    axios.post(`/comentarios`, { texto, publication_id: postId })
      .then(res => {
        onAdded(res.data);
        setTexto("");
      })
      .finally(() => setEnviando(false));
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  }

  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", paddingTop: "0.5rem" }}>
      <button
        onClick={enviar}
        disabled={enviando}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, opacity: enviando ? 0.4 : 1, flexShrink: 0 }}
      >
        <img src="/images/adicionar-menu.png" alt="Enviar" style={{ width: 32, height: 32, opacity: 0.6 }} />
      </button>
      <input
        value={texto}
        onChange={e => setTexto(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Escreva um comentário..."
        style={{
          flex: 1,
          background: "#c3a5ff",
          border: "none",
          borderRadius: "50px",
          padding: "0.35rem 0.9rem",
          fontFamily: FONT,
          fontSize: "0.88rem",
          color: PURPLE,
          outline: "none",
        }}
      />
    </div>
  );
}

// ─── Popup principal ──────────────────────────────────────────────────────────

export default function PostPopup({ postId, onClose }) {
  const overlayRef = useRef(null);
  const [post,         setPost]         = useState(null);
  const [comentarios,  setComentarios]  = useState([]);
  const [carregando,   setCarregando]   = useState(true);

  // Carrega dados via JSON
  useEffect(() => {
    setCarregando(true);
    axios.get(`/publications/${postId}`, { headers: { Accept: "application/json" } })
      .then(res => {
        setPost(res.data.post);
        setComentarios(res.data.comentarios);
      })
      .finally(() => setCarregando(false));
  }, [postId]);

  // ESC fecha
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function handleOverlay(e) {
    if (e.target === overlayRef.current) onClose();
  }

  function onComentarioAdded(novo) {
    setComentarios(prev => [novo, ...prev]);
    setPost(p => ({ ...p, comentarios_count: (p.comentarios_count ?? 0) + 1 }));
  }

  function onComentarioDeleted(id) {
    setComentarios(prev => prev.filter(c => c.id !== id));
    setPost(p => ({ ...p, comentarios_count: Math.max(0, (p.comentarios_count ?? 1) - 1) }));
  }

  return (
    <>
      <style>{`
        .post-popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(80, 40, 140, 0.18);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 300;
          padding: 1rem;
          animation: ppFadeIn 0.18s ease;
        }
        @keyframes ppFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .post-popup-box {
          background: #fff;
          border: none;
          border-radius: 18px;
          width: 100%;
          max-width: 680px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 8px 40px rgba(120, 60, 220, 0.15);
          animation: ppSlideUp 0.2s ease;
        }
        @keyframes ppSlideUp {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .post-popup-scroll {
          overflow-y: auto;
          padding: 1rem 1.1rem 1.2rem;
          flex: 1;
          scrollbar-width: thin;
          scrollbar-color: #c3a3ff transparent;
        }
        .post-popup-scroll::-webkit-scrollbar { width: 4px; }
        .post-popup-scroll::-webkit-scrollbar-track { background: transparent; }
        .post-popup-scroll::-webkit-scrollbar-thumb { background: #c3a3ff; border-radius: 99px; }
        .post-popup-scroll::-webkit-scrollbar-thumb:hover { background: ${PURPLE}; }

        @media (max-width: 600px) {
          .post-popup-overlay { padding: 0; align-items: flex-end; }
          .post-popup-box { border-radius: 18px 18px 0 0; max-height: 95vh; }
        }
      `}</style>

      <div className="post-popup-overlay" ref={overlayRef} onClick={handleOverlay}>
        <div className="post-popup-box" role="dialog" aria-modal="true">

          {/* Botão fechar */}
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "0.6rem 0.8rem 0" }}>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
              aria-label="Fechar"
            >
              <img src="/images/logout-menu.png" alt="Fechar" style={{ width: 26, height: 26, objectFit: "contain" }} />
            </button>
          </div>

          <div className="post-popup-scroll">
            {carregando ? (
              <div style={{ textAlign: "center", padding: "2rem", fontFamily: FONT, color: "#aaa" }}>
                Carregando...
              </div>
            ) : post ? (
              <>
                {/* Card do post reutilizado */}
                <PostCard post={post} noBorder />

                {/* Separador */}
                <div style={{ borderTop: `1.5px solid #ede8fb`, margin: "0.9rem 0 0.5rem" }} />

                {/* Comentários */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {comentarios.length === 0 ? (
                    <p style={{ fontFamily: FONT, fontSize: "0.85rem", color: "#bbb", textAlign: "center", padding: "0.5rem 0" }}>
                      Nenhum comentário ainda.
                    </p>
                  ) : (
                    comentarios.map(c => (
                      <ComentarioCard
                        key={c.id}
                        comentario={c}
                        postId={post.id}
                        onDeleted={onComentarioDeleted}
                      />
                    ))
                  )}
                </div>

                {/* Formulário — só se pode comentar */}
                {post.can_comment && (
                  <NovoComentario postId={post.id} onAdded={onComentarioAdded} />
                )}
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "2rem", fontFamily: FONT, color: "#aaa" }}>
                Publicação não encontrada.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
