/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { FaComments } from "react-icons/fa"; // Importing a comment icon from react-icons

// Define the interfaces for Category and Article as per the provided structure
interface Category {
  id: number;
  documentId: string;
  name: string | null;
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
  category: Category | null;
  comments: any[];
  cover_image_url: string;
  createdAt: string;
  locale: string | null;
  localizations: any[];
  publishedAt: string;
  updatedAt: string;
  user: User; // Add the user field
}

type Props = {
  articles: Article[] | null | undefined; // Allow null or undefined
};

const ArticleList: React.FC<Props> = ({ articles }) => {
  // Use optional chaining with fallback to empty array
  const articlesToDisplay = articles ?? [];
  const navigate = useNavigate();

  const handleDetail = (id: any, article: any): void => {
    navigate(`/detailArticle/${id}`);
    localStorage.setItem("article", JSON.stringify(article));
    console.log("article", article);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8 mt-[35px]">
      {articlesToDisplay.map((article) => (
        <Card
          key={article.id}
          className="w-full cursor-pointer hover:shadow-lg transition-shadow duration-300 flex flex-col"
          onClick={() => handleDetail(article?.documentId, article)}
        >
          <CardHeader color="white" className="relative h-56 mt-5">
            <img
              src={article.cover_image_url}
              alt={`Image for ${article.title}`}
              className="object-cover w-full h-full"
            />
          </CardHeader>
          <CardBody className="flex flex-col flex-grow">
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center">
              <Typography variant="small" color="gray" className="font-medium">
                Posted by:&nbsp;
              </Typography>
              <Typography variant="small" color="blue-gray" className="font-normal">
                {article.user.username}
              </Typography>
            </div>

            <Typography variant="h5" color="blue-gray" className="mb-2 text-lg sm:text-xl">
              {article.title}
            </Typography>
            <Typography className="text-sm sm:text-base flex-grow">
              {article.description}
            </Typography>

            <div className="flex flex-col sm:flex-row justify-between mt-4">
              <div className="mt-2">
                {/* Conditionally render the category chip */}
                {article.category?.name ? (
                  <span className="px-3 py-1 bg-[#000000] text-[#ffffff] text-sm font-medium rounded-full">
                    {article.category.name}
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                    No category
                  </span>
                )}
              </div>

              <div className="flex items-center mt-2 text-sm text-gray-600">
                <FaComments className="mr-1" /> {/* Comment icon */}
                <Typography className="text-gray-500">
                  {article.comments.length} Comments
                </Typography>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default ArticleList;