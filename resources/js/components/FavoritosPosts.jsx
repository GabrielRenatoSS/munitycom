import { useState, useEffect, useRef, useCallback } from 'react';
import { PostCard } from "@/Pages/Publication/Show";
import PostPopup from "@/components/PostPopup";
import { router } from "@inertiajs/react";
import axios from 'axios';

const FONT = "'Glacial Indifference', sans-serif";

export default function FavoritosPosts({ initialData }) {
  const [posts, setPosts] = useState(initialData?.data ?? []);
  const [page, setPage] = useState(initialData?.current_page ?? 1);
  const [lastPage, setLastPage] = useState(initialData?.last_page ?? 1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [popupId, setPopupId] = useState(null);
  const loaderRef = useRef(null);

  const fetchMore = useCallback(async (pageNum) => {
    try {
      // Inertia visit para próxima página — atualiza props e recarrega
      router.get('/favoritos', { page: pageNum }, {
        preserveScroll: true,
        preserveState: true,
        only: ['favoritos'],
        onSuccess: (page) => {
          const data = page.props.favoritos;
          setPosts(prev => [...prev, ...(data.data ?? [])]);
          setPage(data.current_page);
          setLastPage(data.last_page);
        },
        onFinish: () => setLoadingMore(false),
      });
    } catch (error) {
      console.error("Erro ao carregar mais favoritos:", error);
      setLoadingMore(false);
    }
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < lastPage && !loadingMore) {
          setLoadingMore(true);
          fetchMore(page + 1);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [page, lastPage, loadingMore, fetchMore]);

  function onDesfavoritado(postId) {
    setPosts(prev => prev.filter(p => p.id !== postId));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
        {posts.length === 0 ? (
          <p style={{ textAlign: "center", color: "#6425d8", fontFamily: FONT }}>Nenhuma publicação favoritada ainda.</p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => setPopupId(post.id)}
              onDesfavoritado={() => onDesfavoritado(post.id)}
            />
          ))
        )}

        <div ref={loaderRef} style={{ height: "1px" }} />
        {loadingMore && (
          <p style={{ textAlign: "center", color: "#6425d8", fontFamily: FONT }}>Carregando mais...</p>
        )}
      </div>

      {popupId && <PostPopup postId={popupId} onClose={() => setPopupId(null)} />}
    </div>
  );
}
