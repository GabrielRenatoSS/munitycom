import React, { useRef, useState, useCallback } from "react";
import ConfirmPopup from "./ConfirmPopup";
import Seguir from "./Seguir";
import ModalLista from "./ModalLista";
import FiltroMun from "./FiltroMun";
import { router, useForm, usePage } from "@inertiajs/react";

const TEXT = {
  fontFamily: "'Glacial Indifference', sans-serif",
  color: "#000",
};

const BTN = {
  background: "#c3a5ff",
  border: "none",
  borderRadius: "50px",
  cursor: "pointer",
  fontFamily: "'Agrandir', sans-serif",
  fontSize: "clamp(0.85rem, 2vw, 1.2rem)",
  padding: "0.1rem 1.5rem",
  color: "#6425d8",
  fontWeight: 700,
  width: "100%",
};

// Recorta a imagem usando canvas e retorna um File
async function cropImageToFile(src, posX, posY, containerW, containerH, filename) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = containerW;
      canvas.height = containerH;
      const ctx = canvas.getContext("2d");

      // Calcula escala cover
      const scaleW = containerW / img.naturalWidth;
      const scaleH = containerH / img.naturalHeight;
      const scale  = Math.max(scaleW, scaleH);

      const renderedW = img.naturalWidth  * scale;
      const renderedH = img.naturalHeight * scale;

      // posX/posY são % (0-100) — converte para offset em px
      const offsetX = -((renderedW - containerW) * (posX / 100));
      const offsetY = -((renderedH - containerH) * (posY / 100));

      ctx.drawImage(img, offsetX, offsetY, renderedW, renderedH);

      canvas.toBlob((blob) => {
        resolve(new File([blob], filename, { type: "image/jpeg" }));
      }, "image/jpeg", 0.92);
    };
    img.src = src;
  });
}

function useDragPosition() {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const dragging = useRef(false);
  const last     = useRef({ x: 0, y: 0 });
  const current  = useRef({ x: 50, y: 50 });

  const onMouseDown = useCallback((e) => {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!dragging.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = ((e.clientX - last.current.x) / rect.width)  * -100;
    const dy = ((e.clientY - last.current.y) / rect.height) * -100;
    last.current = { x: e.clientX, y: e.clientY };
    current.current.x = Math.min(100, Math.max(0, current.current.x + dx));
    current.current.y = Math.min(100, Math.max(0, current.current.y + dy));
    setPos({ ...current.current });
  }, []);

  const onMouseUp = useCallback(() => { dragging.current = false; }, []);

  const reset = useCallback(() => {
    current.current = { x: 50, y: 50 };
    setPos({ x: 50, y: 50 });
  }, []);

  return { pos, onMouseDown, onMouseMove, onMouseUp, reset };
}

export default function Informacoes({ user, isOwnProfile }) {
  const { edicoes } = usePage().props;
  const isMun = user.tipo === 1 && edicoes?.length > 0;

  const [confirmando, setConfirmando] = useState(false);
  const [editando,    setEditando]    = useState(false);
  const [modalTipo,   setModalTipo]   = useState(null); // "followers" | "following" | "friends" | null

  const fotoRef   = useRef(null);
  const bannerRef = useRef(null);

  const { data, setData, post, processing } = useForm({
    _method:   "PUT",
    name:      user.name,
    foto:      null,
    ft_perfil: null,
  });

  const [previewFoto,   setPreviewFoto]   = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);
  // referência ao container para saber tamanho na hora de salvar
  const bannerContainerRef = useRef(null);
  const fotoContainerRef   = useRef(null);

  const bannerDrag = useDragPosition();
  const fotoDrag   = useDragPosition();

  function pickFoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    setData("foto", file);
    setPreviewFoto(URL.createObjectURL(file));
    fotoDrag.reset();
  }

  function pickBanner(e) {
    const file = e.target.files[0];
    if (!file) return;
    setData("ft_perfil", file);
    setPreviewBanner(URL.createObjectURL(file));
    bannerDrag.reset();
  }

  async function salvar() {
    // Gera arquivos já recortados se houve preview
    let fotoFile   = data.foto;
    let bannerFile = data.ft_perfil;

    if (previewFoto && fotoContainerRef.current) {
      const { offsetWidth: w, offsetHeight: h } = fotoContainerRef.current;
      fotoFile = await cropImageToFile(previewFoto, fotoDrag.pos.x, fotoDrag.pos.y, w, h, "foto.jpg");
    }

    if (previewBanner && bannerContainerRef.current) {
      const { offsetWidth: w, offsetHeight: h } = bannerContainerRef.current;
      bannerFile = await cropImageToFile(previewBanner, bannerDrag.pos.x, bannerDrag.pos.y, w, h, "banner.jpg");
    }

    // Atualiza data com os arquivos recortados e submete
    const form = new FormData();
    form.append("_method", "PUT");
    form.append("name", data.name);
    if (fotoFile)   form.append("foto",      fotoFile);
    if (bannerFile) form.append("ft_perfil", bannerFile);

    router.post(`/users/${user.id}`, form, {
      forceFormData: true,
      onSuccess: () => {
        setEditando(false);
        setPreviewFoto(null);
        setPreviewBanner(null);
      },
    });
  }

  function descartar() {
    setEditando(false);
    setPreviewFoto(null);
    setPreviewBanner(null);
    bannerDrag.reset();
    fotoDrag.reset();
    setData({ _method: "PUT", name: user.name, foto: null, ft_perfil: null });
  }

  const fotoSrc   = previewFoto   || user.foto      || "/storage/fotos_usuarios/foto.jpg";
  const bannerSrc = previewBanner || user.ft_perfil || "/fotos_perfis/foto-perfil.png";

  return (
    <div style={{ width: "100%", position: "relative" }}>

      {/* ── Banner ── */}
      <div
        ref={bannerContainerRef}
        style={{
          width: "100%",
          height: "clamp(120px, 22vw, 27vh)",
          borderRadius: "13px",
          overflow: "hidden",
          background: "#ddd3f3",
          position: "relative",
        }}
        onMouseMove={editando ? bannerDrag.onMouseMove : undefined}
        onMouseUp={editando ? bannerDrag.onMouseUp : undefined}
        onMouseLeave={editando ? bannerDrag.onMouseUp : undefined}
      >
        <img
          src={bannerSrc}
          alt="banner"
          style={{
            width: "100%", height: "100%",
            objectFit: "cover",
            objectPosition: `${bannerDrag.pos.x}% ${bannerDrag.pos.y}%`,
            opacity: editando ? 0.6 : 1,
            transition: "opacity 0.2s",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
        {editando && (
          <>
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "0.3rem", pointerEvents: "none",
            }}>
              <img src="/images/editar.png" alt="" style={{ width: 32, height: 32, opacity: 0.9 }} />
              <span style={{ ...TEXT, fontSize: "0.75rem", color: "#fff", textShadow: "0 1px 4px #0006" }}>
                Arraste para reposicionar
              </span>
            </div>
            <div onMouseDown={bannerDrag.onMouseDown} style={{ position: "absolute", inset: 0, cursor: "grab" }} />
            <button
              onClick={() => bannerRef.current.click()}
              style={{
                position: "absolute", bottom: 8, right: 8,
                background: "#c3a5ff", border: "none", borderRadius: "50px",
                cursor: "pointer", padding: "0.2rem 0.8rem",
                fontFamily: "'Agrandir', sans-serif", fontSize: "0.8rem",
                color: "#6425d8", fontWeight: 700, zIndex: 1,
              }}
            >
              Trocar foto
            </button>
            <input ref={bannerRef} type="file" accept="image/*" style={{ display: "none" }} onChange={pickBanner} />
          </>
        )}
      </div>

      {/* ── Linha: avatar + dados ── */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: "1rem",
        position: "relative", padding: "0 0.5rem", paddingLeft: "5.66%",
      }}>

        {/* Avatar */}
        <div
          ref={fotoContainerRef}
          style={{
            width: "clamp(100px, 18vw, 160px)",
            height: "clamp(100px, 18vw, 160px)",
            borderRadius: "13px",
            marginTop: "clamp(-1.8rem, -4vw, -3rem)",
            flexShrink: 0,
            overflow: "hidden",
            background: "#ddd3f3",
            position: "relative",
          }}
          onMouseMove={editando ? fotoDrag.onMouseMove : undefined}
          onMouseUp={editando ? fotoDrag.onMouseUp : undefined}
          onMouseLeave={editando ? fotoDrag.onMouseUp : undefined}
        >
          <img
            src={fotoSrc}
            alt="avatar"
            style={{
              width: "100%", height: "100%",
              objectFit: "cover",
              objectPosition: `${fotoDrag.pos.x}% ${fotoDrag.pos.y}%`,
              opacity: editando ? 0.6 : 1,
              transition: "opacity 0.2s",
              pointerEvents: "none",
              userSelect: "none",
              display: "block",
            }}
          />
          {editando && (
            <>
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                pointerEvents: "none",
              }}>
                <img src="/images/editar.png" alt="" style={{ width: 24, height: 24, opacity: 0.9 }} />
              </div>
              <div onMouseDown={fotoDrag.onMouseDown} style={{ position: "absolute", inset: 0, cursor: "grab" }} />
              <button
                onClick={() => fotoRef.current.click()}
                style={{
                  position: "absolute", bottom: 4, right: 4,
                  background: "#c3a5ff", border: "none", borderRadius: "50px",
                  cursor: "pointer", padding: "0.1rem 0.5rem",
                  fontFamily: "'Agrandir', sans-serif", fontSize: "0.7rem",
                  color: "#6425d8", fontWeight: 700, zIndex: 1,
                }}
              >
                Trocar
              </button>
              <input ref={fotoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={pickFoto} />
            </>
          )}

          {/* Botão Seguir mobile — sobre o avatar, só em perfis alheios */}
          {!isOwnProfile && !editando && (
            <div className="flex md:hidden" style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              justifyContent: "center", padding: "0.3rem",
              background: "linear-gradient(transparent, #0004)",
            }}>
              <Seguir userId={user.id} initialFollowing={user.is_following} />
            </div>
          )}
        </div>

        {/* Dados */}
        <div style={{ flex: 1, paddingTop: "0.5rem", position: "relative" }}>

          {/* Ícones mobile — absoluto no canto direito */}
          {isOwnProfile && !editando && (
            <div className="flex md:hidden flex-col gap-0.5" style={{ position: "absolute", top: "0.9rem", right: 0 }}>
              <button onClick={() => setEditando(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                <img src="/images/editar.png" alt="editar" style={{ width: 13, height: 13, objectFit: "contain" }} />
              </button>
              <div style={{ position: "relative" }}>
                <button onClick={() => setConfirmando(c => !c)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <img src="/images/excluir.png" alt="excluir" style={{ width: 13, height: 13, objectFit: "contain" }} />
                </button>
                {confirmando && (
                  <ConfirmPopup
                    mensagem="Tem certeza que quer excluir sua conta?"
                    onConfirm={() => router.delete("/profile")}
                    onCancel={() => setConfirmando(false)}
                  />
                )}
              </div>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {editando ? (
              <input
                value={data.name}
                onChange={e => setData("name", e.target.value)}
                style={{
                  ...TEXT,
                  fontSize: "clamp(0.7rem, 3vw, 1.4rem)", fontWeight: 700,
                  border: "none", borderBottom: "2px solid #8c52ff",
                  outline: "none", background: "transparent",
                  width: "100%", maxWidth: "320px",
                }}
              />
            ) : (
              <span style={{ ...TEXT, fontSize: "clamp(0.7rem, 3vw, 1.4rem)", fontWeight: 700, lineHeight: 1.1 }}>
                {user.name}
              </span>
            )}

            {/* Botão Seguir desktop — ao lado do nome */}
            {!isOwnProfile && !editando && (
              <div className="hidden md:flex">
                <Seguir userId={user.id} initialFollowing={user.is_following} />
              </div>
            )}

            {/* Desktop: ícones inline */}
            {isOwnProfile && !editando && (
              <div className="hidden md:flex items-center gap-2">
                <button onClick={() => setEditando(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }} title="Editar perfil">
                  <img src="/images/editar.png" alt="editar" style={{ width: 18, height: 18, objectFit: "contain" }} />
                </button>
                <div style={{ position: "relative" }}>
                  <button onClick={() => setConfirmando(c => !c)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }} title="Excluir conta">
                    <img src="/images/excluir.png" alt="excluir" style={{ width: 18, height: 18, objectFit: "contain" }} />
                  </button>
                  {confirmando && (
                    <ConfirmPopup
                      mensagem="Tem certeza que quer excluir sua conta?"
                      onConfirm={() => router.delete("/profile")}
                      onCancel={() => setConfirmando(false)}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          <p style={{ ...TEXT, fontSize: "clamp(0.7rem, 3vw, 1.4rem)", fontWeight: 700, color: "#6425d8", lineHeight: 0.9, margin: "0.1rem 0 0.4rem" }}>
            @{user.username}
            {editando && (
              <span style={{ ...TEXT, fontSize: "0.7rem", fontWeight: 400, color: "#8c52ff", marginLeft: "0.5rem" }}>
                *Você não pode trocar o username
              </span>
            )}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 0, paddingLeft: "clamp(0.5rem, 3vw, 3rem)" }}>
              <span
                onClick={() => setModalTipo("followers")}
                style={{ ...TEXT, fontSize: "clamp(0.6rem, 2.5vw, 1rem)", cursor: "pointer" }}
              >
                {user.seguidores ?? 0} Audiências Diplomáticas
              </span>
              <span
                onClick={() => setModalTipo("following")}
                style={{ ...TEXT, fontSize: "clamp(0.6rem, 2.5vw, 1rem)", cursor: "pointer" }}
              >
                {user.seguindo ?? 0} Contatos Diplomáticos
              </span>
              <span
                onClick={() => setModalTipo("friends")}
                style={{ ...TEXT, fontSize: "clamp(0.6rem, 2.5vw, 1rem)", cursor: "pointer" }}
              >
                {user.amigos ?? 0} Aliados de Conferência
              </span>
            </div>

            {editando && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", minWidth: "130px", marginLeft: "auto" }}>
                <button onClick={salvar}    disabled={processing} style={BTN}>SALVAR</button>
                <button onClick={descartar} disabled={processing} style={BTN}>DESCARTAR</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {modalTipo && (
          <ModalLista
            user={user}
            tipo={modalTipo}
            isOwnProfile={isOwnProfile}
            onClose={() => setModalTipo(null)}
          />
      )}

      {/* FiltroMun — desktop apenas, absoluto no canto inferior direito */}
      {isMun && (
        <div
          className="hidden md:flex"
          style={{ position: "absolute", bottom: "0.5rem", right: "0.5rem" }}
        >
          <FiltroMun />
        </div>
      )}
    </div>
  );
}