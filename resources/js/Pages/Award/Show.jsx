import React, { useState } from "react";
import { router } from "@inertiajs/react";
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

function Avatar({ src }) {
  return (
    <img
      src={src || `${import.meta.env.VITE_STORAGE_URL}/fotos_usuarios/foto.jpg`}
      alt="foto"
      style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0, alignSelf: "flex-start" }}
    />
  );
}

export function AwardCard({ award }) {
  const [confirmando, setConfirmando] = useState(false);

  return (
    <div style={CARD}>
      {/* Cabeçalho */}
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
        <Avatar src={award.user_foto} />
        <div style={{ flex: 1 }}>
          <p style={TEXT}>
            <span>@{award.user_username} </span>
            <span>é </span>
            <span style={PURPLE}>{award.name}</span>
            <span> do </span>
            <span style={PURPLE}>{award.comite}</span>
            <span> como </span>
            <span style={PURPLE}>{award.delegation}</span>
            <span> na </span>
            <span style={PURPLE}>{award.mun}</span>
          </p>
        </div>
      </div>

      {/* Barra inferior */}
      {award.can_edit && (
        <div className="flex gap-2" style={{ paddingLeft: "44px" }}>
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