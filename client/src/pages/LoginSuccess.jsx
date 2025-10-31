import { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
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
          email: payload.email,
          fullName: payload.fullName,
          username: payload.username,
          role: payload.role,
          isSeller: payload.isSeller
        };

        // Save token and user
        login(user, token);

        // Redirect to home page
        setTimeout(() => {
          navigate('/home');
        }, 1000);
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
    <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
      {/* Animated Blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="backdrop-blur-md bg-white/80 border border-gray-200 rounded-3xl shadow-xl p-12 text-center relative z-10"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-6 border-4 border-purple-500 border-t-transparent rounded-full"
        />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Success!</h1>
        <p className="text-gray-600">Logging you in...</p>
      </motion.div>
    </div>
  );
}

export default LoginSuccess;
