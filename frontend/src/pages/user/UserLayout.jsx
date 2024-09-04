import { Outlet } from 'react-router-dom';
import UserSidebar from "./UserSidebar"

const UserLayout = () => {
  return (
    <div className="user-dashboard bg-black">
      <UserSidebar />
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  )
}

export default UserLayout;