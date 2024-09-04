import Sidebar from '../pages/user/UserSidebar';
import PropTypes from 'prop-types';
const Layout = ({ children }) => {
  return (
    <div className="flex bg-black">
      <Sidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
};
Layout.propTypes = {
    children: PropTypes.node.isRequired,
  };

export default Layout;