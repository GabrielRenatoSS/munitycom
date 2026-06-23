import React from "react";

export default function Welcome() {
  return (
    <section
      className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-center"
      style={{
        backgroundImage: "url('/images/hero-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* ── DESKTOP LAYOUT ── */}
      {/* Total width = 3.65% gap | 29.74% text | 4.1% gap | 57.15% card | ~5.36% gap */}
      <div className="relative z-10 w-full hidden md:flex items-center h-full">

        {/* Left spacer: 3.65% */}
        <div style={{ width: "3.65%" }} />

        {/* Text column: 29.74% */}
        <div
          className="flex items-center justify-end h-full"
          style={{ width: "29.74%" }}
        >
          <h1
            style={{
              fontFamily: "'TAN Nimbus', serif",
              fontSize: "clamp(3rem, 5.5vw, 80px)",
              lineHeight: 1.35,
              color: "#ffffff",
              textAlign: "right",
              fontWeight: 700,
              textShadow: "0 2px 24px rgba(0,0,0,0.35)",
              letterSpacing: "-0.01em",
            }}
          >
            a rede
            <br />
            social
            <br />
            de quem
            <br />
            simula
          </h1>
        </div>

        {/* Gap: 4.1% */}
        <div style={{ width: "4.1%" }} />

        {/* Card column: 57.15% */}
        <div
          className="flex items-center justify-start h-full"
          style={{ width: "57.15%" }}
        >
          <Card />
        </div>

        {/* Right spacer fills remaining */}
      </div>

      {/* ── MOBILE LAYOUT ── */}
      <div className="relative z-10 w-full flex flex-col items-center justify-start h-full md:hidden px-5 pt-10 gap-6">
        <h1
          style={{
            fontFamily: "'TAN Nimbus', serif",
            fontSize: "clamp(2.4rem, 10vw, 56px)",
            lineHeight: 1.08,
            color: "#ffffff",
            textAlign: "center",
            fontWeight: 700,
            textShadow: "0 2px 20px rgba(0,0,0,0.4)",
            letterSpacing: "1.7 em",
          }}
        >
          a rede social
          <br />
          de quem simula
        </h1>

        <Card mobile />
      </div>
    </section>
  );
}

function Card({ mobile = false }) {
  return (
    <div
      className="flex flex-col items-center justify-between rounded-[2rem]"
      style={{
        background: "#ddd3f3",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        // Desktop: 71.1% viewport height; mobile: auto with padding
        height: mobile ? "auto" : "71.1vh",
        width: mobile ? "100%" : "100%",
        maxWidth: mobile ? "420px" : "none",
        padding: mobile ? "2rem 1.5rem 2rem" : "clamp(1.5rem, 3vh, 2.5rem) clamp(2rem, 4vw, 3.5rem)",
        boxShadow: "0 8px 48px rgba(100, 37, 216, 0.18)",
      }}
    >
      {/* Logo */}
      <div className="flex-1 flex items-center justify-center w-full">
        <img
          src="/images/logo.png"
          alt="MUN.com"
          className="object-contain"
          style={{
            maxHeight: mobile ? "220px" : "clamp(160px, 38vh, 340px)",
            maxWidth: "100%",
            width: "auto",
          }}
        />
      </div>

      {/* Buttons row */}
      <div
      className="flex flex-row items-center justify-center gap-4 w-full"
      style={{ flexShrink: 0 }}
    >
      <CardButton
        label="CADASTRE-SE"
        sublabel="Se você simula"
        href="/register"
        mobile={mobile}
      />
      <CardButton
        label="FAÇA LOGIN"
        sublabel="Já tem uma conta?"
        href="/login"
        mobile={mobile}
      />
    </div>
    </div>
  );
}

function CardButton({ label, sublabel, href, mobile = false }) {
  return (
    <div className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
      <span
        style={{
          fontFamily: "'Glacial Indifference', sans-serif",
          fontSize: mobile ? "clamp(0.75rem, 3.5vw, 1rem)" : "1.56rem",
          color: "#6425d8",
          textAlign: "center",
          display: "block",
          lineHeight: 1.3,
        }}
      >
        {sublabel}
      </span>
      <a
        href={href}
        className="flex items-center justify-center w-full rounded-full transition-all duration-200 hover:brightness-110 active:scale-95"
        style={{
          background: "#c3a5ff",
          // Desktop: 4.8vh; mobile: fixed comfortable height
          height: mobile ? "2.6rem" : "4.8vh",
          minHeight: mobile ? "2.6rem" : "44px",
          fontFamily: "'Agrandir', sans-serif",
          fontSize: mobile ? "clamp(0.65rem, 3vw, 0.9rem)" : "1.56rem",
          color: "#6425d8",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.02em",
          textDecoration: "none",
          border: "2px solid transparent",
          boxShadow: "0 2px 12px rgba(100,37,216,0.12)",
          whiteSpace: "nowrap",
          paddingLeft: "1.2em",
          paddingRight: "1.2em",
        }}
      >
        {label}
      </a>
    </div>
  );
}
