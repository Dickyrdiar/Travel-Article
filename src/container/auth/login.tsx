 
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import Input from "../../components/input";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { login } from "../../redux/autSlice";

const LoginPath: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: RootState) => state.auth)

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const handleLogin = () => {
    dispatch(login({ identifier: email, password }))
  }


  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="bg-[#ffff] mt-6 w-96" shadow={true}>
        <CardBody className="mb-2">
          <Typography variant="h5" color="blue-gray" className="mb-2">
            Travel Article
          </Typography>

          <Typography className="text-[18px] text-start">
            Email
          </Typography>

          <Typography color="gray" className="mb-2 mt-2">
            <div className="flex flex-col gap-4">
              <Input 
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </Typography>

          <div className="mt-3">
            <Typography className="text-[18px] text-start">
              Password
            </Typography>

            <Typography color="gray" className="mb-2 mt-2">
              <div className="flex flex-col gap-4">
                <Input 
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </Typography>
          </div>
        </CardBody>
        
        <CardFooter className="pt-0">
          <Button onClick={handleLogin} color="black">
            {loading ? "Loading..." : "Login"}
          </Button>

          <Typography  className="text-[16px] mt-3 text-center">
            You dont have account please <a href="/register" className="underline">regisert</a>
          </Typography>

          {/* {error && <p className="mt-4 text-red-500">{error.message}</p>} */}
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoginPath