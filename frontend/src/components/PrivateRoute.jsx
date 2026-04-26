import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, roles }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // If route requires a specific role and user doesn't have it, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;
