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

type Props = {
  articles: Article[] | null | undefined; // Allow null or undefined
};

const ArticleList: React.FC<Props> = ({ articles }) => {
  // Use optional chaining with fallback to empty array
  const articlesToDisplay = articles ?? [];
  const navigate = useNavigate();

  const handleDetail = (id: any, article: any): void => {
    navigate(`/detail-article/${id}`);
    localStorage.setItem("article", JSON.stringify(article))
    console.log("article", article)
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {articlesToDisplay.map((article) => (
        <Card
          key={article.id}
          className="w-full sm:w-72 lg:w-96 cursor-pointer"
          onClick={() => handleDetail(article?.documentId, article)}
        >
          <CardHeader color="white" className="relative h-56 mt-[12px]">
            <img
              src={article.cover_image_url}
              alt={`Image for ${article.title}`}
              className="object-cover w-full h-full mt-6"
            />
          </CardHeader>
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              {article.title}
            </Typography>
            <Typography>{article.description}</Typography>
            <div className="flex justify-between">
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
