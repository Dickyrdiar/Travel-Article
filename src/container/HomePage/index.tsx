/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import ArticleList from "../../components/CardContent";

interface Category {
  id: number;
  documentId: string;
  name: string;
  description: string | null;
}

interface Article {
  id: number;
  documentId: string;
  title: string;
  description: string;
  category: Category;
  comments: any[];
  cover_image_url: string;
  createdAt: string;
  locale: string | null;
  localizations: any[];
  publishedAt: string;
  updatedAt: string;
}

const HomePage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchArticles = useCallback(async (page: number) => {
    const url = `https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/articles?populate=*&pagination[page]=${page}&pagination[pageSize]=10`;
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newArticles = response.data.data;
      setArticles((prev) => [...prev, ...newArticles]);
      setHasMore(newArticles.length > 0);
    } catch (err) {
      setError("Failed to fetch articles.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles(page);
  }, [page, fetchArticles]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
      loading ||
      !hasMore
    )
      return;

    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="h-full w-full">
      <div className="w-[1200px] mt-4">
        {loading && page === 1 ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <ArticleList articles={articles} />
        )}
        {loading && page > 1 && <div className="mt-6">Loading more...</div>}
      </div>
    </div>
  );
};

export default HomePage;
