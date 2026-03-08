import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Feed() {
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadGlobalFeed = async () => {
        try {
            const [postsRes, awardsRes] = await Promise.all([
                axios.get('/publications'),
                axios.get('/awards')
            ]);

            const combined = [...postsRes.data.data, ...awardsRes.data.data]
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            setTimeline(combined);
        } catch (error) {
            console.error("Erro ao carregar feed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGlobalFeed();
    }, []);

    return (
        <div>
            
        </div>
    );
}