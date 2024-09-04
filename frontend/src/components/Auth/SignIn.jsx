import  { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    console.log('SignIn component mounted');
    // Check if user is already authenticated
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token found in localStorage, redirecting...');
      navigate('/admin/dashboard'); // or '/admin/dashboard' depending on the user role
    }
    return () => {
      console.log('SignIn component unmounted');
    };
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    console.log(`Form data updated: ${name} = ${value}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signin', formData);
      console.log('Login response:', response.data);
      
      const token = response.data.token;
      const userRole = response.data.user.role;
      
      console.log('Token:', token);
      console.log('User role:', userRole);
      
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', userRole);
      
      console.log('Stored in localStorage - token:', localStorage.getItem('token'));
      console.log('Stored in localStorage - userRole:', localStorage.getItem('userRole'));
      
      toast.success('Login successful!');
      
      const redirectPath = userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard';
      console.log(`Redirecting to ${redirectPath} in 2 seconds...`);
      
      setTimeout(() => {
        navigate(redirectPath);
      }, 2000);
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  console.log('Rendering SignIn component');

  return (
    <div className="min-h-screen bg-black flex flex-col  justify-center py-12 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-black py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400">
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none text-white bg-[#232323] block w-full px-3 py-2 border hover:bg-[#292929] border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-indigo-500 sm:text-sm"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                  New User?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center  border border-transparent  shadow-sm text-sm bg-white hover:bg-black font-bold text-black hover:text-white rounded-lg py-2 px-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
