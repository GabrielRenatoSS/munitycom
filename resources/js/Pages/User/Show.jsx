// pra chamar uma variável é perfil.nome (o nome igual no back: name, username, seguidores, seguindo, amigos, progresso (tá em inteiro), não lembro o resto dá uma olhada no UserController método show)
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Show({ perfil, auth }) {
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadTimeline = async () => {
        try {
            const [postsRes, awardsRes] = await Promise.all([
                axios.get(`/publications?user_id=${perfil.id}`),
                axios.get(`/awards?user_id=${perfil.id}`)
            ]);

            const combined = [...postsRes.data.data, ...awardsRes.data.data]
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            setTimeline(combined);
        } catch (error) {
            console.error("Erro ao buscar timeline:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTimeline();
    }, [perfil.id]);

    return (
        <div>
            
        </div>
    );
}