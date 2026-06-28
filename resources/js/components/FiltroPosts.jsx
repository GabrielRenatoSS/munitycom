import React from "react";
import { router, usePage } from "@inertiajs/react";
import { PostCard } from "../Pages/Publication/Show";
import ConfirmPopup from "@/components/ConfirmPopup";

const TEXT = {
  fontFamily: "'Glacial Indifference', sans-serif",
};

//aqui

export default function FiltroPosts({ username, showFilters = true }) {
  const { posts, awards, spotteds, filters, user } = usePage().props;

  const ABAS = [
    { label: "Feed",         type: null },
    { label: "Inscrições",   type: 0    },
    { label: "Presenças",    type: 1    },
    { label: "Delegações",   type: 2    },
    { label: "Memórias",     type: 3    },
    { label: "Spotteds",     type: 7    },
    { label: "Prêmios",      type: 6    },
    ...(user?.progresso >= 7 ? [{ label: "Vídeos Curtos", type: 8 }] : []),
  ];
  console.log("posts", posts, "filters", filters);

  const activeType = filters?.type !== undefined ? Number(filters.type) : null;

  function navigate(type) {
    const params = type !== null ? { type } : {};
    router.get(`/profile/${username}`, params, { preserveScroll: false });
  }

  const postItems = posts?.data ?? [];
  const awardItems   = activeType === 6 ? (awards?.data   ?? []) : [];
  const spottedItems = activeType === 7 ? (spotteds?.data ?? []) : [];
  const allItems = [...postItems, ...awardItems, ...spottedItems];

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>

      {/* Abas */}
      {showFilters && (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.3rem",
          flexWrap: "wrap",
          padding: "0.5rem 0",
          rowGap: "0",
        }}
      >
        {ABAS.map((aba, i) => {
          const isActive = aba.type === activeType;
          return (
            <React.Fragment key={i}>
              <button
                onClick={() => navigate(aba.type)}
                style={{
                  ...TEXT,
                  fontSize: "clamp(0.8rem, 2vw, 1rem)",
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? "#6425d8" : "#000",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0 0.2rem",
                }}
              >
                {aba.label}
              </button>
              {i < ABAS.length - 1 && (
                <span style={{ ...TEXT, fontSize: "1rem", color: "#000" }}>|</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
      )}

      {/* Lista */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {allItems.length === 0 ? (
          <p style={{ ...TEXT, textAlign: "center", color: "#999", fontSize: "0.95rem" }}>
            Nenhuma publicação nesta categoria.
          </p>
        ) : (
          allItems.map((item) =>
            item.card_type === 'spotted' ? (
              <SpottedCard key={`spotted-${item.id}`} spotted={item} />
            ) : item.tipo === 6 ? (
              <AwardCard key={`award-${item.id}`} award={item} />
            ) : (
              <PostCard key={`post-${item.id}`} post={item} />
            )
          )
        )}
      </div>

    </div>
  );
}

function SpottedCard({ spotted }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "2px solid #8c52ff",
        borderRadius: "13px",
        padding: "0.8rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
        <img
          src={spotted.remetente_foto || `${import.meta.env.VITE_STORAGE_URL}/fotos_usuarios/foto.jpg`}
          alt="foto"
          style={{ width: "clamp(20px, 7vw, 36px)", height: "clamp(20px, 7vw, 36px)", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
        />
        <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: "clamp(0.72rem, 2.5vw, 0.95rem)", color: "#000", margin: 0 }}>
          <span>@{spotted.remetente_username} mandou para </span>
          <span style={{ color: "#8c52ff" }}>{spotted.destinatario}</span>
          <span> (@{spotted.destinatario_username}):</span>
          <br />
          <span>"{spotted.mensagem}"</span>
        </p>
      </div>
    </div>
  );
}

function AwardCard({ award }) {
  const [confirmando, setConfirmando] = React.useState(false);

  return (
    <div
      style={{
        background: "#fff",
        border: "2px solid #8c52ff",
        borderRadius: "13px",
        padding: "0.8rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
        <img
          src={award.user_foto || `${import.meta.env.VITE_STORAGE_URL}/fotos_usuarios/foto.jpg`}
          alt="foto"
          style={{ width: "clamp(20px, 7vw, 36px)", height: "clamp(20px, 7vw, 36px)", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
        />
        <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: "clamp(0.72rem, 2.5vw, 0.95rem)", color: "#000" }}>
          <span>{award.user_username} </span>
          <span>é </span>
          <span style={{ color: "#8c52ff" }}>{award.name}</span>
          <span> do </span>
          <span style={{ color: "#8c52ff" }}>{award.comite}</span>
          <span> como </span>
          <span style={{ color: "#8c52ff" }}>{award.delegation}</span>
          <span> na </span>
          <span style={{ color: "#8c52ff" }}>{award.mun}</span>
        </p>
      </div>

      {award.can_edit && (
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => router.visit(`/awards/${award.id}/edit`)}
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
                mensagem="Tem certeza que quer excluir este prêmio?"
                onConfirm={() => router.delete(`/awards/${award.id}`)}
                onCancel={() => setConfirmando(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
