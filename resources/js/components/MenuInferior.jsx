import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import NotificacoesPopup from "@/Components/NotificacoesPopup";

export default function MenuInferior({ onTogglePublications, showPublications }) {
  const { auth } = usePage().props;
  const user = auth?.user;

  const tipo = user?.tipo ?? 0;
  const progresso = user?.progresso ?? 0;
  const username = user?.username ?? "";
  const foto = user?.foto
    ? `/storage/${user.foto}`
    : "/storage/fotos_usuarios/foto.jpg";

  const [showNotificacoes, setShowNotificacoes] = useState(false);
  const [notificacoes, setNotificacoes] = useState(null);
  const [loadingNotificacoes, setLoadingNotificacoes] = useState(false);

  function handleToggleNotificacoes() {
    if (showNotificacoes) {
      setShowNotificacoes(false);
      return;
    }

    setShowNotificacoes(true);
    setLoadingNotificacoes(true);

    fetch("/notificacoes", {
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((data) => setNotificacoes(data.notificacoes))
      .catch(() => setNotificacoes({ data: [] }))
      .finally(() => setLoadingNotificacoes(false));
  }

  const icones = [
    {
      key: "foto",
      src: foto,
      alt: username,
      action: () => router.visit(`/profile/${username}`),
      show: true,
      circular: true,
    },
    {
      key: "home",
      src: "/images/home-menu.png",
      alt: "Home",
      action: () => router.visit("/feed"),
      show: tipo === 0 || tipo === 1,
    },
    {
      key: "adicionar",
      src: "/images/adicionar-menu.png",
      alt: "Publicações",
      action: onTogglePublications,
      show: true,
    },
    {
      key: "notificacoes",
      src: "/images/notificacoes-menu.png",
      alt: "Notificações",
      action: handleToggleNotificacoes,
      show: tipo === 0 || tipo === 1,
    },
    {
      key: "favoritos",
      src: "/images/favoritos-menu.png",
      alt: "Favoritos",
      action: () => router.visit("/favoritos"),
      show: tipo === 1 || progresso >= 6,
    },
    {
      key: "ranking",
      src: "/images/ranking-menu.png",
      alt: "Ranking",
      action: () => router.visit("/ranking"),
      show: progresso >= 2,
    },
    {
      key: "reclame",
      src: "/images/reclame-menu.png",
      alt: "Feedback",
      action: () => router.visit("/feedback/create"),
      show: tipo === 0 || tipo === 1,
    },
    {
      key: "logout",
      src: "/images/logout-menu.png",
      alt: "Logout",
      action: () => router.post("/logout"),
      show: true,
    },
  ].filter((i) => i.show);

  return (
    <>
      <nav
        style={{
          background: "#8c52ff",
          borderRadius: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0.4rem 1rem",
          gap: "0.5rem",
          width: "100%",
          boxSizing: "border-box",
          height: "2.4rem",
        }}
      >
        {icones.map((icone) => (
          <button
            key={icone.key}
            onClick={icone.action ?? (() => router.visit(icone.href))}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src={icone.src}
              alt={icone.alt}
              style={{
                height: "1.2rem",
                width: icone.circular ? "1.2rem" : "auto",
                borderRadius: icone.circular ? "50%" : 0,
                objectFit: icone.circular ? "cover" : "contain",
              }}
            />
          </button>
        ))}
      </nav>

      {showNotificacoes && (
        <NotificacoesPopup
          notificacoes={notificacoes ?? { data: [] }}
          loading={loadingNotificacoes}
          onClose={() => setShowNotificacoes(false)}
        />
      )}
    </>
  );
}
