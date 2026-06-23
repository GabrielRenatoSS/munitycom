import React from "react";

export default function Purpose() {
  return (
    <section className="w-full min-h-screen" style={{ backgroundColor: "#ddd6fe" }}>

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex w-full min-h-screen">

        {/* Left spacer: 5.63% */}
        <div style={{ width: "5.63%", flexShrink: 0 }} />

        {/* Col 1: 24.11% — top 13.8%, card 80%, bottom 6.2% */}
        <div className="flex flex-col" style={{ width: "24.11%", flexShrink: 0 }}>
          <div style={{ height: "13.8%" }} />
          <div className="relative overflow-hidden rounded-[2rem]" style={{ height: "80%" }}>
            <img src="/images/proposito-1.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 flex items-end justify-start p-6">
              <p style={{
                fontFamily: "'Agrandir', sans-serif",
                fontSize: "2.4rem",
                fontWeight: 700,
                color: "#fff",
                textAlign: "left",
                lineHeight: 1.1,
                whiteSpace: "pre-line",
                textShadow: "0 2px 12px rgba(0,0,0,0.4)",
              }}>
                {"CONECTAR\nDELEGADOS E\nMUNS"}
              </p>
            </div>
          </div>
          <div style={{ height: "6.2%" }} />
        </div>

        {/* Gap: 3.02% */}
        <div style={{ width: "3.02%", flexShrink: 0 }} />

        {/* Col 2: 24.11% — top 6.2%, card 80%, bottom 13.8% */}
        <div className="flex flex-col" style={{ width: "24.11%", flexShrink: 0 }}>
          <div style={{ height: "6.2%" }} />
          <div className="relative overflow-hidden rounded-[2rem]" style={{ height: "80%" }}>
            <img src="/images/proposito-2.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 flex items-start justify-end p-6">
              <p style={{
                fontFamily: "'AGRandir', sans-serif",
                fontSize: "2.4rem",
                fontWeight: 700,
                color: "#fff",
                textAlign: "right",
                lineHeight: 1.1,
                whiteSpace: "pre-line",
                textShadow: "0 2px 12px rgba(0,0,0,0.4)",
              }}>
                {"REUNIR OS\nREGISTROS\nDAS MUNS\nQUE VOCÊ\nPARTICIPOU!"}
              </p>
            </div>
          </div>
          <div style={{ height: "13.8%" }} />
        </div>

        {/* Gap: 3.02% */}
        <div style={{ width: "3.02%", flexShrink: 0 }} />

        {/* Col 3: 29.95% — top 10%, título, card 56.2% */}
        <div className="flex flex-col" style={{ width: "29.95%", flexShrink: 0 }}>
          <div style={{ height: "10%" }} />
          <h2 style={{
            fontFamily: "'TAN Nimbus', serif",
            fontSize: "5rem",
            color: "#6425d8",
            lineHeight: 1.0,
            fontWeight: 700,
            marginBottom: "1.5rem",
          }}>
            nosso<br />propósito
          </h2>
          <div className="relative overflow-hidden rounded-[2rem]" style={{ height: "56.2%" }}>
            <img src="/images/proposito-3.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 flex items-end justify-start p-6">
              <p style={{
                fontFamily: "'AGRandir', sans-serif",
                fontSize: "2.4rem",
                fontWeight: 700,
                color: "#fff",
                textAlign: "left",
                lineHeight: 1.1,
                whiteSpace: "pre-line",
                textShadow: "0 2px 12px rgba(0,0,0,0.4)",
              }}>
                {"DEMOCRATIZAR\nO ACESSO À\nMUNS"}
              </p>
            </div>
          </div>
        </div>

        {/* Right spacer */}
        <div style={{ flex: 1 }} />
      </div>

      {/* ── MOBILE ── */}
      <div className="flex flex-col md:hidden w-full px-5 py-10 gap-5">
        <h2 style={{
          fontFamily: "'TAN Nimbus', serif",
          fontSize: "clamp(2.4rem, 12vw, 4rem)",
          color: "#6425d8",
          lineHeight: 1.0,
          fontWeight: 700,
        }}>
          nosso<br />propósito
        </h2>

        {[
          { image: "/images/proposito-1.jpeg", label: "CONECTAR\nDELEGADOS E\nMUNS", alignItems: "flex-end", justifyContent: "flex-start", textAlign: "left" },
          { image: "/images/proposito-2.jpeg", label: "REUNIR OS\nREGISTROS\nDAS MUNS\nQUE VOCÊ\nPARTICIPOU!", alignItems: "flex-start", justifyContent: "flex-end", textAlign: "right" },
          { image: "/images/proposito-3.jpeg", label: "DEMOCRATIZAR\nO ACESSO À\nMUNS", alignItems: "flex-end", justifyContent: "flex-start", textAlign: "left" },
        ].map((card, i) => (
          <div key={i} className="relative w-full overflow-hidden rounded-[2rem]" style={{ aspectRatio: "4/3" }}>
            <img src={card.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 p-5 flex" style={{ alignItems: card.alignItems, justifyContent: card.justifyContent }}>
              <p style={{
                fontFamily: "'AGRandir', sans-serif",
                fontSize: "clamp(1.4rem, 5vw, 2rem)",
                fontWeight: 700,
                color: "#fff",
                textAlign: card.textAlign,
                lineHeight: 1.1,
                whiteSpace: "pre-line",
                textShadow: "0 2px 10px rgba(0,0,0,0.4)",
              }}>
                {card.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
