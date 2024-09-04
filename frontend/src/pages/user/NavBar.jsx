import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaKey } from 'react-icons/fa';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  const handleResetPassword = () => {
    // Close the dropdown
    setDropdownOpen(false);
    // Navigate to the reset password page
    navigate('/forgot-password', { state: { fromNavbar: true } });
  };

  return (
    <nav className="bg-[#252525] text-white p-4 border-b border-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/user/dashboard" className="text-xl font-bold">
          BIT Staff Quarters Portal
        </Link>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center bg-white text-black py-2 px-2 focus:outline-none hover:text-gray-300"
            style={{ borderRadius: '15px' }}  // or any pixel value you prefer
          >
            <FaUser className="mr-2" />
            <span className="hidden md:inline">Account</span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 z-10">
              <button
                onClick={handleResetPassword}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center"
              >
                <FaKey className="mr-2" />
                Reset Password
              </button>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center"
              >
                <FaSignOutAlt className="mr-2" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;