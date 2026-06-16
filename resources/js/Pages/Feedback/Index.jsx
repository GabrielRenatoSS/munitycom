import React, { useState } from "react";
import MenuNavegacaoAdm from "../../components/MenuNavegacaoAdm";
import MenuSuperiorAdm from "../../components/MenuSuperiorAdm";
import MenuInferiorAdm from "../../components/MenuInferiorAdm";
import FeedbackAdm from "../../components/FeedbackAdm";

export default function Index({ feedbacks }) {
  const items = feedbacks?.data ?? feedbacks ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);

  function handlePrev() { setCurrentIndex((i) => Math.max(0, i - 1)); }
  function handleNext() { setCurrentIndex((i) => Math.min(items.length - 1, i + 1)); }

  const emptyMsg = (
    <p style={{ fontFamily: "'Glacial Indifference', sans-serif", textAlign: "center", color: "#999" }}>
      Nenhum feedback não lido.
    </p>
  );

  return (
    <>
      {/* ══════════ DESKTOP ══════════ */}
      <div
        className="hidden md:flex"
        style={{
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
          background: "white",
          paddingTop: "0.7rem",
          backgroundImage: "url('/images/adm-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div style={{ height: "8.15vh", flexShrink: 0, padding: "0 0.94%" }}>
          <MenuNavegacaoAdm />
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            padding: "1rem 0.94% 0",
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            className="hide-scrollbar"
            style={{
              width: "60%",
              height: "100%",
              overflowY: "auto",
              padding: "0 1%",
              boxSizing: "border-box",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {items.length === 0 ? emptyMsg : (
              <FeedbackAdm
                feedbacks={items}
                currentIndex={currentIndex}
                onPrev={handlePrev}
                onNext={handleNext}
                isMobile={false}
              />
            )}
          </div>
        </div>
      </div>

      {/* ══════════ MOBILE ══════════ */}
      <div
        className="flex md:hidden"
        style={{
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
          background: "white",
          paddingTop: "0.3rem",
          backgroundImage: "url('/images/feedback-bg-mobile.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div style={{ flexShrink: 0, padding: "0.6rem 0.6rem 0", zIndex: 10 }}>
          <MenuSuperiorAdm />
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0.6rem 0.6rem 0",
            minHeight: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {items.length === 0 ? emptyMsg : (
            <FeedbackAdm
              feedbacks={items}
              currentIndex={currentIndex}
              onPrev={handlePrev}
              onNext={handleNext}
              isMobile={true}
            />
          )}
        </div>

        <div style={{ flexShrink: 0, padding: "0 0.6rem 0.6rem", zIndex: 10 }}>
          <MenuInferiorAdm />
        </div>
      </div>
    </>
  );
}
