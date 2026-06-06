import React from "react";

export default function Gamification() {
  return (
    <section className="w-full" style={{ backgroundColor: "#ddd3f3" }}>

      {/* ══════════════════════════════════════
          PÁGINA 1 — documente e mande spotteds
      ══════════════════════════════════════ */}

      {/* ── DESKTOP página 1 ── */}
      <div className="relative hidden md:block w-full min-h-screen">

        {/* Título sobreposto — canto superior esquerdo, alinhado à direita, não empurra imagem */}
        <div
          className="absolute z-10"
          style={{ top: "7vh", right: "5.63%" }}
        >
          <h2
            style={{
              fontFamily: "'TAN Nimbus', serif",
              fontSize: "5rem",
              color: "#6425d8",
              lineHeight: 1.05,
              fontWeight: 700,
              textAlign: "right",
            }}
          >
            documente<br />e mande<br />spotteds
          </h2>
        </div>

        {/* Imagem: 68.3% da altura, começa 25% do topo, centralizada horizontalmente */}
        <div
          className="flex justify-start"
          style={{ paddingTop: "27vh", paddingLeft: "10vh" }}
        >
          <img
            src="/images/Documento-1.png"
            alt="Documente"
            style={{ height: "68.3vh", width: "auto", objectFit: "contain" }}
          />
        </div>

        {/* Bottom breathing room */}
        <div style={{ height: "6.7vh" }} />
      </div>

      {/* ══════════════════════════════════════
          PÁGINA 2 — desbloqueie novas funções
      ══════════════════════════════════════ */}

      {/* ── DESKTOP página 2 ── */}
      <div className="hidden md:flex flex-col w-full min-h-screen">

        {/* Top spacer */}
        <div style={{ height: "7vh" }} />

        {/* Title + textinho à direita */}
        <div className="flex items-start w-full px-[5.63%]">
          <h2
            style={{
              fontFamily: "'TAN Nimbus', serif",
              fontSize: "4.5rem",
              color: "#6425d8",
              lineHeight: 1.0,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            desbloqueie novas funções
          </h2>
        </div>

        {/* Gap */}
        <div style={{ height: "3vh" }} />

        {/* Progresso image: 73.6vh, centralizada */}
        <div className="flex items-end w-full px-[5.63%] gap-[3%]">
          <img
            src="/images/Progresso-1.png"
            alt="Veja Seu Progresso"
            style={{ height: "73.6vh", width: "auto", objectFit: "contain" }}
            className="rounded-[1.5rem]"
          />

          {/* Textinho lado direito */}
          <p
            style={{
              fontFamily: "'AGRandir', sans-serif",
              fontSize: "1.8rem",
              color: "#6425d8",
              lineHeight: 1.3,
            }}
          >
            Ganhando<br />novas<br />audiências<br />diplomáticas
          </p>
        </div>

        {/* Bottom spacer */}
        <div style={{ height: "5vh" }} />
      </div>

      {/* ══════════════════════════════════════
          MOBILE
      ══════════════════════════════════════ */}
      <div className="flex flex-col md:hidden w-full px-5 py-10 gap-4">

        {/* Título 1 */}
        <h2
          style={{
            fontFamily: "'TAN Nimbus', serif",
            fontSize: "clamp(2rem, 10vw, 3rem)",
            color: "#6425d8",
            lineHeight: 1.0,
            fontWeight: 700,
            textAlign: "right",
          }}
        >
          documente
          <br />e mande
          <br />spotteds
        </h2>

        {/* Documento mobile */}
        <img
          src="/images/Documento-2.png"
          alt="Documento"
          className="w-full object-contain "
        />

        {/* Spotted mobile */}
        <img
          src="/images/Spotted-1.png"
          alt="Spotted"
          className="w-full object-contain "
        />

        {/* Título 2 */}
        <br></br>
        <h2
          style={{
            fontFamily: "'TAN Nimbus', serif",
            fontSize: "clamp(2rem, 10vw, 3rem)",
            color: "#6425d8",
            lineHeight: 1.0,
            fontWeight: 700,
          }}
        >
          desbloqueie
          <br />novas
          <br />funções
        </h2>

        {/* Textinho */}
        <p
          style={{
            fontFamily: "'AGRandir', sans-serif",
            fontSize: "1.4rem",
            color: "#ffffff",
            lineHeight: 1.3,
          }}
        >
          Ganhando novas audiências diplomáticas
        </p>

        {/* Progresso mobile */}
        <img
          src="/images/Progresso-1.png"
          alt="Veja Seu Progresso"
          className="w-full object-contain"
        />
      </div>

    </section>
  );
}
