import React, { useEffect, useState } from "react";
import MenuNavegacao from "../components/MenuNavegacao";
import MenuSuperior from "../components/MenuSuperior";
import MenuInferior from "../components/MenuInferior";
import Mun from "../components/Mun";
import { router } from "@inertiajs/react";

function getToken() {
  return decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? "");
}

const BTN_SM = (active) => ({
  background: active ? "#6425d8" : "#c3a5ff",
  border: "none",
  borderRadius: "50px",
  cursor: "pointer",
  fontFamily: "'Agrandir', sans-serif",
  fontSize: "0.55rem",
  fontWeight: 700,
  color: active ? "#c3a5ff" : "#6425d8",
  padding: "0.08rem 0",
  width: "85%",
  transition: "all 0.15s",
});

function MunMobile({ mun }) {
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
      borderRadius: "13px",
      padding: "0.5rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.2rem",
      boxSizing: "border-box",
      width: "100%",
    }}>
      <img
        src={mun.foto}
        alt={mun.name}
        style={{ width: "100%", aspectRatio: "1", borderRadius: "9px", objectFit: "cover", background: "#ddd3f3" }}
      />
      <div style={{ textAlign: "center", width: "100%" }}>
        <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontWeight: 700, fontSize: "0.6rem", color: "#000", margin: 0, lineHeight: 1.2 }}>
          {mun.name}
        </p>
        <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontWeight: 700, fontSize: "0.55rem", color: "#6425d8", margin: 0 }}>
          @{mun.username}
        </p>
        {mun.cidade && (
          <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: "0.5rem", color: "#888", margin: 0 }}>
            {mun.cidade}
          </p>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.12rem", width: "100%", alignItems: "center" }}>
        <button onClick={toggleInteresse} disabled={loadingI} style={BTN_SM(interested)}>INTERESSE</button>
        <button onClick={toggleSeguir}    disabled={loadingF} style={BTN_SM(following)}>{following ? "SEGUINDO" : "SEGUIR"}</button>
        <button onClick={() => router.visit(`/profile/${mun.username}`)} style={BTN_SM(false)}>VER PERFIL</button>
      </div>
    </div>
  );
}

export default function DiscoverMuns() {
  const [muns, setMuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetch("/discover/muns", { headers: { "Accept": "application/json" } })
      .then((r) => r.json())
      .then((data) => setMuns(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(muns.length / 4);
  const pageMuns = muns.slice(page * 4, page * 4 + 4);

  return (
    <>
      {/* ══════════ DESKTOP ══════════ */}
      <div className="hidden md:flex" style={{ flexDirection: "column", height: "100vh", overflow: "hidden", background: "white", paddingTop: "0.7rem" }}>
        <div style={{ height: "8.15vh", flexShrink: 0, padding: "0 0.94%" }}>
          <MenuNavegacao />
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 0.94%", boxSizing: "border-box" }}>
          {loading ? (
            <p style={{ fontFamily: "'Glacial Indifference', sans-serif", color: "#8c52ff", textAlign: "center" }}>Carregando...</p>
          ) : muns.length === 0 ? (
            <p style={{ fontFamily: "'Glacial Indifference', sans-serif", color: "#888", textAlign: "center" }}>Nenhuma MUN encontrada.</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.2rem", justifyContent: "center" }}>
              {muns.map((mun) => <Mun key={mun.id} mun={mun} />)}
            </div>
          )}
        </div>
      </div>

      {/* ══════════ MOBILE ══════════ */}
      <div className="flex md:hidden" style={{ flexDirection: "column", height: "100vh", overflow: "hidden", background: "white", paddingTop: "0.3rem" }}>
        <div style={{ flexShrink: 0, padding: "0.6rem 0.6rem 0", zIndex: 10 }}>
          <MenuSuperior />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 0, position: "relative", padding: "0.6rem 2rem" }}>
          {loading ? (
            <p style={{ fontFamily: "'Glacial Indifference', sans-serif", color: "#8c52ff" }}>Carregando...</p>
          ) : muns.length === 0 ? (
            <p style={{ fontFamily: "'Glacial Indifference', sans-serif", color: "#888" }}>Nenhuma MUN encontrada.</p>
          ) : (
            <>
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                style={{ position: "absolute", left: "0.4rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: page === 0 ? "default" : "pointer", opacity: page === 0 ? 0.3 : 1, zIndex: 2, padding: 0 }}
              >
                <img src="/images/esquerda.png" alt="anterior" style={{ width: "1rem" }} />
              </button>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", width: "100%", boxSizing: "border-box" }}>
                {pageMuns.map((mun) => <MunMobile key={mun.id} mun={mun} />)}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                style={{ position: "absolute", right: "0.4rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: page >= totalPages - 1 ? "default" : "pointer", opacity: page >= totalPages - 1 ? 0.3 : 1, zIndex: 2, padding: 0 }}
              >
                <img src="/images/direita.png" alt="próximo" style={{ width: "1rem" }} />
              </button>
            </>
          )}
        </div>

        <div style={{ flexShrink: 0, padding: "0 0.6rem 0.6rem", zIndex: 10 }}>
          <MenuInferior />
        </div>
      </div>
    </>
  );
}