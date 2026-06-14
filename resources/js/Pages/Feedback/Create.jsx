import React from "react";
import { useForm, router } from "@inertiajs/react";

export default function FeedbackCreate() {
  const { data, setData, post, processing, errors, reset } = useForm({
    mensagem: "",
  });

  function submit() {
    post("/feedback");
  }

  function discard() {
    reset();
    router.visit("/feed");
  }

  const btnStyle = {
    background: "#c3a5ff",
    border: "none",
    cursor: "pointer",
    padding: "clamp(0.2rem, 1vw, 0.4rem) 0.8rem",
    fontFamily: "'AGRandir', sans-serif",
    fontSize: "clamp(0.75rem, 3.5vw, 1.56rem)",
    color: "#6425d8",
    fontWeight: 700,
    textTransform: "uppercase",
    height: "clamp(1.4rem, 7vw, 2.5rem)",
  };

  const card = (
    <div
      className="rounded-[2rem] flex flex-col w-full"
      style={{
        background: "#ddd3f3",
        paddingTop: "clamp(1.5rem, 4%, 3rem)",
        paddingBottom: "clamp(1.5rem, 4%, 3rem)",
        paddingLeft: "clamp(1rem, 6%, 4rem)",
        paddingRight: "clamp(1rem, 6%, 4rem)",
        gap: "clamp(0.5rem, 2vw, 1rem)",
      }}
    >
      {/* Título */}
      <h1
        style={{
          fontFamily: "'TAN Nimbus', serif",
          fontSize: "clamp(1.8rem, 7.75vw, 4.6rem)",
          color: "#8c52ff",
          lineHeight: 1.0,
          fontWeight: 700,
          marginBottom: "0.5rem",
          textAlign: "center",
        }}
      >
        feedback
      </h1>

      {/* Descrição */}
      <p
        style={{
          fontFamily: "'Glacial Indifference', sans-serif",
          fontSize: "clamp(0.6rem, 1.8vw, 1rem)",
          color: "#6425d8",
          lineHeight: 1.5,
          textAlign: "justify",
          margin: 0,
        }}
      >
        Nossa equipe trabalha para melhor sua experiência, porém sabemos que
        bugs podem ocorrer. Se tiver qualquer problema com o sistema, denúncia
        contra usuário, sugestão de melhoria ou crítica positiva sobre o
        sistema, sinta-se à vontade de nos enviar. Não armazenaremos ou
        saberemos que foi você que nos enviou.
      </p>

      {/* Textarea */}
      <textarea
        value={data.mensagem}
        onChange={(e) => setData("mensagem", e.target.value)}
        rows={4}
        style={{
          background: "#c3a5ff",
          borderRadius: "1rem",
          border: "none",
          outline: "none",
          padding: "clamp(0.5rem, 1.5vw, 0.8rem) clamp(0.6rem, 2vw, 1rem)",
          fontFamily: "'Glacial Indifference', sans-serif",
          fontSize: "clamp(0.75rem, 3.5vw, 1rem)",
          color: "#ffffff",
          width: "100%",
          resize: "none",
          boxSizing: "border-box",
        }}
      />

      {/* Erro */}
      {errors.mensagem && (
        <p
          style={{
            fontFamily: "'Glacial Indifference', sans-serif",
            fontSize: "clamp(0.7rem, 3vw, 1.56rem)",
            color: "#6425d8",
            textAlign: "center",
            margin: 0,
          }}
        >
          *{errors.mensagem}
        </p>
      )}

      {/* Botões lado a lado */}
      <div className="flex gap-3 mt-2">
        <button
          onClick={submit}
          disabled={processing}
          className="rounded-full transition-all hover:brightness-110 active:scale-95 flex-1"
          style={btnStyle}
        >
          ENVIAR
        </button>
        <button
          onClick={discard}
          className="rounded-full transition-all hover:brightness-110 active:scale-95 flex-1"
          style={btnStyle}
        >
          DESCARTAR
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden"
      style={{
        backgroundImage: "url('/images/feedback.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* DESKTOP */}
      <div
        className="relative z-10 hidden md:flex w-full min-h-screen items-center"
        style={{ paddingTop: "8.6%", paddingBottom: "8.6%" }}
      >
        <div style={{ width: "5.63%", flexShrink: 0 }} />
        <div style={{ width: "44.22%", flexShrink: 0 }}>{card}</div>
      </div>

      {/* MOBILE */}
      <div
        className="relative z-10 flex md:hidden w-full min-h-screen items-center justify-center"
        style={{
          paddingTop: "24.1%",
          paddingBottom: "24.1%",
          paddingLeft: "6.2%",
          paddingRight: "6.2%",
        }}
      >
        <div className="w-full">{card}</div>
      </div>
    </div>
  );
}
