/* eslint-disable @typescript-eslint/no-explicit-any */
 
import axios from "axios";
import { useEffect, useState } from "react";
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
  const [selectedCategory, setSelectedCategory] = useState<number>(2); // Default selected category
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]); // State to store fetched categories
  const [imageFile, setImageFile] = useState<File | null>(null); // State to store the selected image file

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch categories from the API
    axios
      .get("https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response?.data?.data, "response");
        setCategories(response?.data?.data); // Store fetched categories in state
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
      });
  }, [token]);

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
      const response = await axios.post(
        "https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/articles",
        articleData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Article created successfully:", response.data);
    } catch (error) {
      console.error("There was an error creating the article!", error);
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
          Create Article
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

          {/* Image Upload */}
         

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
            Submit
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default CreateArticle;