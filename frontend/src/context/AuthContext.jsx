import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
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

  const login = (token, userRole) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', userRole);
    setAuthState({
      isAuthenticated: true,
      userRole: userRole,
      isLoading: false
    });
  };
  AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setAuthState({
      isAuthenticated: false,
      userRole: null,
      isLoading: false
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
