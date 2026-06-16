import { router } from '@inertiajs/react';
import { useState } from 'react';

const s = {
    item: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        borderRadius: '12px',
        padding: '10px 10px',
    },
    avatar: {
        width: "clamp(28px, 3vw, 44px)",
        height: "clamp(28px, 3vw, 44px)",
        borderRadius: '50%',
        objectFit: 'cover',
        flexShrink: 0,
        background: '#c7b0e8',
    },
    body: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        minWidth: 0,
    },
    mensagem: {
        margin: 0,
        fontSize: "clamp(0.8rem, 1vw, 1.1rem)",
        lineHeight: 1,
        color: '#1a1a1a',
        wordBreak: 'break-word',
        fontFamily: "'Glacial Indifference', sans-serif",
    },
    username: {
        fontWeight: 700,
        color: '#6425d8',
        fontFamily: "'Glacial Indifference', sans-serif",
    },
    texto: {
        fontWeight: 400,
        color: '#1a1a1a',
        fontFamily: "'Glacial Indifference', sans-serif",
    },
    quote: {
        fontStyle: 'italic',
        color: '#444',
    },
    btn: {
        alignSelf: 'flex-start',
        border: 'none',
        borderRadius: '20px',
        padding: '2px 16px',
        fontSize: "clamp(0.5rem, 0.8vw, 0.78rem)",
        fontWeight: 900,
        letterSpacing: '0.04em',
        cursor: 'pointer',
        background: '#6425d8',
        color: '#c5a7ff',
        maxHeight: '1.3rem',
        fontFamily: "'AGRandir', sans-serif",
    },
};

export default function Notificacao({ notificacao }) {
    const { tipo, remetente, comentario, follower, spotted } = notificacao;

    const [seguindo, setSeguindo] = useState(follower?.ja_segue_de_volta ?? false);
    const [loading, setLoading] = useState(false);

    const isAnonimo = tipo === 3 && spotted?.anonimo;

    const fotoUrl = (!isAnonimo && remetente?.foto)
        ? `/storage/${remetente.foto}`
        : '/storage/fotos_usuarios/foto.jpg';

    function handleToggleFollow() {
        setLoading(true);
        router.post(
            route('followers.toggle'),
            { followed_id: remetente.id },
            {
                preserveScroll: true,
                onSuccess: () => setSeguindo((prev) => !prev),
                onFinish: () => setLoading(false),
            }
        );
    }

    function renderTexto() {
        switch (tipo) {
            case 0:
                return <span style={s.texto}>curtiu sua publicação</span>;
            case 1:
                return (
                    <span style={s.texto}>
                        comentou: <span style={s.quote}>"{comentario?.texto}"</span>
                    </span>
                );
            case 2:
                return <span style={s.texto}>começou a seguir você</span>;
            case 3:
                return (
                    <span style={s.texto}>
                        {isAnonimo
                            ? 'enviou um spotted anônimo'
                            : <>enviou um spotted: <span style={s.quote}>"{spotted?.mensagem}"</span></>
                        }
                    </span>
                );
            default:
                return null;
        }
    }

    return (
        <div style={s.item}>
            <img
                src={fotoUrl}
                alt={isAnonimo ? 'anonimo' : (remetente?.username ?? '')}
                style={s.avatar}
            />
            <div style={s.body}>
                <p style={s.mensagem}>
                    <span style={s.username}>
                        @{isAnonimo ? 'anonimo' : (remetente?.username ?? '')}
                    </span>{' '}
                    {renderTexto()}
                </p>
                {tipo === 2 && (
                    <button
                        onClick={handleToggleFollow}
                        disabled={loading}
                        style={{ ...s.btn, opacity: loading ? 0.6 : 1 }}
                    >
                        {seguindo ? 'DESFAZER' : 'ALIAR-SE'}
                    </button>
                )}
            </div>
        </div>
    );
}
