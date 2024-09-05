import { Outlet } from 'react-router-dom';
import UserSidebar from './UserSidebar';
import Navbar from './NavBar';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col w-full min-h-screen " style={{
      background: 'linear-gradient(to bottom left, #000000 0%, #000000 35%, #3B1717 100%)'
    }}>
      <Navbar />
      
      <div className="flex flex-1">
        <UserSidebar />
        <div className="w-px bg-gray-600"></div>        <main className="flex-1 p-6 overflow-auto w-full" >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
