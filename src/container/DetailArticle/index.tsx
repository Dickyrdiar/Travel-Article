/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const [commentContent, setCommentContent] = useState<string>("");
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState<string>("");
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

  const fetchingComment = async (documentId: string) => {
    const url = `https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/comments/${documentId}`;
    const token = localStorage.getItem('token');

    try {
      setLoading(true);
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      console.log("response", response);
    } catch (error) {
      console.log(error);
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
          data: {
            article: detailArticle.id,
            content: commentContent.trim(),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchingComment(detailArticle.documentId);
      setCommentContent("");
      setComments(response?.data?.data);
      navigate('/homePage');
      console.log("response", response);
    } catch (error) {
      console.error("Error posting comment:", error);
      setErrorComment("Failed to post comment. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const token = localStorage.getItem("token");

    if (!commentId) {
      setErrorComment("Invalid comment ID.");
      return;
    }

    try {
      setLoading(true);
      setErrorComment(null);

      await axios.delete(
        `https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (detailArticle?.documentId) {
        await fetchingComment(detailArticle.documentId);
      }
      navigate('/homePage');
      console.log("fine");
    } catch (error) {
      console.error("Error deleting comment:", error);
      setErrorComment("Failed to delete comment. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateComment = async (commentId: number, newContent: string) => {
    const token = localStorage.getItem("token");

    if (!commentId || !newContent.trim()) {
      setErrorComment("Invalid comment ID or content.");
      return;
    }

    try {
      setLoading(true);
      setErrorComment(null);

      await axios.put(
        `https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/comments/${commentId}`,
        {
          data: {
            content: newContent.trim(),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (detailArticle?.documentId) {
        await fetchingComment(detailArticle.documentId);
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      setErrorComment("Failed to update comment. Please try again later.");
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
      navigate(`/updateArticle/${detailArticle.documentId}`);
    }
  };

  useEffect(() => {
    if (id) {
      fetchingDetail(id);
    }
  }, [id]);

  useEffect(() => {
    if (detailArticle?.documentId) {
      fetchingComment(detailArticle.documentId);
    }
  }, [detailArticle?.documentId]);

  console.log("comment", comments);

  const article = JSON.parse(localStorage.getItem("article") ?? "null");
  console.log("article in detail", article?.comments);

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
    <div className="p-4 w-full max-w-4xl mx-auto"> {/* Responsive container */}
      {detailArticle ? (
        <Card className="w-full overflow-hidden">
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
          <CardBody className="w-full">
            <Typography variant="h4" color="blue-gray" className="mb-4">
              {detailArticle.title}
            </Typography>
            <Typography variant="lead" color="gray" className="font-normal">
              {detailArticle.description}
            </Typography>
          </CardBody>
          <CardFooter className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            <div className="flex gap-2">
              <Button color="black" onClick={handleUpdate}>
                Update
              </Button>
              <Button color="white" onClick={() => setOpen(!open)}>
                Delete
              </Button>
            </div>
          </CardFooter>

          <hr className="my-4 border-gray-700 w-full" />

          <CardBody className="w-full">
            <Typography variant="h5" color="blue-gray" className="mb-4">
              Comments
            </Typography>

            <div className="mt-4 w-full">
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

            {errorComment ? (
              <div className="text-center py-4">
                <Typography variant="h6" color="red">
                  {errorComment}
                </Typography>
              </div>
            ) : article?.comments && article.comments.length > 0 ? (
              article?.comments?.map((comment: any) => (
                <div key={comment.id} className="mt-4 w-full">
                  {editCommentId === comment.id ? (
                    <div className="w-full">
                      <Textarea
                        label="Edit your comment..."
                        value={editCommentContent}
                        onChange={(e) => setEditCommentContent(e.target.value)}
                        className="w-full"
                      />
                      <Button
                        color="black"
                        className="mt-2 w-full md:w-auto"
                        onClick={() => {
                          handleUpdateComment(comment.id, editCommentContent);
                          setEditCommentId(null);
                        }}
                        disabled={loading}
                      >
                        {loading ? "Updating..." : "Update Comment"}
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full">
                      <Typography variant="small" color="gray" className="font-normal text-left">
                        {comment.content}
                      </Typography>
                      <Typography variant="small" color="gray" className="font-light text-left">
                        {new Date(comment.createdAt).toLocaleString()}
                      </Typography>
                      <div className="flex gap-2 mt-2">
                        <Typography
                          as="span"
                          variant="small"
                          color="black"
                          className="font-normal cursor-pointer hover:underline"
                          onClick={() => handleDeleteComment(comment?.documentId)}
                        >
                          Delete
                        </Typography>
                        <Typography
                          as="span"
                          variant="small"
                          color="black"
                          className="font-normal cursor-pointer hover:underline"
                          onClick={() => {
                            setEditCommentId(comment.id);
                            setEditCommentContent(comment.content);
                          }}
                        >
                          Edit
                        </Typography>
                      </div>
                    </div>
                  )}
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