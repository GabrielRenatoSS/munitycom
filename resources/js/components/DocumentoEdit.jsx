import { useEffect, useRef, useState } from "react";

const FONT = "'Glacial Indifference', sans-serif";
const FONT_TITLE = "'Agrandir', sans-serif";
const PURPLE = "#6425d8";
const PURPLE_LIGHT = "#c3a5ff";

const TIPO_NOMES = {
    1: "Documento de Trabalho",
    2: "Documento de Crise",
    3: "Documento de Resolução Final",
    4: "Acordo Multilateral",
    5: "Agenda",
    6: "Carta à Imprensa",
};

/* ── Linha de pessoa ── */
function PessoaRow({ username, delegacao, foto, onRemove }) {
    return (
        <div style={{
            border: `1.5px solid ${PURPLE}`,
            borderRadius: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.5rem 0.9rem",
            background: "white",
            width: "100%",
            boxSizing: "border-box",
        }}>
            <img
                src={foto || "/images/default-avatar.png"}
                alt={username}
                style={{ width: "2.4rem", height: "2.4rem", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            />
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <span style={{ fontFamily: FONT, fontSize: "0.95rem", fontWeight: 700, color: PURPLE }}>
                    @{username}
                </span>
                <span style={{ fontFamily: FONT, fontSize: "0.85rem", color: "#333" }}>
                    {delegacao}
                </span>
            </div>
            {onRemove && (
                <button
                    onClick={onRemove}
                    aria-label="Remover"
                    style={{
                        background: "none", border: "none", cursor: "pointer",
                        padding: "4px", display: "flex", alignItems: "center", flexShrink: 0,
                        transition: "transform 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.2)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                    <img src="/images/excluir.png" alt="Remover" style={{ height: "20px", width: "auto" }} />
                </button>
            )}
        </div>
    );
}

/* ── Linha de adicionar ── */
function AddRow({ value, onChange, onAdd }) {
    return (
        <div style={{
            border: `1.5px solid ${PURPLE}`,
            borderRadius: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.5rem 0.9rem",
            background: "white",
            width: "100%",
            boxSizing: "border-box",
        }}>
            <button
                onClick={onAdd}
                style={{
                    width: "2.4rem", height: "2.4rem", borderRadius: "50%",
                    background: PURPLE_LIGHT, border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    fontSize: "1.4rem", color: PURPLE, fontWeight: 700, lineHeight: 1,
                    transition: "transform 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                aria-label="Adicionar"
            >
                +
            </button>
            <input
                value={value}
                onChange={e => onChange(e.target.value)}
                onKeyDown={e => e.key === "Enter" && onAdd()}
                placeholder="Username"
                style={{
                    flex: 1, border: "none", outline: "none",
                    fontFamily: FONT, fontSize: "0.95rem", color: PURPLE,
                    background: "transparent",
                }}
            />
        </div>
    );
}

/* ── Seção de lista editável ── */
function ListaEditavel({ titulo, itens, onRemove, inputValue, onInputChange, onAdd }) {
    return (
        <div style={{ width: "100%" }}>
            <h2 style={{
                fontFamily: FONT_TITLE,
                fontSize: "1rem",
                fontWeight: 700,
                color: PURPLE,
                textAlign: "center",
                margin: "1rem 0 0.6rem",
            }}>
                {titulo}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {itens.map((item, i) => (
                    <PessoaRow
                        key={i}
                        username={item.username}
                        delegacao={item.delegacao}
                        foto={item.foto}
                        onRemove={() => onRemove(i)}
                    />
                ))}
                <AddRow value={inputValue} onChange={onInputChange} onAdd={onAdd} />
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════════
   Componente principal
════════════════════════════════════════════════ */
export default function DocumentoEdit({ documento, documentoId, membros = [], onClose, onSaved }) {
    const overlayRef = useRef(null);

    const [conteudo, setConteudo] = useState(documento.conteudo ?? "");
    const [patrocinadores, setPatrocinadores] = useState(
        (documento.patrocinadores ?? []).map(d =>
            typeof d === "object" ? d : { delegacao: d, username: d, foto: null }
        )
    );
    const [signatarios, setSignatarios] = useState(
        (documento.signatarios ?? []).map(d =>
            typeof d === "object" ? d : { delegacao: d, username: d, foto: null }
        )
    );
    const [addPatInput, setAddPatInput] = useState("");
    const [addSigInput, setAddSigInput] = useState("");
    const [saving, setSaving]   = useState(false);
    const [error, setError]     = useState(null);

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

    /* resolve username → { username, delegacao, foto } */
    const resolveUsername = (input) => {
        const trimmed = input.trim().replace(/^@/, "");
        const found = membros.find(m => m.username === trimmed);
        return found
            ? { username: found.username, delegacao: found.delegacao, foto: found.foto ?? null }
            : { username: trimmed, delegacao: trimmed, foto: null };
    };

    const addPatrocinador = () => {
        if (!addPatInput.trim()) return;
        setPatrocinadores(prev => [...prev, resolveUsername(addPatInput)]);
        setAddPatInput("");
    };

    const addSignatario = () => {
        if (!addSigInput.trim()) return;
        setSignatarios(prev => [...prev, resolveUsername(addSigInput)]);
        setAddSigInput("");
    };

    /* ── Salvar via fetch JSON (sem navegação de página) ── */
    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            // Pega o CSRF token do cookie do Laravel
            const csrfToken = document.cookie
                .split("; ")
                .find(row => row.startsWith("XSRF-TOKEN="))
                ?.split("=")[1];

            const res = await fetch(`/documentos/${documentoId}/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "X-XSRF-TOKEN": csrfToken ? decodeURIComponent(csrfToken) : "",
                },
                body: JSON.stringify({
                    conteudo,
                    patrocinadores: patrocinadores.map(p => p.username),
                    signatarios:    signatarios.map(s => s.username),
                }),
            });

            if (!res.ok) {
                const json = await res.json().catch(() => ({}));
                throw new Error(json?.message ?? `Erro ${res.status}`);
            }

            onSaved?.();
        } catch (err) {
            setError(err.message || "Erro ao salvar.");
        } finally {
            setSaving(false);
        }
    };

    /* ── Render do conteúdo editável ── */
    const textarea = (
        <textarea
            value={conteudo}
            onChange={e => setConteudo(e.target.value)}
            style={{
                fontFamily: FONT,
                fontSize: "0.97rem",
                color: "#1a1a1a",
                lineHeight: 1.75,
                width: "100%",
                boxSizing: "border-box",
                border: `1.5px solid ${PURPLE_LIGHT}`,
                borderRadius: "10px",
                padding: "0.7rem 0.9rem",
                resize: "vertical",
                minHeight: "140px",
                outline: "none",
                background: "#faf8ff",
                transition: "border-color 0.15s",
            }}
            onFocus={e => e.target.style.borderColor = PURPLE}
            onBlur={e  => e.target.style.borderColor = PURPLE_LIGHT}
        />
    );

    const renderEditBody = () => {
        const { tipo, brasao } = documento;

        if (tipo === 0) {
            return (
                <div className="doc-body">
                    {brasao && (
                        <div className="doc-brasao-wrap">
                            <img src={brasao} alt="Brasão" className="doc-brasao" />
                        </div>
                    )}
                    <p className="doc-bold doc-center">{(() => { const d = (documento.patrocinadores ?? [])[0]; return d ? (typeof d === "object" ? d.delegacao : d) : ""; })()}</p>
                    <p className="doc-bold doc-center">{documento.autor_nome ?? ""}</p>
                    <p className="doc-center doc-comite">{documento.comite_nome ?? ""}</p>
                    <div className="doc-spacer" />
                    {textarea}
                </div>
            );
        }

        if ([1, 3, 4].includes(tipo)) {
            return (
                <div className="doc-body">
                    <p className="doc-bold doc-center doc-title">{TIPO_NOMES[tipo]}</p>
                    <div className="doc-spacer" />
                    {textarea}
                    <ListaEditavel
                        titulo="Patrocinadores"
                        itens={patrocinadores}
                        onRemove={i => setPatrocinadores(prev => prev.filter((_, idx) => idx !== i))}
                        inputValue={addPatInput}
                        onInputChange={setAddPatInput}
                        onAdd={addPatrocinador}
                    />
                    <ListaEditavel
                        titulo="Signatários"
                        itens={signatarios}
                        onRemove={i => setSignatarios(prev => prev.filter((_, idx) => idx !== i))}
                        inputValue={addSigInput}
                        onInputChange={setAddSigInput}
                        onAdd={addSignatario}
                    />
                </div>
            );
        }

        if ([2, 5].includes(tipo)) {
            return (
                <div className="doc-body">
                    <p className="doc-bold doc-center doc-title">{TIPO_NOMES[tipo]}</p>
                    <div className="doc-spacer" />
                    {textarea}
                </div>
            );
        }

        if (tipo === 6) {
            return (
                <div className="doc-body">
                    <p className="doc-bold doc-center doc-title">{TIPO_NOMES[tipo]}</p>
                    <div className="doc-spacer" />
                    {textarea}
                    <ListaEditavel
                        titulo="Signatários"
                        itens={signatarios}
                        onRemove={i => setSignatarios(prev => prev.filter((_, idx) => idx !== i))}
                        inputValue={addSigInput}
                        onInputChange={setAddSigInput}
                        onAdd={addSignatario}
                    />
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
                    position: fixed; inset: 0;
                    background: rgba(80, 40, 140, 0.18);
                    backdrop-filter: blur(6px);
                    -webkit-backdrop-filter: blur(6px);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 1000; padding: 1rem;
                    animation: docFadeIn 0.18s ease;
                }
                @keyframes docFadeIn { from { opacity: 0; } to { opacity: 1; } }

                .doc-popup {
                    background: #fff;
                    border: 1.5px solid #c3a3ff;
                    border-radius: 18px;
                    width: 100%; max-width: 780px; max-height: 88vh;
                    display: flex; flex-direction: column;
                    position: relative;
                    box-shadow: 0 8px 40px rgba(120, 60, 220, 0.13);
                    animation: docSlideUp 0.2s ease;
                    overflow: hidden;
                }
                @keyframes docSlideUp {
                    from { transform: translateY(16px); opacity: 0; }
                    to   { transform: translateY(0);    opacity: 1; }
                }

                .doc-scroll {
                    overflow-y: auto; padding: 2rem 2.2rem 1.5rem; flex: 1;
                    scrollbar-width: thin; scrollbar-color: #c3a3ff transparent;
                }
                .doc-scroll::-webkit-scrollbar { width: 4px; }
                .doc-scroll::-webkit-scrollbar-track { background: transparent; }
                .doc-scroll::-webkit-scrollbar-thumb { background: #c3a3ff; border-radius: 99px; }
                .doc-scroll::-webkit-scrollbar-thumb:hover { background: #8c52ff; }

                .doc-close-wrap { display: flex; justify-content: flex-end; margin-bottom: 0.5rem; }
                .doc-close {
                    background: none; border: none; cursor: pointer; padding: 4px;
                    display: flex; align-items: center; justify-content: center;
                    transition: transform 0.15s; flex-shrink: 0;
                }
                .doc-close:hover { transform: scale(1.15); }
                .doc-close img { width: auto; height: clamp(20px, 3vw, 30px); object-fit: contain; display: block; }

                .doc-body { font-family: ${FONT}; padding-top: 0.5rem; }
                .doc-brasao-wrap { display: flex; justify-content: center; margin-bottom: 1rem; }
                .doc-brasao { width: 110px; height: 110px; object-fit: contain; display: block; }
                .doc-bold   { font-weight: 700; margin: 0; }
                .doc-center { text-align: center; }
                .doc-title  { font-size: 1.05rem; margin: 0; }
                .doc-comite { font-size: 0.97rem; color: #555; margin: 0; }
                .doc-spacer    { height: 1.1rem; }
                .doc-spacer-sm { height: 0.5rem; }

                .doc-edit-actions {
                    display: flex; justify-content: center;
                    gap: 1rem; margin-top: 1.8rem; padding-bottom: 0.4rem;
                }
                .doc-edit-btn {
                    font-family: ${FONT_TITLE};
                    font-size: clamp(0.7rem, 1vw, 0.97rem);
                    font-weight: 700;
                    color: ${PURPLE};
                    background: ${PURPLE_LIGHT};
                    border: none; border-radius: 50px;
                    padding: 0.3rem 0rem;
                    width: clamp(7rem, 20vw, 10rem);
                    cursor: pointer;
                    transition: transform 0.15s, filter 0.15s;
                    letter-spacing: 0.01em;
                }
                .doc-edit-btn:hover  { filter: brightness(1.08); transform: scale(1.03); }
                .doc-edit-btn:active { transform: scale(0.97); }
                .doc-edit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

                .doc-edit-error {
                    font-family: ${FONT};
                    color: #c0392b;
                    font-size: 0.88rem;
                    text-align: center;
                    margin-top: 0.6rem;
                }

                @media (max-width: 600px) {
                    .doc-popup  { border-radius: 14px; max-height: 93vh; }
                    .doc-scroll { padding: 1.3rem 1.2rem 1rem; }
                    .doc-brasao { width: 80px; height: 80px; }
                }
            `}</style>

            <div className="doc-overlay" ref={overlayRef} onClick={handleOverlayClick}>
                <div className="doc-popup" role="dialog" aria-modal="true">
                    <div className="doc-scroll">
                        <div className="doc-close-wrap">
                            <button className="doc-close" onClick={onClose} aria-label="Fechar">
                                <img src="/images/logout-menu.png" alt="Fechar" />
                            </button>
                        </div>

                        {renderEditBody()}

                        <div className="doc-edit-actions">
                            <button className="doc-edit-btn" onClick={handleSave} disabled={saving}>
                                {saving ? "SALVANDO…" : "SALVAR"}
                            </button>
                            <button className="doc-edit-btn" onClick={onClose} disabled={saving}>
                                DESCARTAR
                            </button>
                        </div>
                        {error && <p className="doc-edit-error">{error}</p>}
                    </div>
                </div>
            </div>
        </>
    );
}
