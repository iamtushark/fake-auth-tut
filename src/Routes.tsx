import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getLoggedInUserInfo } from './utils/dbOperations/dbOperations';
import { CircularProgress, Container } from '@mui/material';
import { userInfo } from './utils/dbOperations/interfaces';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './Screens/Signup/Index';
import UsersListPage from './Screens/UserList/Index';
import LoginPage from './Screens/Login/Index';
import { AuthProvider, useAuthDispatch , logoutAction} from './Contexts/AuthContext/Context';
import ProfilePage from './Screens/Profile/Index';
import Navbar from './Components/Navbar';

interface AsyncPrivateRouteProps {
  children: JSX.Element;
}

const AsyncPrivateRoute: React.FC<AsyncPrivateRouteProps> = ({ children}) => {
  const { id: pathId } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; userInfo: userInfo; authLevel: 'admin' | 'users' } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await getLoggedInUserInfo();
        setUser(userInfo);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.authLevel!= "admin" && user.id !== pathId) {
    logoutAction(useAuthDispatch())
    return <Navigate to="/login" />;
  }

  return children;
};


const RoutesComponent: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
      <Navbar/>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/user-list"
            element={
              <AsyncPrivateRoute>
                <UsersListPage />
              </AsyncPrivateRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <AsyncPrivateRoute>
                <ProfilePage />
              </AsyncPrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default RoutesComponent;