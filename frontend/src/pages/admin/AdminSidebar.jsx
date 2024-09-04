import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  const menuItems = [
    { name: 'Staffs', path: '/admin/staffs' },
    { name: 'Complaints', path: '/admin/complaints' },
    { name: 'Workers', path: '/admin/workers' },
  ];

  return (
    <div className="bg-[#212121] text-white w-64 min-h-screen p-4">
      <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>
      <nav>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="mb-4">
              <Link
                to={item.path}
                className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors duration-200"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;