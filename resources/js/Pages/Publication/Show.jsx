import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import axios from 'axios';
import ConfirmPopup from "@/components/ConfirmPopup";

const TEXT = { fontFamily: "'Glacial Indifference', sans-serif", fontSize: "clamp(0.72rem, 2.5vw, 0.95rem)", color: "#000" };
const PURPLE = { color: "#8c52ff" };
const CARD = {
  background: "#fff",
  border: "2px solid #8c52ff",
  borderRadius: "13px",
  padding: "0.8rem 1rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

function Avatar({ src, username }) {
  return (
    <img
      src={src || `${import.meta.env.VITE_STORAGE_URL}/fotos_usuarios/foto.jpg`}
      alt="foto"
      onClick={() => username && router.visit(`/profile/${username}`)}
      style={{ width: "clamp(20px, 7vw, 36px)", height: "clamp(20px, 7vw, 36px)", borderRadius: "50%", objectFit: "cover", flexShrink: 0, alignSelf: "flex-start", cursor: "pointer" }}
    />
  );
}

function TextoInscricao({ post }) {
  return (
    <p style={TEXT}>
      {post.name}{" "}
      <span>está inscrito(a) para a </span>
      <span style={PURPLE}>{post.mun}</span>
      {post.delegation && <><span> como </span><span style={PURPLE}>{post.delegation}</span></>}
      {post.comite && <><span> no(a) </span><span style={PURPLE}>{post.comite}</span></>}
    </p>
  );
}

function TextoDelegacao({ post }) {
  return (
    <p style={TEXT}>
      {post.name}{" "}
      <span>é </span>
      <span style={PURPLE}>{post.delegation}</span>
      {post.comite && <><span> no(a) </span><span style={PURPLE}>{post.comite}</span></>}
      <span> na </span>
      <span style={PURPLE}>{post.mun}</span>
    </p>
  );
}

function TextoPresenca({ post }) {
  return (
    <p style={TEXT}>
      {post.name}{" "}
      <span>delegou na </span>
      <span style={PURPLE}>{post.mun}</span>
      {post.descricao && <span> ({post.descricao})</span>}
    </p>
  );
}

// Galeria sem botões próprios — recebe page/setPage de fora (para tipo 4)
function GaleriaInterna({ images, perPage, page, setPage }) {
  const total = images.length;
  const pages = Math.ceil(total / perPage);
  const visible = images.slice(page * perPage, page * perPage + perPage);

  return (
    <div style={{ display: "flex", gap: "0rem" }}>
      {visible.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          style={{
            flex: 1,
            aspectRatio: "3/4",
            objectFit: "cover",
            borderRadius: 0,
            minWidth: 0,
          }}
        />
      ))}
    </div>
  );
}

// Galeria standalone para tipo 3 (memória) — botões embaixo, proporção 4/3
function GaleriaMemoria({ images, perPage }) {
  const [page, setPage] = useState(0);
  const total = images.length;
  const pages = Math.ceil(total / perPage);
  const visible = images.slice(page * perPage, page * perPage + perPage);

  return (
    <div className="flex flex-col gap-2">
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {visible.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            style={{ flex: 1, aspectRatio: "4/3", objectFit: "cover", borderRadius: 0, minWidth: 0 }}
          />
        ))}
      </div>
      {pages > 1 && (
        <div className="flex justify-center gap-3 items-center">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{ background: "none", border: "none", cursor: "pointer", opacity: page === 0 ? 0.3 : 1, padding: 0 }}
          >
            <img src="/images/esquerda.png" alt="anterior" style={{ width: "clamp(14px, 4vw, 20px)", height: "clamp(14px, 4vw, 20px)", objectFit: "contain" }} />
          </button>
          <span style={{ ...TEXT, fontSize: "0.85rem" }}>{page + 1}/{pages}</span>
          <button
            onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
            disabled={page === pages - 1}
            style={{ background: "none", border: "none", cursor: "pointer", opacity: page === pages - 1 ? 0.3 : 1, padding: 0 }}
          >
            <img src="/images/direita.png" alt="próximo" style={{ width: "clamp(14px, 4vw, 20px)", height: "clamp(14px, 4vw, 20px)", objectFit: "contain" }} />
          </button>
        </div>
      )}
    </div>
  );
}

function BarraInferior({ post, textIndent, onDesfavoritado }) {
  const [liked, setLiked] = useState(!!post.is_liked);
  const [count, setCount] = useState(post.likes_count ?? 0);
  const [confirmando, setConfirmando] = useState(false);
  const [fixo, setFixo] = useState(!!post.fixo);
  const [favoritado, setFavoritado] = useState(!!post.is_favoritado);

  function toggleFavorito() {
    const novo = !favoritado;
    setFavoritado(novo);
    axios.patch(`/publications/${post.id}/favorito`)
      .then(() => {
        if (!novo && onDesfavoritado) onDesfavoritado();
      })
      .catch(() => setFavoritado(!novo));
  }

  function toggleFixo() {
    const novo = !fixo;
    setFixo(novo);
    axios.patch(`/publications/${post.id}/fixo`).catch(() => setFixo(!novo));
  }

  function toggleLike() {
    const newLiked = !liked;
    setLiked(newLiked);
    setCount((c) => newLiked ? c + 1 : c - 1);
    axios.post(`/posts/${post.id}/like`).catch(() => {
      setLiked(!newLiked);
      setCount((c) => newLiked ? c - 1 : c + 1);
    });
  }

  function excluir() {
    if (confirm("Excluir publicação?")) {
      router.delete(`/publications/${post.id}`);
    }
  }

  return (
    <div className="flex items-center gap-3" style={{ paddingLeft: textIndent }} onClick={e => e.stopPropagation()}>
      <button
        onClick={toggleLike}
        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem", padding: 0 }}
      >
        <img
          src={liked ? "/images/curtido.png" : "/images/curtir.png"}
          alt="like"
          style={{ width: "clamp(14px, 4vw, 18px)", height: "clamp(14px, 4vw, 18px)", objectFit: "contain" }}
        />
        <span style={{ ...TEXT, fontSize: "clamp(0.65rem, 2.5vw, 0.85rem)" }}>{count}</span>
      </button>

      <button
        style={{ background: "none", border: "none", cursor: post.can_comment ? "pointer" : "default", display: "flex", alignItems: "center", gap: "0.25rem", padding: 0 }}
      >
        <img
          src={post.can_comment ? "/images/comentar.png" : "/images/comentarios.png"}
          alt="comentarios"
          style={{ width: "clamp(14px, 4vw, 18px)", height: "clamp(14px, 4vw, 18px)", objectFit: "contain" }}
        />
        <span style={{ ...TEXT, fontSize: "clamp(0.65rem, 2.5vw, 0.85rem)" }}>{post.comentarios_count ?? 0}</span>
      </button>

      {post.can_fav && (
        <button
          onClick={toggleFavorito}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}
        >
          <img
            src={favoritado ? "/images/favoritado.png" : "/images/favoritar.png"}
            alt={favoritado ? "Desfavoritar" : "Favoritar"}
            style={{ width: "clamp(14px, 4vw, 18px)", height: "clamp(14px, 4vw, 18px)", objectFit: "contain" }}
          />
        </button>
      )}

      <span style={{ ...TEXT, fontSize: "clamp(0.65rem, 2.5vw, 0.85rem)", color: "#555" }}>
        {post.created_at || ""}
      </span>

      <div className="flex gap-2 ml-auto" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        {post.can_fix && (
          <button
            onClick={toggleFixo}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <img src={fixo ? "/images/fixado.png" : "/images/fixar.png"} alt={fixo ? "Desfixar" : "Fixar"} style={{ width: "clamp(14px, 4vw, 18px)", height: "clamp(14px, 4vw, 18px)", objectFit: "contain" }} />
          </button>
        )}
        {post.can_edit && (
          <>
                <button
                  onClick={() => router.visit(`/publications/${post.id}/edit`)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <img src="/images/editar.png" alt="Editar" style={{ width: "clamp(14px, 4vw, 18px)", height: "clamp(14px, 4vw, 18px)", objectFit: "contain" }} />
                </button>
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setConfirmando(c => !c)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    <img src="/images/excluir.png" alt="Excluir" style={{ width: "clamp(14px, 4vw, 18px)", height: "clamp(14px, 4vw, 18px)", objectFit: "contain" }} />
                  </button>
                  {confirmando && (
                    <ConfirmPopup
                      mensagem="Tem certeza que quer excluir seu post?"
                      onConfirm={() => router.delete(`/publications/${post.id}`)}
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

function PostCard({ post, onClick, noBorder, onDesfavoritado }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const perPage = isMobile ? 1 : 2;
  const textIndent = "44px";

  // Estado de paginação para tipo 4 (controlado aqui para botões no cabeçalho)
  const hasImages = post.images && post.images.length > 0;
  const pages4 = hasImages ? Math.ceil(post.images.length / perPage) : 0;
  const [page4, setPage4] = useState(0);

  return (
    <div style={{ ...CARD, border: noBorder ? "none" : "2px solid #8c52ff", cursor: onClick ? "pointer" : "default" }} onClick={onClick ? (e) => { if (e.defaultPrevented) return; onClick(); } : undefined}>
      {/* Cabeçalho */}
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
        <Avatar src={post.user_foto} username={post.username} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Texto do cabeçalho */}
          <div style={{ flex: 1 }}>
            {(post.type === 3 || post.type === 4 || post.type === 5) ? (
              <div className="flex items-center gap-1 flex-wrap">
                <span style={{ ...TEXT }}>@{post.username}</span>
                {post.mun && (
                  <>
                    <img src="/images/local.png" alt="local" style={{ height: 14, objectFit: "contain" }} />
                    <span style={{ ...TEXT, ...PURPLE }}>{post.mun}</span>
                  </>
                )}
              </div>
            ) : (
              <>
                {post.type === 0 && <TextoInscricao post={post} />}
                {post.type === 1 && <TextoDelegacao post={post} />}
                {post.type === 2 && <TextoPresenca post={post} />}
              </>
            )}
          </div>

          {/* Botões de navegação no cabeçalho — só tipo 4 com múltiplas páginas */}
          {post.type === 4 && pages4 > 1 && (
            <div className="flex items-center gap-1" style={{ flexShrink: 0, marginLeft: "0.5rem" }}>
              <button
                onClick={() => setPage4((p) => Math.max(0, p - 1))}
                disabled={page4 === 0}
                style={{ background: "none", border: "none", cursor: "pointer", opacity: page4 === 0 ? 0.3 : 1, padding: 0 }}
              >
                <img src="/images/esquerda.png" alt="anterior" style={{ width: 20, height: 20, objectFit: "contain" }} />
              </button>
              <button
                onClick={() => setPage4((p) => Math.min(pages4 - 1, p + 1))}
                disabled={page4 === pages4 - 1}
                style={{ background: "none", border: "none", cursor: "pointer", opacity: page4 === pages4 - 1 ? 0.3 : 1, padding: 0 }}
              >
                <img src="/images/direita.png" alt="próximo" style={{ width: 20, height: 20, objectFit: "contain" }} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Imagens tipo 3 — memória, proporção 4/3, botões embaixo */}
      {post.type === 3 && hasImages && (
        <GaleriaMemoria images={post.images} perPage={perPage} />
      )}

      {/* Imagens tipo 4 — post, proporção 3/4, botões no cabeçalho */}
      {post.type === 4 && hasImages && (
        <GaleriaInterna images={post.images} perPage={perPage} page={page4} setPage={setPage4} />
      )}


      {/* Vídeo tipo 5 — vídeo curto, proporção 9:16 */}
      {post.type === 5 && post.video && (
        <video
          src={post.video}
          controls
          playsInline
          style={{
            width: "100%",
            maxHeight: "70vh",
            aspectRatio: "9/16",
            objectFit: "cover",
            borderRadius: 0,
            display: "block",
          }}
        />
      )}

      {/* Descrição */}
      {(post.type === 3 || post.type === 4 || post.type === 5) && post.descricao && (
        <p style={TEXT}>{post.descricao}</p>
      )}

      {/* Barra inferior */}
      <BarraInferior post={post} textIndent={textIndent} onDesfavoritado={onDesfavoritado} />
    </div>
  );
}

export default function Show() {
  const { post } = usePage().props;
  return (
    <div className="min-h-screen w-full flex justify-center items-start" style={{ background: "#ddd6fe", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: 700, width: "100%" }}>
        <PostCard post={post} />
      </div>
    </div>
  );
}

export { PostCard };
