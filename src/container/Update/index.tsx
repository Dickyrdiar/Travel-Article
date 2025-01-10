/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Textarea,
} from "@material-tailwind/react";
import Input from "../../components/input";

const UpdateArticle: React.FC = () => {
  const { id } = useParams(); // Get the article ID from the URL
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<number>(2); // Default selected category
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]); // State to store fetched categories
  const [imageFile, setImageFile] = useState<File | null>(null); // State to store the selected image file
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  // Fetch the article data and categories when the component mounts
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the article data
        const articleResponse = await axios.get(
          `https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/articles/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const articleData = articleResponse.data?.data;
        setTitle(articleData.title);
        setDescription(articleData.description);
        setCoverImageUrl(articleData.cover_image_url);
        setSelectedCategory(articleData.category?.id || 2);

        // Fetch categories
        const categoriesResponse = await axios.get(
          "https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCategories(categoriesResponse.data?.data);
      } catch (error) {
        console.error("Error fetching article or categories:", error);
        setError("Failed to fetch article or categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, token]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file); // Store the selected file in state
      setCoverImageUrl(URL.createObjectURL(file)); // Preview the image (optional)
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    let imageUrl = coverImageUrl;

    // If an image file is selected, upload it to the server
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      try {
        const uploadResponse = await axios.post(
          "https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/upload", // Replace with your image upload endpoint
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imageUrl = uploadResponse.data.url; // Assuming the response contains the image URL
      } catch (error) {
        console.error("There was an error uploading the image!", error);
        return;
      }
    }

    const articleData = {
      data: {
        title: title,
        description: description,
        cover_image_url: imageUrl, // Use the uploaded image URL
        category: selectedCategory.toString(), // Use the selected category
      },
    };

    try {
      const response = await axios.put(
        `https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/articles/${id}`,
        articleData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Article updated successfully:", response.data);
      navigate("/homePage"); // Redirect to the home page after successful update
    } catch (error) {
      console.error("There was an error updating the article!", error);
      setError("Failed to update the article. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-t-4 border-[#000000] border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <Typography variant="h6" color="red">
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <Card className="max-w-full w-[1080px] h-screen mx-auto overflow-hidden">
      <CardHeader
        variant="gradient"
        color="white"
        className="mt-4 grid h-28 place-items-start border-none"
        floated={false}
        shadow={false}
      >
        <Typography variant="h3" color="black">
          Update Article
        </Typography>
      </CardHeader>
      <CardBody className="flex flex-col gap-4 mt-[-30px]">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between gap-4 w-[100%]">
            <div className="w-[50%]">
              <Typography className="text-md text-left font-bold p-4 text-text-primary">
                Title
              </Typography>
              <Input
                size="medium"
                value={title}
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="mt-4 w-[50%] h-[20%]">
              <Typography className="text-md text-left font-bold text-text-primary">
                Cover Image
              </Typography>
              <div className="mt-2 flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                {coverImageUrl ? (
                  <div className="relative">
                    <img
                      src={coverImageUrl}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-md"
                    />
                    <button
                      onClick={() => setCoverImageUrl("")}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <label className="cursor-pointer">
                      <span className="text-[#000000] font-semibold">Select and Upload image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-[40px]">
            <Typography className="text-md text-left font-bold p-4 text-text-primary">
              Description
            </Typography>
            <Textarea
              size="lg"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-[100px]" // Adjusted height
              required
            />
          </div>

          {/* Category Dropdown */}
          <div className="mt-[20px]">
            <Typography className="text-md text-left font-bold p-4 text-text-primary">
              Category
            </Typography>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(Number(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-800  sm:text-sm"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} {/* Assuming the category name is in `attributes.name` */}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" variant="gradient" fullWidth className="mt-4 w-[90px]">
            Update
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default UpdateArticle;