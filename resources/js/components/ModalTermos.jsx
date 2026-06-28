import React, { useState, useEffect } from "react";

const TERMOS = `
**1. Aceitação dos Termos**

Ao criar uma conta na MUNity.com, você declara que leu, compreendeu e concorda com estes Termos de Uso. Caso seja menor de 18 anos, é necessário que um responsável legal leia e autorize o cadastro.

**2. Elegibilidade**

A plataforma é voltada a estudantes e participantes de conferências de Model United Nations (MUN). Não há restrição de idade mínima, mas usuários menores de 18 anos devem ter autorização de um responsável legal para utilizar a MUNity.com.

**3. Dados Coletados**

Para o funcionamento da plataforma, coletamos as seguintes informações fornecidas por você no cadastro:

- Nome completo
- Endereço de e-mail
- Foto de perfil
- Cidade, estado e país de residência

Esses dados são utilizados exclusivamente para identificação dentro da plataforma, personalização do seu perfil e comunicação relacionada à sua conta. Não vendemos, alugamos nem compartilhamos suas informações com terceiros para fins comerciais.

**4. Uso da Conta**

Você é responsável por manter a confidencialidade de suas credenciais de acesso. É proibido compartilhar sua conta com outras pessoas, criar contas falsas ou se passar por outra pessoa. A MUNity.com reserva o direito de suspender ou encerrar contas que violem estas regras.

**5. Conteúdo do Usuário**

Ao publicar qualquer conteúdo na plataforma (foto de perfil, informações, atividades), você garante que possui os direitos sobre esse conteúdo e que ele não viola direitos de terceiros. Conteúdos ofensivos, discriminatórios ou ilegais estão sujeitos à remoção imediata e podem resultar no encerramento da conta.

**6. Conduta na Plataforma**

É esperado que todos os usuários mantenham uma conduta respeitosa e condizente com o ambiente acadêmico e diplomático do MUN. São proibidos assédio, discurso de ódio, spam e qualquer comportamento prejudicial a outros usuários.

**7. Privacidade de Menores**

Levamos a privacidade de menores de 18 anos muito a sério. Não coletamos dados além dos listados na seção 3, não exibimos publicamente o e-mail de nenhum usuário e permitimos que a conta seja excluída a qualquer momento mediante solicitação.

**8. Alterações nos Termos**

O MUNity.com pode atualizar estes Termos periodicamente. Em caso de mudanças relevantes, você será notificado por e-mail ou por aviso na plataforma. O uso contínuo após a notificação implica aceitação dos novos termos.

**9. Contato**

Dúvidas, solicitações ou reclamações relacionadas a estes Termos ou à privacidade dos seus dados podem ser enviadas para: munitycom.social@gmail.com
`;

function renderTexto(texto) {
  return texto
    .trim()
    .split("\n\n")
    .map((bloco, i) => {
      if (bloco.startsWith("- ")) {
        const itens = bloco.split("\n").filter(l => l.startsWith("- "));
        return (
          <ul key={i} style={{ margin: "0.3rem 0 0.3rem 1.2rem", padding: 0 }}>
            {itens.map((item, j) => (
              <li key={j} style={{ marginBottom: "0.15rem" }}>{item.replace(/^- /, "")}</li>
            ))}
          </ul>
        );
      }
      const partes = bloco.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} style={{ margin: "0 0 0.7rem 0", lineHeight: 1.6 }}>
          {partes.map((p, j) =>
            p.startsWith("**") && p.endsWith("**")
              ? <strong key={j}>{p.slice(2, -2)}</strong>
              : p
          )}
        </p>
      );
    });
}

export default function ModalTermos({ onClose }) {
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const cabecalho = (tamanhoFonte, paddingBox, iconSize) => (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: paddingBox,
      flexShrink: 0,
    }}>
      <h2 style={{
        fontFamily: "'Tan Nimbus', 'Agrandir', sans-serif",
        fontSize: tamanhoFonte,
        color: "#8c52ff",
        margin: 0,
        fontWeight: 700,
        lineHeight: 1,
        textAlign: "center",
        flex: 1,
      }}>
        termos de uso
      </h2>
      <button
        onClick={onClose}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}
      >
        <img
          src="/images/logout-menu.png"
          alt="fechar"
          style={{ width: iconSize, height: iconSize, objectFit: "contain", transform: "scaleX(-1)" }}
        />
      </button>
    </div>
  );

  const conteudo = (paddingScroll) => (
    <>
      <style>{`
        .modal-termos-scroll::-webkit-scrollbar { display: none; }
      `}</style>
      <div
        className="modal-termos-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: paddingScroll,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          fontFamily: "'Glacial Indifference', sans-serif",
          fontSize: "0.95rem",
          color: "#3b1a6e",
        }}
      >
        {renderTexto(TERMOS)}
      </div>
    </>
  );

  return (
    <>
      {/* ══════════ DESKTOP ══════════ */}
      <div
        className="hidden md:flex"
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(100, 37, 216, 0.15)",
          backdropFilter: "blur(6px)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: "#ddd3f3",
            borderRadius: "24px",
            width: "clamp(320px, 45vw, 600px)",
            maxHeight: "75vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(100, 37, 216, 0.18)",
          }}
        >
          {cabecalho("clamp(1.8rem, 3vw, 2rem)", "1.2rem 1.5rem 0.8rem", 28)}
          {conteudo("0 1.5rem 1.2rem")}
        </div>
      </div>

      {/* ══════════ MOBILE ══════════ */}
      <div
        className="flex md:hidden"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          flexDirection: "column",
          alignItems: "stretch",
          padding: "calc(44px + 0.5rem) 0.6rem calc(44px + 0.6rem)",
          background: "rgba(100, 37, 216, 0.10)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div style={{
          background: "#ddd3f3",
          borderRadius: "20px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: 0,
        }}>
          {cabecalho("clamp(1.2rem, 6vw, 1.8rem)", "1rem 1rem 0.6rem", 22)}
          {conteudo("0 1rem 1rem")}
        </div>
      </div>
    </>
  );
}
