import { Typography } from '@material-tailwind/react'
import React, { useState } from 'react'
import Input from '../../components/input'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { registerUser } from '../../redux/registerSlice'


const RegisterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error, user } = useSelector((state: RootState) => state.authRegis)

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [username, setUsername] = useState<string>("")

  console.log("user", user)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(registerUser({ username, email, password }))
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 bg-white p-4 lg:p-8">
        <div className="w-full max-w-md">
          <Typography 
            variant="h1" 
            className="text-2xl lg:text-3xl font-bold mb-2 text-center lg:text-left"
          >
            Welcome 👋
          </Typography>
          
          <Typography className="text-gray-600 mb-4 text-center lg:text-left">
            Silakan masuk untuk mengakses akun Anda.
          </Typography>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="flex flex-col space-y-2">
              <Input 
                placeholder="Username"
                className="w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Input 
                placeholder="Email"
                type="email"
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Input 
                placeholder="Password"
                type="password"
                className="w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-md transition-colors duration-200 ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {loading ? 'Loading...' : 'Register'}
            </button>
          </form>

          <Typography className="text-sm sm:text-base text-center mt-4">
            You have an account?{" "}
            <a 
              href="/" 
              className="underline text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              Login here
            </a>
          </Typography>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden lg:flex justify-center items-center w-full lg:w-1/2 bg-gradient-to-r from-gray-400 to-black p-4 lg:p-8">
        <div className="text-white text-center max-w-lg">
          <span className="bg-white text-gray-800 px-4 py-2 rounded-full mb-4 inline-block text-sm lg:text-base">
            Traver Article
          </span>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mt-4">
            Find your destination to travel
          </h2>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage