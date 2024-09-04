import { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage(response.data.message);
      setStep(2);
    } catch (error) { 
      setMessage(error.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending request with:', { email, code });
      const response = await axios.post('http://localhost:5000/api/auth/verify-reset-code', { 
        email, 
        code
      });
      console.log('Response:', response.data);
      setMessage(response.data.message);
      setStep(3);
    } catch (error) {
      console.error('Error:', error.response?.data);
      setMessage(error.response?.data?.error || 'Invalid code. Please try again.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', { email, code, newPassword });
      setMessage(response.data.message);
      window.location.href = `/signin`
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Forgot Password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-black py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {step === 1 && (
            <form className="space-y-6" onSubmit={handleSendCode}>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-[#292929] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Send Code
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-6" onSubmit={handleVerifyCode}>
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-400">
                  Verification Code
                </label>
                <div className="mt-1">
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    className="appearance-none text-white bg-[#232323] block w-full px-3 py-2 border hover:bg-[#292929] border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-indigo-500 sm:text-sm"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-[#292929] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Verify Code
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-400">
                  New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    className="appearance-none text-white bg-[#232323] block w-full px-3 py-2 border hover:bg-[#292929] border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-indigo-500 sm:text-sm"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                  Reset Password
                </button>
              </div>
            </form>
          )}

          {message && (
            <div className="mt-4 text-center text-sm text-white">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;