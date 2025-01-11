import React, { useState, useEffect } from 'react';
import { Typography } from '@material-tailwind/react';
import Input from '../../components/input';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { registerUser } from '../../redux/registerSlice';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user } = useSelector((state: RootState) => state.authRegis);
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  // State untuk error validasi
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validasi form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!username) {
      newErrors.username = 'Username is required';
    }
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!email.includes('@') || !email.includes('.com')) {
      newErrors.email = 'Email must contain "@" and ".com"';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true jika tidak ada error
  };

  // Reset error ketika field diubah
  const handleInputChange = (field: string, value: string) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    if (field === 'username') setUsername(value);
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
  };

  // Simple boolean validation
  const isFormValid = Boolean(username && email && password);
  console.log("error", error)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validasi form sebelum submit
    if (!validateForm()) return;

    dispatch(registerUser({ username, email, password }));
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [navigate, user]);

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

          {/* Tampilkan error dari API */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            {/* Username Field */}
            <div className="flex flex-col space-y-2">
              <Input
                placeholder="Username"
                className={`w-full ${errors.username ? 'border-red-500' : ''}`}
                value={username}
                onChange={(e) => handleInputChange('username', e.target.value)}
              />
              {errors.username && (
                <Typography variant="small" color="red" className="text-sm">
                  {errors.username}
                </Typography>
              )}
            </div>

            {/* Email Field */}
            <div className="flex flex-col space-y-2">
              <Input
                placeholder="Email"
                type="email"
                className={`w-full ${errors.email ? 'border-red-500' : ''}`}
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              {errors.email && (
                <Typography variant="small" color="red" className="text-sm">
                  {errors.email}
                </Typography>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col space-y-2">
              <Input
                placeholder="Password"
                type="password"
                className={`w-full ${errors.password ? 'border-red-500' : ''}`}
                value={password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
              {errors.password && (
                <Typography variant="small" color="red" className="text-sm">
                  {errors.password}
                </Typography>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || loading} // Disable if form is invalid or loading
              className={`w-full py-3 px-4 rounded-md transition-colors duration-200 ${
                !isFormValid || loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {loading ? 'Loading...' : 'Register'}
            </button>
          </form>

          <Typography className="text-sm sm:text-base text-center mt-4">
            You have an account?{' '}
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
            Travel Article
          </span>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mt-4">
            Find your destination to travel
          </h2>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;