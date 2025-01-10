/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Textarea,
} from "@material-tailwind/react";
import Input from "../../components/input";

const CreateArticle: React.FC = () => {
  const { id } = useParams(); // Get the article ID from the URL (if in edit mode)
  const [selectedCategory, setSelectedCategory] = useState<number>(2);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false); // State to check if in edit mode

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Cloudinary configuration
  const cloudName = "dr6grbo0p";
  const apiKey = "194188655976336";
  const uploadPreset = "ml_default";

  useEffect(() => {
    // Fetch categories from the API
    axios
      .get("https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCategories(response?.data?.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
      });

    // If in edit mode, fetch the existing article data
    if (id) {
      setIsEditMode(true);
      axios
        .get(`https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/articles/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const article = response.data.data;
          setTitle(article.attributes.title);
          setDescription(article.attributes.description);
          setCoverImageUrl(article.attributes.cover_image_url);
          setSelectedCategory(article.attributes.category.id);
        })
        .catch((error) => {
          console.error("There was an error fetching the article!", error);
        });
    }
  }, [token, id]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setCoverImageUrl(URL.createObjectURL(file));
    }
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("api_key", apiKey);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName) {
      alert("Please enter a category name.");
      return;
    }

    try {
      const response = await axios.post(
        "https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/categories",
        {
          data: {
            name: newCategoryName,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newCategory = response.data.data;
      setCategories([...categories, newCategory]);
      setSelectedCategory(newCategory.id);
      setShowNewCategoryInput(false);
      setNewCategoryName("");
    } catch (error) {
      console.error("There was an error creating the category!", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // Reset error state before submission

    // Validate required fields
    if (!title || !description) {
      setError("Please fill in all required fields.");
      return;
    }

    let imageUrl = coverImageUrl; // Use existing image URL if no new file is selected

    try {
      // Upload new image to Cloudinary if a file is selected
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
        console.log("Image uploaded successfully. URL:", imageUrl);
      }

      // Prepare article data
      const articleData = {
        data: {
          title: title,
          description: description,
          cover_image_url: imageUrl,
          category: selectedCategory.toString(),
        },
      };

      // Determine if we're creating or updating an article
      if (isEditMode && id) {
        // Update existing article
        await axios.put(
          `https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/articles/${id}`,
          articleData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Article updated successfully");
      } else {
        // Create new article
        await axios.post(
          "https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/articles",
          articleData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Article created successfully");
      }

      navigate("/homePage"); // Redirect to homepage after successful creation/update
    } catch (error: any) {
      // Handle API errors
      if (error.response) {
        setError(`Error: ${error.response.data.message || "Failed to save article."}`);
      } else if (error.request) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("There was an error saving the article!", error);
    }
  };

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
          {isEditMode ? "Edit Article" : "Create Article"}
        </Typography>
      </CardHeader>
      <CardBody className="flex flex-col gap-4 mt-[-30px]">
        {/* Display error message if there's an error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

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
              className="h-[100px]"
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
              onChange={(e) => {
                if (e.target.value === "new") {
                  setShowNewCategoryInput(true);
                } else {
                  setSelectedCategory(Number(e.target.value));
                  setShowNewCategoryInput(false);
                }
              }}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-800 sm:text-sm"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
              <option value="new">Add New Category</option>
            </select>

            {showNewCategoryInput && (
              <div className="mt-2">
                <Input
                  size="medium"
                  value={newCategoryName}
                  placeholder="New Category Name"
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <Button
                  onClick={handleCreateCategory}
                  variant="gradient"
                  className="mt-2"
                >
                  Add Category
                </Button>
              </div>
            )}
          </div>

          <Button type="submit" variant="gradient" fullWidth className="mt-4 w-[90px]">
            {isEditMode ? "Update" : "Submit"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default CreateArticle;