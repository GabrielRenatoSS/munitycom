import React, { useState } from "react";
import axios from "axios";

export default function Seguir({ userId, initialFollowing }) {
  const [following, setFollowing] = useState(!!initialFollowing);
  const [loading, setLoading] = useState(false);

  async function toggle() {
  if (loading) return;
  setLoading(true);
  const prev = following;
  setFollowing(!prev);
  try {
    const token = document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1];
    await fetch("/followers/toggle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-XSRF-TOKEN": decodeURIComponent(token ?? ""),
      },
      body: JSON.stringify({ following_id: userId }),
    });
  } catch {
    setFollowing(prev);
  } finally {
    setLoading(false);
  }
}

  return (
    <button
      onClick={toggle}
      disabled={loading}
      style={{
        background: following ? "#6425d8" : "#c3a5ff",
        color: following ? "#c3a5ff" : "#6425d8",
        border: "none",
        borderRadius: "50px",
        cursor: "pointer",
        fontFamily: "'Agrandir', sans-serif",
        fontSize: "clamp(0.7rem, 2.5vw, 0.85rem)",
        fontWeight: 700,
        padding: "0.05rem 0.8rem",
        minWidth: "90px",
        maxHeight: "1 rem",
        transition: "all 0.15s",
      }}
    >
      {following ? "SEGUINDO" : "SEGUIR"}
    </button>
  );
}
