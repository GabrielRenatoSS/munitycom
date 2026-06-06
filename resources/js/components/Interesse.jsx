import React, { useState } from "react";
import axios from "axios";

export default function Interesse({ munId, initialInterested }) {
  const [interested, setInterested] = useState(!!initialInterested);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (loading) return;
    setLoading(true);
    const prev = interested;
    setInterested(!prev);
    try {
        const token = document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1];
        const res = await fetch("/interests/toggle", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-XSRF-TOKEN": decodeURIComponent(token ?? ""),
            },
            body: JSON.stringify({ mun_id: munId }),
        });
        if (!res.ok) setInterested(prev);
    } catch {
        setInterested(prev);
    } finally {
        setLoading(false);
    }
}

  return (
    <button
      onClick={toggle}
      disabled={loading}
      style={{
        background: interested ? "#6425d8" : "#c3a5ff",
        border: "none",
        borderRadius: "50px",
        cursor: "pointer",
        fontFamily: "'Agrandir', sans-serif",
        fontSize: "clamp(0.7rem, 2.5vw, 0.85rem)",
        fontWeight: 700,
        color: interested ? "#c3a5ff" : "#6425d8",
        padding: "0.05rem 0.8rem",
        minWidth: "90px",
        maxHeight: "1 rem",
        transition: "all 0.15s",
      }}
    >
      {interested ? "INTERESSE" : "INTERESSE"}
    </button>
  );
}
