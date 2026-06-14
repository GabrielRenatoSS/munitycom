import { useState, useEffect, useRef, useCallback } from 'react';
import { PostCard } from "../Pages/Publication/Show";
import PostPopup from "@/components/PostPopup";
import axios from 'axios';
// import Publication from './Publication'; // TODO: criar Publication.jsx

export default function FeedPosts() {
  const isMobile = window.innerWidth < 768;

  const LINK_STYLE = {
    fontFamily: "'Glacial Indifference', sans-serif",
    fontSize: isMobile ? "0.85rem" : "1.2rem",
    color: "#000000",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
    textDecoration: "none",
  };

  const ACTIVE_STYLE = {
    ...LINK_STYLE,
    fontWeight: 700,
    color: "#8c52ff",
  };

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [feedType, setFeedType] = useState('global'); // 'global' | 'following'
  const [popupId, setPopupId] = useState(null);
  const loaderRef = useRef(null);

  const fetchPosts = useCallback(async (type, cursor = null, replace = false) => {
    try {
      const params = {};
      if (type === 'following') params.type = 'following';
      if (cursor) params.cursor = cursor;

      const res = await axios.get('/publications', { params });
      const data = res.data.data ?? [];

      setPosts(prev => replace ? data : [...prev, ...data]);
      setNextCursor(res.data.next_cursor ?? null);
    } catch (error) {
      console.error("Erro ao carregar feed:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Troca de aba
  useEffect(() => {
    setLoading(true);
    setPosts([]);
    setNextCursor(null);
    fetchPosts(feedType, null, true);
  }, [feedType, fetchPosts]);

  // Infinite scroll
  useEffect(() => {
  if (!loaderRef.current) return;
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && nextCursor && !loadingMore && !loading) {
        setLoadingMore(true);
        fetchPosts(feedType, nextCursor);
      }
    },
    { threshold: 0.1 }
  );
  observer.observe(loaderRef.current);
  return () => observer.disconnect();
}, [nextCursor, loadingMore, feedType, fetchPosts, loading]);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>

      {/* Abas */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: isMobile ? "0.1rem" : "0.5rem",
          marginBottom: "1.2rem",
        }}
      >
        <button style={feedType === 'global' ? ACTIVE_STYLE : LINK_STYLE} onClick={() => setFeedType('global')}>
          Feed Geral do MUNity.com
        </button>

        {!isMobile && (
          <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: "1.2rem", color: "#000" }}>
            |
          </span>
        )}

        <button style={feedType === 'following' ? ACTIVE_STYLE : LINK_STYLE} onClick={() => setFeedType('following')}>
          Feed Contatos Diplomáticos
        </button>
      </div>

      {/* Posts */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
        {loading ? (
          <p style={{ textAlign: "center", color: "#6425d8" }}>Carregando...</p>
        ) : posts.length === 0 ? (
          <p style={{ textAlign: "center", color: "#6425d8" }}>Nenhuma publicação ainda.</p>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onClick={() => setPopupId(post.id)} />
          ))
        )}

        {/* Sentinela infinite scroll */}
        <div ref={loaderRef} style={{ height: "1px" }} />
        {loadingMore && (
          <p style={{ textAlign: "center", color: "#6425d8" }}>Carregando mais...</p>
        )}
      </div>

      {popupId && <PostPopup postId={popupId} onClose={() => setPopupId(null)} />}

    </div>
  );
}
