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

interface User {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  publishedAt: string; // ISO date string
  locale: string | null;
}

interface Article {
  id: number;
  documentId: string;
  title: string;
  description: string;
  category: Category;
  comments: any[];
  cover_image_url: string;
  createdAt: string; // Ensure this field is available in your API response
  locale: string | null;
  localizations: any[];
  publishedAt: string;
  updatedAt: string;
  user: User
}

const HomePage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchTitle, setSearchTitle] = useState<string>("");

  const defaultImageUrl = "https://via.placeholder.com/300";

  const fetchArticles = useCallback(async (page: number, title: string) => {
    const url = `https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/articles?populate=*&pagination[page]=${page}&pagination[pageSize]=10${title ? `&filters[title][$containsi]=${title}` : ""}`;
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Map articles and set default image if cover_image_url is null
      const newArticles = response.data.data.map((article: Article) => ({
        ...article,
        cover_image_url: article.cover_image_url || defaultImageUrl,
      }));

      // Sort articles by createdAt date in descending order (newest first)
      const sortedArticles = newArticles.sort((a: Article, b: Article) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      if (page === 1) {
        setArticles(sortedArticles);
      } else {
        setArticles((prev) => [...prev, ...sortedArticles]);
      }
      setHasMore(newArticles.length > 0);
    } catch (err) {
      setError("Failed to fetch articles.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch articles when page or searchTitle changes
  useEffect(() => {
    fetchArticles(page, searchTitle);
  }, [page, searchTitle, fetchArticles]);

  // Infinite scroll handler
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
      loading ||
      !hasMore
    )
      return;

    setPage((prevPage) => prevPage + 1);
  };

  // Add scroll event listener for infinite scroll
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  // Handle search title change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTitle(e.target.value);
  };

  // Handle form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to page 1 on search
    setArticles([]); // Clear existing articles for a new search
  };

  return (
    <div className="h-full w-full ">
      <div className="flex justify-end mt-[50px] relative">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 top-4 right-4">
          <input
            type="text"
            placeholder="Search by title"
            value={searchTitle}
            onChange={handleSearchChange}
            className="p-2 border rounded"
          />
          <button type="submit" className="bg-[#000000] text-white p-2 rounded">
            Search
          </button>
        </form>
      </div>

      <div className="max-w-full w-[1200px] h-screen mt-[90px] overflow">
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