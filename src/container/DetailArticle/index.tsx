import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Textarea,
} from "@material-tailwind/react";
import { ConfirmationDialog } from "../../components/Modal";

interface ArticleResponse {
  cover_image_url: string;
  createdAt: string;
  description: string;
  documentId: string;
  id: number;
  locale: string | null;
  publishedAt: string;
  title: string;
  updatedAt: string;
}

interface CommentResponse {
  id: number;
  documentId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const DetaileArticle: React.FC = () => {
  const [detailArticle, setDetailArticle] = useState<ArticleResponse | null>(null);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorComment, setErrorComment] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState<string>(""); // State for comment input
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchingDetail = async (documentId: string | undefined) => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/articles/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDetailArticle(response.data?.data);
    } catch (error) {
      console.error("Error fetching article:", error);
      setError("Failed to fetch article. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchingComments = async (documentId: string | undefined) => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/comments/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments(response.data?.data || []); // Ensure comments is an array even if data is undefined
    } catch (error) {
      console.error("Error fetching comments:", error);
      setErrorComment("Failed to fetch comments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async () => {
    const token = localStorage.getItem("token");
  
    if (!commentContent || !commentContent.trim()) {
      setErrorComment("Comment cannot be empty.");
      return;
    }
  
    if (!detailArticle) {
      setErrorComment("Article not found. Cannot post comment.");
      return;
    }
  
    try {
      setLoading(true);
      setErrorComment(null);
  
      const response = await axios.post(
        `https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/comments`,
        {
          article: detailArticle.id, 
          content: commentContent.trim(), 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      await fetchingComments(id); 
      setCommentContent(""); //
      console.log("response", response);
    } catch (error) {
      console.error("Error posting comment:", error);
      setErrorComment("Failed to post comment. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    try {
      if (detailArticle) {
        setLoading(true);
        await axios.delete(
          `https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/articles/${detailArticle.documentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setError(null);
        navigate("/homePage"); 
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      setError("Failed to delete article. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    if (detailArticle) {
      navigate(`/update-article/${detailArticle.documentId}`);
    }
  };

  useEffect(() => {
    if (id) {
      fetchingDetail(id);
      fetchingComments(id);
    }
  }, [id]);

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
    <div className="p-4">
      {detailArticle ? (
        <Card className="max-w-full mx-auto overflow-hidden">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 rounded-none"
          >
            <img
              src={detailArticle.cover_image_url}
              alt={detailArticle.title}
              className="w-full h-auto md:h-[400px] object-cover"
            />
          </CardHeader>
          <CardBody>
            <Typography variant="h4" color="blue-gray" className="mb-4">
              {detailArticle.title}
            </Typography>
            <Typography variant="lead" color="gray" className="font-normal">
              {detailArticle.description}
            </Typography>
          </CardBody>
          <CardFooter className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex gap-2">
              <Button color="black" onClick={handleUpdate}>
                Update
              </Button>
              <Button color="white" onClick={() => setOpen(!open)}>
                Delete
              </Button>
            </div>
          </CardFooter>

          {/* Horizontal Line */}
          <hr className="my-4 border-gray-700" />

          {/* Comments Section */}
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-4">
              Comments
            </Typography>

            {/* Comment Input Form */}
            <div className="mt-4">
              <Textarea
                label="Write a comment..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="w-full"
              />
              <Button
                color="black"
                className="mt-2 w-full md:w-auto"
                onClick={handlePostComment}
                disabled={loading}
              >
                {loading ? "Posting..." : "Post Comment"}
              </Button>
            </div>

            {/* Display Comments */}
            {errorComment ? (
              <div className="text-center py-4">
                <Typography variant="h6" color="red">
                  {errorComment}
                </Typography>
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="mt-4">
                  <Typography variant="small" color="gray" className="font-normal">
                    {comment.content}
                  </Typography>
                  <Typography variant="small" color="gray" className="font-light">
                    {new Date(comment.createdAt).toLocaleString()}
                  </Typography>
                </div>
              ))
            ) : (
              <Typography variant="small" color="gray" className="font-normal">
                No comments yet.
              </Typography>
            )}
          </CardBody>
        </Card>
      ) : (
        <div className="text-center py-4">
          <Typography variant="h6" color="gray">
            Article not found.
          </Typography>
        </div>
      )}

      <ConfirmationDialog
        open={open}
        onClose={() => setOpen(!open)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default DetaileArticle;