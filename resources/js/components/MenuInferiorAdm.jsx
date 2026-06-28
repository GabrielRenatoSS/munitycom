import React from "react";
import { router, usePage } from "@inertiajs/react";

export default function MenuInferiorAdm({ onTogglePublications }) {
  const { auth } = usePage().props;
  const user = auth?.user;

  const username = user?.username ?? "";
 const foto = user?.foto
    ? `${import.meta.env.VITE_STORAGE_URL}/${user.foto}`
    : `${import.meta.env.VITE_STORAGE_URL}/fotos_usuarios/foto.jpg`;

  const icones = [
    {
      key: "foto",
      src: foto,
      alt: username,
      action: null,
      circular: true,
    },
    {
      key: "users",
      src: "/images/users-index.png",
      alt: "Usuários",
      action: () => router.visit("/users"),
      circular: false,
    },
    {
      key: "feedback",
      src: "/images/reclame-menu.png",
      alt: "Feedback",
      action: () => router.visit("/feedback"),
      circular: false,
    },
    {
      key: "logout",
      src: "/images/logout-menu.png",
      alt: "Logout",
      action: () => router.post("/logout"),
      circular: false,
    },
  ];

  return (
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
          onClick={icone.action ?? undefined}
          disabled={!icone.action}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: icone.action ? "pointer" : "default",
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
  );
}
