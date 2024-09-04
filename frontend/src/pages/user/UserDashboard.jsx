import { Outlet } from 'react-router-dom';
import UserSidebar from './UserSidebar';
import Navbar from './NavBar';

const UserDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      
      <div className="flex flex-1">
        <UserSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
