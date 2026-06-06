import React, { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import Seguir from "./Seguir";
import Interesse from "./Interesse";

const TEXT = {
  fontFamily: "'Glacial Indifference', sans-serif",
};

export default function UserSearch({ initialQuery = "" }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounce = useRef(null);

  useEffect(() => {
    if (!initialQuery.trim()) { setResults([]); return; }
    setLoading(true);
    fetch(`/users/search?q=${encodeURIComponent(initialQuery.trim())}`, {
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        console.log("results", data);
        setResults(Array.isArray(data) ? data : []);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [initialQuery]);

  if (loading) return (
    <p style={{ ...TEXT, textAlign: "center", color: "#6425d8", fontSize: "0.95rem" }}>Buscando...</p>
  );

  if (!loading && initialQuery.trim() && results.length === 0) return (
    <p style={{ ...TEXT, textAlign: "center", color: "#999", fontSize: "0.9rem" }}>Nenhum usuário encontrado.</p>
  );

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      {results.map((user) => {
        console.log(user);
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
              src={user.foto || "/storage/fotos_usuarios/foto.jpg"}
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
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flexShrink: 0 }}>
              <Seguir userId={user.id} initialFollowing={user.is_following} />
              {user.is_interested !== null && user.is_interested !== undefined && (
                <Interesse munId={user.id} initialInterested={user.is_interested} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
