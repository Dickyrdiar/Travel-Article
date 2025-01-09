 
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import Input from "../../components/input";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { login } from "../../redux/autSlice";
import { useNavigate } from "react-router-dom";



const LoginPath: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error, user } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const handleLogin = () => {
    dispatch(login({ identifier: email, password }))
  }

  useEffect(() => {
    if (user) {
      navigate('/homePage')
    }
  }, [navigate, user])  


  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-[420px] mx-auto bg-white shadow-xl">
        <CardBody className="p-4 sm:p-6">
          <Typography 
            variant="h5" 
            color="blue-gray" 
            className="text-2xl sm:text-3xl font-bold text-center mb-6"
          >
            Travel Article
          </Typography>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              Failed....
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Typography className="text-base sm:text-lg font-medium mb-2">
                Email
              </Typography>
              <Input 
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <Typography className="text-base sm:text-lg font-medium mb-2">
                Password
              </Typography>
              <Input 
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </CardBody>
        
        <CardFooter className="px-4 sm:px-6 pb-6 pt-0">
          <Button 
            onClick={handleLogin} 
            color="black"
            className="w-full py-3 text-base sm:text-lg transition-all duration-200 hover:shadow-lg"
            fullWidth
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Loading...
              </div>
            ) : (
              "Login"
            )}
          </Button>

          <Typography className="text-sm sm:text-base text-center mt-4">
            Don't have an account?{" "}
            <a 
              href="/register" 
              className="underline text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              Register here
            </a>
          </Typography>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoginPath