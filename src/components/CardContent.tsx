/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";

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
  category: Category | null; // Category can be null
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 cursor-pointer">
      {articlesToDisplay.map((article) => (
        <Card key={article.id} className="w-full sm:w-72 lg:w-96">
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
            <div className="mt-2">
              {/* Conditionally render the category chip */}
              {article.category?.name ? (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {article.category.name}
                </span>
              ) : (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                  No category
                </span>
              )}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default ArticleList;
