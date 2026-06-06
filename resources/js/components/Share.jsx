import React from "react";

export default function Share() {
  return (
    <section className="w-full min-h-screen" style={{ backgroundColor: "#6425d8" }}>

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex flex-col w-full min-h-screen">

        {/* Top spacer: 7.7% */}
        <div style={{ height: "7.7vh" }} />

        {/* Header row: "compartilhe" + texto direita */}
        <div className="flex items-center w-full px-[5.63%]">
          <h2
            style={{
              fontFamily: "'TAN Nimbus', serif",
              fontSize: "5rem",
              color: "#ffffff",
              lineHeight: 1.0,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            compartilhe
          </h2>

          {/* Gap */}
          <div style={{ width: "4%" }} />

          <p
            style={{
              fontFamily: "'Agrandir', sans-serif",
              fontSize: "2.3rem",
              color: "#ffffff",
              fontWeight: 700,
              lineHeight: 1.15,
              textTransform: "uppercase",
            }}
          >
            TODAS AS ETAPAS ANTES,<br />
            DURANTE E DEPOIS DA MUN
          </p>
        </div>

        {/* Gap between header and content */}
        <div style={{ height: "3vh" }} />

        {/* Content row: imagem (70% height) + texto lado direito */}
        <div className="flex items-start w-full px-[5.63%] gap-[1%]" style={{ flex: 1 }}>

          {/* Post image */}
          <div style={{ height: "70vh", flexShrink: 0, width: "auto" }}>
            <img
              src="/images/Post-palanque.png"
              alt="Post exemplo"
              className="h-full w-auto object-contain"
            />
          </div>

          {/* Side text */}
          <div className="flex items-end" style={{ flex: 1, height: "70vh" }}>
            <p
              style={{
                fontFamily: "'AGRandir', sans-serif",
                fontSize: "1.6rem",
                color: "#ffffff",
                lineHeight: 1.3,
              }}
            >
              Desde sua inscrição nela; a delegação que recebeu; sua participação atual ou anterior; memórias com fotos e descrição; até prêmios e votações informais (peer choice)
            </p>
          </div>
        </div>

        {/* Bottom padding */}
        <div style={{ height: "4vh" }} />
      </div>

      {/* ── MOBILE ── */}
      <div className="flex flex-col md:hidden w-full px-5 py-10 gap-6">

        {/* Title */}
        <h2
          style={{
            fontFamily: "'TAN Nimbus', serif",
            fontSize: "clamp(2rem, 10vw, 3rem)",
            color: "#ffffff",
            lineHeight: 1.0,
            fontWeight: 700,
          }}
        >
          compartilhe
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "'AGRandir', sans-serif",
            fontSize: "clamp(1.2rem, 5vw, 2rem)",
            color: "#ffffff",
            fontWeight: 700,
            lineHeight: 1.15,
            textTransform: "uppercase",
          }}
        >
          TODAS AS ETAPAS ANTES,<br />
          DURANTE E DEPOIS DA MUN
        </p>

        {/* Post image */}
        <img
          src="/images/Post-1.png"
          alt="Post exemplo"
          className="w-full object-contain"
        />

        {/* Palanque image */}
        <img
          src="/images/Palanque.png"
          alt="Palanque"
          className="w-[45%] object-contain mx-auto"
        />

        {/* Side text */}
        <p
          style={{
            fontFamily: "'AGRandir', sans-serif",
            fontSize: "clamp(1.1rem, 4.5vw, 1.8rem)",
            color: "#ffffff",
            lineHeight: 1.3,
          }}
        >
          Desde sua inscrição nela; a delegação que recebeu; sua participação atual ou anterior; memórias com fotos e descrição; até prêmios e votações informais (peer choice)
        </p>
      </div>
    </section>
  );
}
