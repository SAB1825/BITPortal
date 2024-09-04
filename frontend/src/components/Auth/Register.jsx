import { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      console.log('Registration successful:', response.data);
      toast.success(response.data.message);
      setTimeout(() => {
        window.location.href = `/verify?email=${encodeURIComponent(formData.email)}`;
      }, 2000);
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Registration failed. Please try again.');
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/signin" className="absolute top-4 left-4 bg-white hover:bg-black font-bold text-black hover:text-white rounded-lg py-2 px-2">
          <FaArrowLeft className="inline mr-2" />
          Back to Sign In
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Create Your Account!
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-black py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6 " onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-400">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none text-white bg-[#232323] block w-full px-3 py-2 border hover:bg-[#292929] border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-indigo-500 sm:text-sm"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none text-white bg-[#232323] block w-full px-3 py-2 border hover:bg-[#292929] border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-indigo-500 sm:text-sm"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="appearance-none text-white bg-[#232323] block w-full px-3 py-2 border hover:bg-[#292929] border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-indigo-500 sm:text-sm"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-[#292929] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
