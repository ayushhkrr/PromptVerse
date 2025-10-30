import { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function LoginSuccess() {
  const [searchParams] = useSearchParams();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Decode the JWT to get user info (basic decode without verification)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = {
          _id: payload.id,
          role: payload.role
        };

        // Save token and user
        login(user, token);

        // Redirect to home
        navigate('/');
      } catch (error) {
        console.error('Failed to process token:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-800">Logging you in...</h1>
      </div>
    </div>
  );
}

export default LoginSuccess;
