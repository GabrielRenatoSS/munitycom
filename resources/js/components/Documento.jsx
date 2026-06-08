import { useEffect, useRef, useState } from "react";
import ConfirmPopup from "./ConfirmPopup";
import DocumentoEdit from "./DocumentoEdit";

const FONT = "'Glacial Indifference', sans-serif";

const TIPO_NOMES = {
    1: "Documento de Trabalho",
    2: "Documento de Crise",
    3: "Documento de Resolução Final",
    4: "Acordo Multilateral",
    5: "Agenda",
    6: "Carta à Imprensa",
};

// extrai a string de delegação de um item que pode ser string ou objeto
const delegacaoStr = (item) => (typeof item === "object" && item !== null) ? item.delegacao : item;

export default function Documento({ documento, documentoId, membros = [], can_edit, onClose, onDelete, onSaved }) {
    const overlayRef = useRef(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const handleKey = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose();
    };

    if (editing) {
        return (
            <DocumentoEdit
                documento={documento}
                documentoId={documentoId}
                membros={membros}
                onClose={() => setEditing(false)}
                onSaved={() => { setEditing(false); onSaved?.(); }}
            />
        );
    }

    const renderContent = () => {
        const { tipo, conteudo, brasao, patrocinadores, signatarios } = documento;

        if (tipo === 0) {
            const delegacao = delegacaoStr(patrocinadores?.[0] ?? "");
            const comite    = documento.comite_nome ?? "";
            const autor     = documento.autor_nome  ?? "";
            return (
                <div className="doc-body">
                    {brasao && (
                        <div className="doc-brasao-wrap">
                            <img src={brasao} alt="Brasão" className="doc-brasao" />
                        </div>
                    )}
                    <p className="doc-bold doc-center">{delegacao}</p>
                    <p className="doc-bold doc-center">{autor}</p>
                    <p className="doc-center doc-comite">{comite}</p>
                    <div className="doc-spacer" />
                    <p className="doc-text">{conteudo}</p>
                </div>
            );
        }

        if ([1, 3, 4].includes(tipo)) {
            return (
                <div className="doc-body">
                    <p className="doc-bold doc-center doc-title">{TIPO_NOMES[tipo]}</p>
                    <div className="doc-spacer" />
                    <p className="doc-text">{conteudo}</p>
                    <div className="doc-spacer" />
                    <p className="doc-text">
                        <span className="doc-bold">Patrocinadores: </span>
                        {(patrocinadores ?? []).map(delegacaoStr).join(", ")}
                    </p>
                    <div className="doc-spacer-sm" />
                    <p className="doc-text">
                        <span className="doc-bold">Signatários: </span>
                        {(signatarios ?? []).map(delegacaoStr).join(", ")}
                    </p>
                </div>
            );
        }

        if ([2, 5].includes(tipo)) {
            return (
                <div className="doc-body">
                    <p className="doc-bold doc-center doc-title">{TIPO_NOMES[tipo]}</p>
                    <div className="doc-spacer" />
                    <p className="doc-text">{conteudo}</p>
                </div>
            );
        }

        if (tipo === 6) {
            return (
                <div className="doc-body">
                    <p className="doc-bold doc-center doc-title">{TIPO_NOMES[tipo]}</p>
                    <div className="doc-spacer" />
                    <p className="doc-text">{conteudo}</p>
                    <div className="doc-spacer" />
                    <p className="doc-text">
                        <span className="doc-bold">Signatários: </span>
                        {(signatarios ?? []).map(delegacaoStr).join(", ")}
                    </p>
                </div>
            );
        }

        return null;
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.cdnfonts.com/css/glacial-indifference-2');

                .doc-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(80, 40, 140, 0.18);
                    backdrop-filter: blur(6px);
                    -webkit-backdrop-filter: blur(6px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 1rem;
                    animation: docFadeIn 0.18s ease;
                }
                @keyframes docFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                .doc-popup {
                    background: #fff;
                    border: 1.5px solid #c3a3ff;
                    border-radius: 18px;
                    width: 100%;
                    max-width: 780px;
                    max-height: 88vh;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    box-shadow: 0 8px 40px rgba(120, 60, 220, 0.13);
                    animation: docSlideUp 0.2s ease;
                    overflow: hidden;
                }
                @keyframes docSlideUp {
                    from { transform: translateY(16px); opacity: 0; }
                    to   { transform: translateY(0);    opacity: 1; }
                }

                /* Scrollbar elegante — trilho invisível, thumb suave */
                .doc-scroll {
                    overflow-y: auto;
                    padding: 2rem 2.2rem 1.5rem;
                    flex: 1;
                    scrollbar-width: thin;
                    scrollbar-color: #c3a3ff transparent;
                }
                .doc-scroll::-webkit-scrollbar {
                    width: 4px;
                }
                .doc-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .doc-scroll::-webkit-scrollbar-thumb {
                    background: #c3a3ff;
                    border-radius: 99px;
                }
                .doc-scroll::-webkit-scrollbar-thumb:hover {
                    background: #8c52ff;
                }

                .doc-close-wrap {
                    display: flex;
                    justify-content: flex-end;
                    margin-bottom: 0.5rem;
                }
                /* Close button */
                .doc-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.15s;
                    flex-shrink: 0;
                }
                .doc-close:hover { transform: scale(1.15); }
                .doc-close img {
                    width: auto;
                    height: clamp(20px, 3vw, 30px);
                    object-fit: contain;
                    display: block;
                }

                /* Botões de ação — dentro do scroll, alinhados à direita */
                .doc-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 1.2rem;
                }
                .doc-action-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 4px;
                    transition: transform 0.15s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .doc-action-btn:hover { transform: scale(1.18); }
                .doc-action-btn img {
                    width: auto;
                    height: clamp(18px, 2.5vw, 26px);
                    object-fit: contain;
                    display: block;
                }

                /* Conteúdo */
                .doc-body {
                    font-family: ${FONT};
                    padding-top: 0.5rem;
                }

                .doc-brasao-wrap {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 1rem;
                }
                .doc-brasao {
                    width: 110px;
                    height: 110px;
                    object-fit: contain;
                    display: block;
                }

                .doc-bold   { font-weight: 700; margin: 0; }
                .doc-center { text-align: center; }
                .doc-title  { font-size: 1.05rem; margin: 0; }
                .doc-comite { font-size: 0.97rem; color: #555; margin: 0; }

                .doc-text {
                    font-family: ${FONT};
                    text-align: justify;
                    line-height: 1.75;
                    font-size: clamp(0.7rem, 1vw, 0.97rem);
                    color: #1a1a1a;
                    white-space: pre-wrap;
                    margin: 0;
                }

                .doc-spacer    { height: 1.1rem; }
                .doc-spacer-sm { height: 0.5rem; }

                @media (max-width: 600px) {
                    .doc-popup  { border-radius: 14px; max-height: 93vh; }
                    .doc-scroll { padding: 1.3rem 1.2rem 1rem; }
                    .doc-brasao { width: 80px; height: 80px; }
                    .doc-actions { padding: 0.6rem 1.2rem 0.9rem; }
                }
            `}</style>

            <div className="doc-overlay" ref={overlayRef} onClick={handleOverlayClick}>
                <div className="doc-popup" role="dialog" aria-modal="true">

                    {/* Conteúdo scrollável + todos os botões dentro */}
                    <div className="doc-scroll">
                        <div className="doc-close-wrap">
                            <button className="doc-close" onClick={onClose} aria-label="Fechar">
                                <img src="/images/logout-menu.png" alt="Fechar" />
                            </button>
                        </div>
                        {renderContent()}
                        {can_edit && (
                            <div className="doc-actions">
                                <button className="doc-action-btn" onClick={() => setEditing(true)} aria-label="Editar documento">
                                    <img src="/images/editar.png" alt="Editar" />
                                </button>
                                <div style={{ position: "relative" }}>
                                    <button
                                        className="doc-action-btn"
                                        onClick={() => setShowConfirm(true)}
                                        aria-label="Excluir documento"
                                    >
                                        <img src="/images/excluir.png" alt="Excluir" />
                                    </button>
                                    {showConfirm && (
                                        <ConfirmPopup
                                            mensagem="Excluir documento?"
                                            onConfirm={() => { setShowConfirm(false); onDelete(); }}
                                            onCancel={() => setShowConfirm(false)}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
