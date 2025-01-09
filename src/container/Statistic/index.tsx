/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Card, Typography } from "@material-tailwind/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define the interfaces as mentioned
interface Category {
  id: number;
  documentId: string;
  name: string | null;
  description: string | null;
}

interface Article {
  id: number;
  documentId: string;
  title: string;
  description: string;
  category: Category | null;
  comments: any[];
  cover_image_url: string;
  createdAt: string;
  locale: string | null;
  localizations: any[];
  publishedAt: string;
  updatedAt: string;
}

const Static: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [commentCounts, setCommentCounts] = useState<number[]>([]);
  const [tagCounts, setTagCounts] = useState<{ [tag: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch article data
  const fetchArticles = async () => {
    try {
      const response = await fetch(
        "https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/articles?populate=*"
      );
      const data = await response.json();
      const articlesData = data.data;
      setArticles(articlesData);
      processCommentAndTagData(articlesData);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Process the comment and tag data
  const processCommentAndTagData = (articles: Article[]) => {
    const commentData: number[] = [];
    const tagsData: { [tag: string]: number } = {};

    articles.forEach((article) => {
      // Comment count
      commentData.push(article.comments.length);

      // Tag count
      if (article.category && article.category.name) {
        tagsData[article.category.name] = tagsData[article.category.name]
          ? tagsData[article.category.name] + 1
          : 1;
      }
    });

    setCommentCounts(commentData);
    setTagCounts(tagsData);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Prepare data for Bar chart
  const commentChartData = {
    labels: articles.map((article) => article.title),
    datasets: [
      {
        label: "Comment Count",
        data: commentCounts,
        backgroundColor: "rgb(7, 8, 8)",
        borderColor: "rgb(0, 0, 0)",
        borderWidth: 1,
      },
    ],
  };

  // Prepare tag data for display (most used tags)
  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // Top 5 most used tags

    const TABLE_HEAD = ["Tag Name", "Count"];

  return (
    <div className="h-full w-full">
      <div className="w-[1400px] h-[90px]">
        <h1 className="text-xl font-bold">Dashboard Statistic</h1>
        <div className="my-4">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="h-screen w-full flex flex-col justify-center items-center">
              <div className="mb-6 w-full max-w-4xl px-4">
                <h2 className="text-lg font-semibold mt-20">Most Comments per Article</h2>
                <div className="h-96">
                  <Bar data={commentChartData} />
                </div>
              </div>

              <div className="my-4">
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <div className="w-full max-w-4xl px-4 mt-[-9]">
                    <h2 className="text-lg font-semibold mb-4">Most Used Tags</h2>
                    <Card className="overflow-scroll w-[530px] h-[20%]">
                      <table className="w-full min-w-max table-auto text-left">
                        <thead>
                          <tr>
                            {TABLE_HEAD.map((head) => (
                              <th
                                key={head}
                                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                              >
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal leading-none opacity-70"
                                >
                                  {head}
                                </Typography>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sortedTags.map(([tag, count], index) => {
                            const isLast = index === sortedTags.length - 1;
                            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                            return (
                              <tr key={tag}>
                                <td className={classes}>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {tag}
                                  </Typography>
                                </td>
                                <td className={classes}>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {count}
                                  </Typography>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Static;
