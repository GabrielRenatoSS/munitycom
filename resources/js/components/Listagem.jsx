import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import ConfirmPopup from "./ConfirmPopup";

const TEXT = { fontFamily: "'Glacial Indifference', sans-serif" };

function getToken() {
  return decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? "");
}

const BTN = (active) => ({
  background: active ? "#6425d8" : "#c3a5ff",
  border: "none",
  borderRadius: "50px",
  cursor: "pointer",
  fontFamily: "'Agrandir', sans-serif",
  fontSize: "clamp(0.65rem, 2vw, 0.8rem)",
  fontWeight: 700,
  color: active ? "#c3a5ff" : "#6425d8",
  padding: "0.2rem 1rem",
  whiteSpace: "nowrap",
  transition: "all 0.15s",
});

function UserRow({ user, tipo, isOwnProfile }) {
  const [confirmando, setConfirmando] = useState(false);
  const [removido, setRemovido] = useState(false);

  async function desseguir() {
    await fetch("/followers/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json", "X-XSRF-TOKEN": getToken() },
      body: JSON.stringify({ following_id: user.id }),
    });
    setRemovido(true);
  }

  async function remover() {
    await fetch("/followers/remove", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "Accept": "application/json", "X-XSRF-TOKEN": getToken() },
      body: JSON.stringify({ follower_id: user.id }),
    });
    setRemovido(true);
  }

  if (removido) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", padding: "0.4rem 0" }}>
      {/* Avatar */}
      <img
        src={user.foto}
        alt={user.name}
        onClick={() => router.visit(`/profile/${user.username}`)}
        style={{ width: "clamp(32px, 7vw, 44px)", height: "clamp(32px, 7vw, 44px)", borderRadius: "50%", objectFit: "cover", flexShrink: 0, cursor: "pointer" }}
      />

      {/* Nome + username */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ ...TEXT, fontWeight: 700, fontSize: "clamp(0.75rem, 2.5vw, 0.95rem)", color: "#6425d8", margin: 0, lineHeight: 1.2 }}>
          @{user.username}
        </p>
        <p style={{ ...TEXT, fontSize: "clamp(0.65rem, 2vw, 0.85rem)", color: "#000", margin: 0 }}>
          {user.name}
        </p>
      </div>

      {/* Botão — só no próprio perfil */}
      {isOwnProfile && (
        <div style={{ position: "relative", flexShrink: 0 }}>
          {tipo === "following" && (
            <button onClick={desseguir} style={BTN(true)}>DESSEGUIR</button>
          )}
          {tipo === "followers" && (
            <>
              <button onClick={() => setConfirmando(c => !c)} style={BTN(true)}>REMOVER</button>
              {confirmando && (
                <ConfirmPopup
                  mensagem="Tem certeza que quer remover a audiência?"
                  onConfirm={() => { remover(); setConfirmando(false); }}
                  onCancel={() => setConfirmando(false)}
                />
              )}
            </>
          )}
          {tipo === "friends" && (
            <button onClick={desseguir} style={BTN(true)}>DESFAZER</button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Listagem({ userId, tipo, titulo, isOwnProfile }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState(null);

  useEffect(() => {
    fetch(`/users/${userId}/${tipo}`, { headers: { "Accept": "application/json" } })
      .then(r => r.json())
      .then(data => {
        setUsers(data.data ?? []);
        setNextUrl(data.next_page_url ?? null);
      })
      .finally(() => setLoading(false));
  }, [userId, tipo]);

  function loadMore() {
    if (!nextUrl) return;
    fetch(nextUrl, { headers: { "Accept": "application/json" } })
      .then(r => r.json())
      .then(data => {
        setUsers(u => [...u, ...(data.data ?? [])]);
        setNextUrl(data.next_page_url ?? null);
      });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {loading ? (
        <p style={{ ...TEXT, color: "#8c52ff", fontSize: "0.85rem" }}>Carregando...</p>
      ) : users.length === 0 ? (
        <p style={{ ...TEXT, color: "#999", fontSize: "0.85rem" }}>Nenhum usuário encontrado.</p>
      ) : (
        <>
          {users.map(u => (
            <UserRow key={u.id} user={u} tipo={tipo} isOwnProfile={isOwnProfile} />
          ))}
          {nextUrl && (
            <button onClick={loadMore} style={{ ...BTN(false), marginTop: "0.5rem", alignSelf: "center" }}>
              Ver mais
            </button>
          )}
        </>
      )}
    </div>
  );
}
