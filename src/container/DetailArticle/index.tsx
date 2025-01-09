import axios from "axios"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react"

interface ArticleResponse {
  cover_image_url: string
  createdAt: string
  description: string
  documentId: string
  id: number
  locale: string | null
  publishedAt: string
  title: string
  updatedAt: string
}

const DetaileArticle: React.FC = () => {
  const [detailArticle, setDetailArticle] = useState<ArticleResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { id } = useParams()
  const navigate = useNavigate()

  const fetchingDetail = async (documentId: string | undefined) => {
    const token = localStorage.getItem("token")

    try {
      setLoading(true)
      setError(null)

      const response = await axios.get(
        `https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/articles/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setDetailArticle(response.data?.data)
    } catch (error) {
      console.error("Error fetching article:", error)
      setError("Failed to fetch article. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    const token = localStorage.getItem("token")

    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this article?")
      if (confirmDelete && detailArticle) {
        setLoading(true)
        await axios.delete(
          `https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/articles/${detailArticle.documentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setError(null)
        navigate("/articles") // Redirect after successful deletion
      }
    } catch (error) {
      console.error("Error deleting article:", error)
      setError("Failed to delete article. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = () => {
    if (detailArticle) {
      // Navigate to the update page with the article ID
      navigate(`/update-article/${detailArticle.documentId}`)
    }
  }

  useEffect(() => {
    if (id) {
      fetchingDetail(id)
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-t-4 border-[#000000] border-solid rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <Typography variant="h6" color="red">
          {error}
        </Typography>
      </div>
    )
  }

  return (
    <div>
      {detailArticle ? (
        <Card className="max-w-[1080px] overflow-hidden">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 rounded-none"
          >
            <img
              src={detailArticle.cover_image_url}
              alt={detailArticle.title}
              className="w-[920px]"
            />
          </CardHeader>
          <CardBody>
            <Typography variant="h4" color="blue-gray">
              {detailArticle.title}
            </Typography>
            <Typography variant="lead" color="gray" className="mt-3 font-normal">
              {detailArticle.description}
            </Typography>
          </CardBody>
          <CardFooter className="flex items-center justify-between">
            <div className="flex items-center -space-x-3">
              <Button color="black" onClick={handleUpdate}>Update</Button>
            </div>
            <Button color="white" onClick={handleDelete}>Delete</Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="text-center py-4">
          <Typography variant="h6" color="gray">
            Article not found.
          </Typography>
        </div>
      )}
    </div>
  )
}

export default DetaileArticle
