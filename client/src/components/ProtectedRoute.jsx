import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children, requireAuth = true, requireRole = null }) {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Check authentication
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role requirement
  if (requireRole) {
    if (Array.isArray(requireRole)) {
      // If requireRole is an array, check if user has one of the roles
      if (!requireRole.includes(user?.role)) {
        return <Navigate to="/" replace />;
      }
    } else {
      // If requireRole is a string, check exact match
      if (user?.role !== requireRole) {
        return <Navigate to="/" replace />;
      }
    }
  }

  return children;
}

export default ProtectedRoute;
