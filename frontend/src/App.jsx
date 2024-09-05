import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import Register from './components/Auth/Register';
import Verify from './components/Auth/Verify';
import SignIn from './components/Auth/SignIn';
import ForgotPassword from './components/Auth/ForgetPassword';
import UserDashboard from './pages/user/UserDashboard';
import Profile from './pages/user/Profile';
import Complaints from './pages/user/Complaints';
import GuestDetails from './pages/user/GuestDetails';
import AdminLayout from './pages/admin/AdminLayout';
import Staffs from './pages/admin/Staffs';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminGuests from './pages/admin/AdminGuest';
import AdminAnnouncement from './pages/admin/AdminAnouncement';
import { useEffect, useState } from 'react';

function useAuth() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userRole: null,
    isLoading: true
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedRole = localStorage.getItem('userRole');
        console.log('Stored token:', token);
        console.log('Stored role:', storedRole);

        if (!token) {
          console.log('No token found, not authenticated');
          setAuthState({ isAuthenticated: false, userRole: null, isLoading: false });
          return;
        }

        const response = await fetch('http://localhost:5000/api/auth/protected', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Auth check response:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('Auth check data:', data);
          
          const finalRole = storedRole || data.user.role;
          console.log('Final role:', finalRole);

          setAuthState({
            isAuthenticated: true,
            userRole: finalRole,
            isLoading: false
          });
        } else {
          console.error('Auth check failed:', response.status, response.statusText);
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          setAuthState({ isAuthenticated: false, userRole: null, isLoading: false });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setAuthState({ isAuthenticated: false, userRole: null, isLoading: false });
      }
    };

    checkAuth();
  }, []);

  return authState;
}
PublicRoute.propTypes = {
  children: PropTypes.node.isRequired
};

function PrivateRoute({ children, role }) {
  const { isAuthenticated, userRole, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  if (role && role !== userRole) {
    return <Navigate to={userRole === 'admin' ? "/admin/dashboard" : "/user/dashboard"} />;
  }

  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.string
};

function PublicRoute({ children }) {
  const { isAuthenticated, userRole, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to={userRole === 'admin' ? "/admin/dashboard" : "/user/dashboard"} />;
  }

  return children;
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired
};

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/verify" element={<PublicRoute><Verify /></PublicRoute>} />
        <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/" element={<Navigate to="/signin" />} />

        {/* Admin routes */}
        <Route path="/admin" element={<PrivateRoute role="admin"><AdminLayout /></PrivateRoute>}>
          <Route index element={<Navigate to="/admin/staffs" replace />} />
          <Route path="staffs" element={<Staffs />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="guest" element={<AdminGuests />} />
          <Route path="announcement" element={<AdminAnnouncement />} />
        </Route>

        {/* User routes */}
        <Route path="/user/dashboard" element={<PrivateRoute role="user"><UserDashboard /></PrivateRoute>}>
          <Route path="/user/dashboard/profile" element={<PrivateRoute role="user"><Profile /></PrivateRoute>} />
          <Route path="/user/dashboard/complaints" element={<PrivateRoute role="user"><Complaints /></PrivateRoute>} />
          <Route path="/user/dashboard/guest-details" element={<PrivateRoute role="user"><GuestDetails /></PrivateRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;