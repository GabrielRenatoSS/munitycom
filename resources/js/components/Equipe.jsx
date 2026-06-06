import React from "react";

export default function Equipe() {
  return (
    <section className="w-full min-h-screen" style={{ backgroundColor: "#ddd3f3" }}>

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex w-full min-h-screen justify-center">

        {/* Col 1 */}
        <div className="flex flex-col items-center" style={{ width: "35%" }}>
          <div style={{ height: "10%" }} />
          <h2
            style={{
              fontFamily: "'TAN Nimbus', serif",
              fontSize: "5rem",
              color: "#6425d8",
              lineHeight: 1.0,
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            conheça
          </h2>
          <div style={{ height: "3vh" }} />
          <img
            src="/images/cracha-gabriel.png"
            alt="Gabriel Silveira"
            style={{ height: "65vh", width: "auto", objectFit: "contain" }}
          />
        </div>

        {/* Gap entre colunas */}
        <div style={{ width: "0%" }} />

        {/* Col 2 */}
        <div className="flex flex-col items-center" style={{ width: "35%" }}>
          <div style={{ height: "10%" }} />
          <img
            src="/images/cracha-cayme.png"
            alt="Cayme A. Flach"
            style={{ height: "65vh", width: "auto", objectFit: "contain" }}
          />
          <div style={{ height: "3vh" }} />
          <h2
            style={{
              fontFamily: "'TAN Nimbus', serif",
              fontSize: "5rem",
              color: "#6425d8",
              lineHeight: 1.0,
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            a equipe
          </h2>
        </div>
      </div>

      {/* ── MOBILE ── */}
      <div className="className=flex flex-col md:hidden w-full items-center px-[10%] py-10 gap-3">
        <div className="flex w-full items-baseline gap-3 justify-start">
          <h2 style={{ fontFamily: "'TAN Nimbus', serif", fontSize: "clamp(2rem, 10vw, 3rem)", color: "#6425d8", lineHeight: 1.0, fontWeight: 700 }}>
            conheça
            a equipe
          </h2>
        </div>

        <img
          src="/images/cracha-gabriel.png"
          alt="Gabriel Silveira"
          className="mx-auto"
          style={{ height: "55vh", width: "auto", objectFit: "contain" }}
        />

        <img
          src="/images/cracha-cayme.png"
          alt="Cayme A. Flach"
          className="mx-auto"
          style={{ height: "47vh", width: "auto", objectFit: "contain" }}
        />
      </div>

    </section>
  );
}
