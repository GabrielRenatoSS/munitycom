import React, { useState } from "react";
import { router } from "@inertiajs/react";

const BTN = (active) => ({
  background: active ? "#6425d8" : "#c3a5ff",
  border: "none",
  borderRadius: "50px",
  cursor: "pointer",
  fontFamily: "'Agrandir', sans-serif",
  fontSize: "0.8rem",
  fontWeight: 700,
  color: active ? "#c3a5ff" : "#6425d8",
  padding: "0.15rem 0",
  width: "80%",
  transition: "all 0.15s",
});

function getToken() {
  return decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? "");
}

export default function Mun({ mun }) {
  const [interested, setInterested] = useState(!!mun.is_interested);
  const [following,  setFollowing]  = useState(!!mun.is_following);
  const [loadingI,   setLoadingI]   = useState(false);
  const [loadingF,   setLoadingF]   = useState(false);

  async function toggleInteresse() {
    if (loadingI) return;
    setLoadingI(true);
    const prev = interested;
    setInterested(!prev);
    try {
      const res = await fetch("/interests/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "X-XSRF-TOKEN": getToken() },
        body: JSON.stringify({ mun_id: mun.id }),
      });
      if (!res.ok) setInterested(prev);
    } catch { setInterested(prev); }
    finally { setLoadingI(false); }
  }

  async function toggleSeguir() {
    if (loadingF) return;
    setLoadingF(true);
    const prev = following;
    setFollowing(!prev);
    try {
      const res = await fetch("/followers/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "X-XSRF-TOKEN": getToken() },
        body: JSON.stringify({ following_id: mun.id }),
      });
      if (!res.ok) setFollowing(prev);
    } catch { setFollowing(prev); }
    finally { setLoadingF(false); }
  }

  return (
    <div style={{
      background: "#fff",
      border: "2px solid #ddd3f3",
      borderRadius: "16px",
      padding: "1.2rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.5rem",
      width: "200px",
      boxSizing: "border-box",
    }}>
      <img
        src={mun.foto}
        alt={mun.name}
        style={{ width: 140, height: 140, borderRadius: "13px", objectFit: "cover", background: "#ddd3f3" }}
      />

      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#000", margin: 0, lineHeight: 1.2 }}>
          {mun.name}
        </p>
        <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#6425d8", margin: 0 }}>
          @{mun.username}
        </p>
        {mun.cidade && (
          <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: "0.75rem", color: "#888", margin: "0.1rem 0 0" }}>
            {mun.cidade}
          </p>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", width: "100%", alignItems: "center" }}>
        <button onClick={toggleInteresse} disabled={loadingI} style={BTN(interested)}>
          INTERESSE
        </button>
        <button onClick={toggleSeguir} disabled={loadingF} style={BTN(following)}>
          {following ? "SEGUINDO" : "SEGUIR"}
        </button>
        <button onClick={() => router.visit(`/profile/${mun.username}`)} style={BTN(false)}>
          VER PERFIL
        </button>
      </div>
    </div>
  );
}
