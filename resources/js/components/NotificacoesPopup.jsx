import { useEffect, useRef, useState } from 'react';
import Notificacao from '@/components/Notificacao';

const s = {
    overlayDesktop: {
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        pointerEvents: 'none',
    },
    overlayMobile: {
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(0,0,0,0.25)',
    },
    popupDesktop: {
        position: 'absolute',
        top: '4.4rem',           // espaço abaixo do menu superior
        right: '0.94%',
        width: '25.1%',
        bottom: '0.94%',         // mesmo respiro embaixo
        overflowY: 'auto',
        background: '#e8d9f8',
        borderRadius: '32px',
        padding: '20px 16px 16px',
        pointerEvents: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
    },
    popupMobile: {
        position: 'fixed',
        top: '3.8rem',           // abaixo do menu de navegação superior
        bottom: '3.4rem',        // acima do menu inferior, com respiro
        left: '3.5%',
        right: '3.5%',
        overflowY: 'auto',
        background: '#e8d9f8',
        borderRadius: '32px',    // igual ao BarraPublications (2rem)
        padding: '20px 16px 16px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
    },
    titulo: {
        fontSize: "clamp(1.8rem, 3vw, 3rem)",
        fontWeight: 900,
        color: '#6425d8',
        margin: '0 0 4px',
        textAlign: 'center',
        letterSpacing: '-0.5px',
        fontFamily: "'AGRandir', sans-serif",
    },
    lista: {
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
    },
    vazia: {
        textAlign: 'center',
        color: '#888',
        fontSize: '0.9rem',
        padding: '16px 0',
        margin: 0,
    },
};

function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
    );

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth < breakpoint);
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return isMobile;
}

export default function NotificacoesPopup({ notificacoes, loading, onClose }) {
    const ref = useRef(null);
    const isMobile = useIsMobile();

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                onClose?.();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div style={isMobile ? s.overlayMobile : s.overlayDesktop}>
            <style>{`
                .popup-notificacoes::-webkit-scrollbar { display: none; }
            `}</style>
            <div
                className="popup-notificacoes"
                style={isMobile ? s.popupMobile : s.popupDesktop}
                ref={ref}
            >
                <h2 style={s.titulo}>notificações</h2>
                {loading ? (
                    <p style={s.vazia}>Carregando...</p>
                ) : notificacoes.data.length === 0 ? (
                    <p style={s.vazia}>Nenhuma notificação ainda.</p>
                ) : (
                    <div style={s.lista}>
                        {notificacoes.data.map((n) => (
                            <Notificacao key={n.id} notificacao={n} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
