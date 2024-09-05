import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Navbar from './AdminNavbar';
import { checkPropTypes } from 'prop-types';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex flex-col w-full min-h-screen" style={{
      background: 'linear-gradient(to bottom left, #000000 0%, #000000 35%, #3B1717 100%)'
    }}>
      <Navbar />
      
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="w-px bg-gray-600"></div>
        <main className="flex-1 p-6 overflow-auto w-full">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
AdminLayout.propTypes = {
  children: checkPropTypes.node,
};
export default AdminLayout;
