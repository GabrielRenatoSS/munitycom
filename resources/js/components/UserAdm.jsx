import React, { useState } from "react";
import { router } from "@inertiajs/react";
import axios from "axios";

const TEXT = {
  fontFamily: "'Glacial Indifference', sans-serif",
};

export default function UserAdm({ users }) {
  const [bloqueios, setBloqueios] = useState(() => {
    const map = {};
    (users?.data ?? users ?? []).forEach((u) => { map[u.id] = u.bloqueio; });
    return map;
  });

  const lista = users?.data ?? users ?? [];

  function handleBloqueio(user) {
    axios.post(`/users/${user.id}/bloqueio`)
      .then((res) => {
        setBloqueios((prev) => ({ ...prev, [user.id]: res.data.bloqueio }));
      })
      .catch(() => {
        setBloqueios((prev) => ({ ...prev, [user.id]: !prev[user.id] }));
      });
  }

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      {lista.map((user) => {
        const bloqueado = bloqueios[user.id];
        const foto = user.foto
          ? (user.foto.startsWith('http') ? user.foto : `${import.meta.env.VITE_STORAGE_URL}/${user.foto}`)
          : `${import.meta.env.VITE_STORAGE_URL}/fotos_usuarios/foto.jpg`;
        const dataCadastro = user.created_at
          ? new Date(user.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" })
          : "—";

        return (
          <div
            key={user.id}
            style={{
              background: "white",
              border: "2px solid #8c52ff",
              borderRadius: "13px",
              padding: "0.6rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <img
              src={foto}
              alt={user.username}
              onClick={() => router.visit(`/profile/${user.username}`)}
              style={{ width: "clamp(32px, 7vw, 44px)", height: "clamp(32px, 7vw, 44px)", borderRadius: "50%", objectFit: "cover", flexShrink: 0, cursor: "pointer" }}
            />

            <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={() => router.visit(`/profile/${user.username}`)}>
              <p style={{ ...TEXT, fontSize: "clamp(0.75rem, 2.5vw, 0.9rem)", color: "#6425d8", fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
                @{user.username}
              </p>
              <p style={{ ...TEXT, fontSize: "clamp(0.7rem, 2.5vw, 0.85rem)", color: "#000", margin: 0, lineHeight: 1.2 }}>
                {user.name}
              </p>
              <p style={{ ...TEXT, fontSize: "clamp(0.65rem, 2vw, 0.8rem)", color: "#8c52ff", margin: 0, lineHeight: 1.2 }}>
                {user.email}
              </p>
              <p style={{ ...TEXT, fontSize: "clamp(0.65rem, 2vw, 0.8rem)", color: "#000", margin: 0, lineHeight: 1.2 }}>
                Data de Cadastro: {dataCadastro}
              </p>
            </div>

            <button
              onClick={() => handleBloqueio(user)}
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer", flexShrink: 0 }}
            >
              <img
                src={bloqueado ? "/images/desbloquear.png" : "/images/bloquear.png"}
                alt={bloqueado ? "Desbloquear" : "Bloquear"}
                style={{ width: "clamp(28px, 6vw, 40px)", height: "clamp(28px, 6vw, 40px)", objectFit: "contain" }}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}
