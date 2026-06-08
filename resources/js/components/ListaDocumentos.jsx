import React, { useState, useCallback } from "react";
import { usePage, router } from "@inertiajs/react";
import Documento from "./Documento";
import ConfirmPopup from "./ConfirmPopup";

const FONT       = "'Glacial Indifference', sans-serif";
const LILAC_DARK = "#8c52ff";
const TEXT       = { fontFamily: FONT, fontSize: "clamp(0.72rem, 2.5vw, 0.95rem)", color: "#000" };
const CARD       = { background: "#fff", border: `2px solid ${LILAC_DARK}`, borderRadius: "13px", padding: "0.8rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem" };

const TIPO_LABEL = {
  0: "Position Paper",
  1: "Documento de Trabalho",
  2: "Documento de Crise",
  3: "Resolução Final",
  4: "Acordo Multilateral",
  5: "Agenda",
  6: "Carta à Imprensa",
  7: "Notícia",
};

/* ── Galeria para notícia (tipo 7) — proporção 3/4, botões no cabeçalho ── */
function GaleriaNoticia({ images, perPage, page, setPage }) {
  const visible = images.slice(page * perPage, page * perPage + perPage);
  return (
    <div style={{ display: "flex", gap: "0rem" }}>
      {visible.map((src, i) => (
        <img key={i} src={src} alt="" style={{ flex: 1, aspectRatio: "3/4", objectFit: "cover", borderRadius: 0, minWidth: 0 }} />
      ))}
    </div>
  );
}

/* ── Card de Notícia (tipo 7) — replica PostCard tipo 4 com botões próprios ── */
function NoticiaCard({ doc }) {
  const isMobile   = typeof window !== "undefined" && window.innerWidth < 768;
  const perPage    = isMobile ? 1 : 2;
  const images     = [doc.foto1, doc.foto2, doc.foto3, doc.foto4].filter(Boolean);
  const hasImages  = images.length > 0;
  const pages      = hasImages ? Math.ceil(images.length / perPage) : 0;
  const [page, setPage]           = useState(0);
  const [confirmando, setConfirmando] = useState(false);

  return (
    <div style={CARD}>
      {/* Cabeçalho */}
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
        <img
          src={doc.autor_foto || "/storage/fotos_usuarios/foto.jpg"}
          alt="foto"
          onClick={() => doc.autor_username && router.visit(`/profile/${doc.autor_username}`)}
          style={{ width: "clamp(20px, 7vw, 36px)", height: "clamp(20px, 7vw, 36px)", borderRadius: "50%", objectFit: "cover", flexShrink: 0, cursor: "pointer" }}
        />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={TEXT}>@{doc.autor_username}</span>
          {/* Setas de navegação */}
          {pages > 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", flexShrink: 0, marginLeft: "0.5rem" }}>
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                style={{ background: "none", border: "none", cursor: "pointer", opacity: page === 0 ? 0.3 : 1, padding: 0 }}>
                <img src="/images/esquerda.png" alt="anterior" style={{ width: 20, height: 20, objectFit: "contain" }} />
              </button>
              <button onClick={() => setPage(p => Math.min(pages - 1, p + 1))} disabled={page === pages - 1}
                style={{ background: "none", border: "none", cursor: "pointer", opacity: page === pages - 1 ? 0.3 : 1, padding: 0 }}>
                <img src="/images/direita.png" alt="próximo" style={{ width: 20, height: 20, objectFit: "contain" }} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Galeria */}
      {hasImages && <GaleriaNoticia images={images} perPage={perPage} page={page} setPage={setPage} />}

      {/* Descrição */}
      {doc.conteudo && <p style={TEXT}>{doc.conteudo}</p>}

      {/* Barra inferior */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingLeft: "44px" }}>
        {/* espaço reservado para like futuro */}
        <span style={{ flex: 1 }} />
        {doc.is_own_document && (
          <>
            <button onClick={() => router.visit(`/documentos/${doc.id}/edit`)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <img src="/images/editar.png" alt="Editar" style={{ width: "clamp(14px, 4vw, 18px)", height: "clamp(14px, 4vw, 18px)", objectFit: "contain" }} />
            </button>
            <div style={{ position: "relative" }}>
              <button onClick={() => setConfirmando(c => !c)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                <img src="/images/excluir.png" alt="Excluir" style={{ width: "clamp(14px, 4vw, 18px)", height: "clamp(14px, 4vw, 18px)", objectFit: "contain" }} />
              </button>
              {confirmando && (
                <ConfirmPopup
                  mensagem="Excluir notícia?"
                  onConfirm={() => { setConfirmando(false); router.delete(`/documentos/${doc.id}`); }}
                  onCancel={() => setConfirmando(false)}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Card individual ── */
function DocumentoCard({ doc, onOpenDoc }) {
  const handleClick = () => {
    onOpenDoc(doc.id);
  };

  if (doc.tipo === 7) {
    return <NoticiaCard doc={doc} />;
  }

  return (
    <div
      onClick={handleClick}
      style={{
        background: "#fff",
        border: `2px solid ${LILAC_DARK}`,
        borderRadius: "13px",
        padding: "0.8rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
        cursor: "pointer",
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(140,82,255,0.18)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
    >
      {/* Linha do autor */}
      {doc.autor_delegacao && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <img
            src={doc.autor_foto || "/storage/fotos_usuarios/foto.jpg"}
            alt="foto"
            style={{
              width: "clamp(20px, 7vw, 36px)",
              height: "clamp(20px, 7vw, 36px)",
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
          <p style={{ fontFamily: FONT, fontSize: "clamp(0.72rem, 2.5vw, 0.95rem)", color: "#000", margin: 0 }}>
            <span style={{ color: LILAC_DARK, fontWeight: 700 }}>{doc.autor_delegacao}</span>
            {doc.autor_username && (
              <span style={{ color: "#000" }}> (@{doc.autor_username})</span>
            )}
          </p>
        </div>
      )}

      {/* Ícone + tipo */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem", padding: "0.4rem 0" }}>
        <img
          src="/images/docs.png"
          alt="documento"
          style={{ width: "clamp(2rem, 8vw, 3rem)", height: "auto", objectFit: "contain" }}
        />
        <span style={{ fontFamily: FONT, fontSize: "clamp(0.8rem, 2.5vw, 1rem)", color: "#000", textAlign: "center" }}>
          {TIPO_LABEL[doc.tipo] ?? "Documento"}
        </span>
      </div>
    </div>
  );
}

/* ── Lista principal ── */
export default function ListaDocumentos({ mobile = false }) {
  const { documents } = usePage().props;
  const items = documents?.data ?? [];

  // Estado do popup
  const [popup, setPopup] = useState(null);   // { documento, can_edit, docId }
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const openDoc = useCallback(async (docId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/documentos/${docId}/json`, {
        credentials: "same-origin",
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data = await res.json();
      // backend retorna { documento: {...}, can_edit: bool }
      setPopup({ documento: data.documento, can_edit: data.can_edit, docId });
    } catch (err) {
      setError("Não foi possível carregar o documento.");
    } finally {
      setLoading(false);
    }
  }, []);

  const closePopup = useCallback(() => setPopup(null), []);

  const handleEdit = useCallback(() => {
    if (!popup) return;
    closePopup();
    router.visit(`/documentos/${popup.docId}/edit`);
  }, [popup, closePopup]);

  const handleDelete = useCallback(() => {
    if (!popup) return;
    if (!window.confirm("Tem certeza que deseja excluir este documento?")) return;
    closePopup();
    router.delete(`/documentos/${popup.docId}`);
  }, [popup, closePopup]);

  if (items.length === 0) {
    return (
      <p style={{ fontFamily: FONT, textAlign: "center", color: "#999", fontSize: "0.9rem", padding: "1rem 0" }}>
        Nenhum documento neste comitê.
      </p>
    );
  }

  return (
    <>
      {/* Feedback de loading / erro */}
      {loading && (
        <p style={{ fontFamily: FONT, textAlign: "center", color: LILAC_DARK, fontSize: "0.9rem", padding: "0.5rem 0" }}>
          Carregando…
        </p>
      )}
      {error && (
        <p style={{ fontFamily: FONT, textAlign: "center", color: "#e05", fontSize: "0.9rem", padding: "0.5rem 0" }}>
          {error}
        </p>
      )}

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: mobile ? "0.4rem" : "0.75rem", width: "100%" }}>
        {items.map((doc) => (
          <DocumentoCard key={doc.id} doc={doc} onOpenDoc={openDoc} />
        ))}
      </div>

      {/* Popup */}
      {popup && (
        <Documento
          documento={popup.documento}
          documentoId={popup.docId}
          can_edit={popup.can_edit}
          onClose={closePopup}
          onDelete={handleDelete}
          onSaved={() => openDoc(popup.docId)}
        />
      )}
    </>
  );
}
