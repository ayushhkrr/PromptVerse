import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { authAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

function BecomeSeller() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBecomeSeller = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await authAPI.becomeSeller();

      // Update user context with new role and token
      const { user, token } = response.data;
      login(user, token);

      // Show success message
      alert('Congratulations! You are now a seller. You can start creating prompts.');

      navigate('/create-prompt');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upgrade to seller');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />

      <div className="pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 sm:p-8 md:p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4"
              >
                🚀
              </motion.div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                Become a Seller
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-blue-100">
                Start earning by selling your prompts
              </p>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 md:p-12">
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-6 sm:mb-8 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start space-x-3 sm:space-x-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-xl sm:text-2xl">✨</span>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">
                      Create and List Prompts
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Design powerful AI prompts and list them on our marketplace for others to discover and purchase.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Earn Money
                    </h3>
                    <p className="text-gray-600">
                      Set your own prices and earn revenue every time someone purchases your prompts.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Track Performance
                    </h3>
                    <p className="text-gray-600">
                      Monitor your sales, manage your listings, and optimize your prompts for better performance.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Reach Global Audience
                    </h3>
                    <p className="text-gray-600">
                      Your prompts will be available to buyers worldwide, maximizing your earning potential.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBecomeSeller}
                  disabled={loading}
                  className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg sm:text-xl font-bold rounded-lg sm:rounded-xl shadow-2xl hover:shadow-3xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Become a Seller Now'}
                </motion.button>
                <p className="text-gray-500 text-xs sm:text-sm mt-3 sm:mt-4 px-4">
                  Free to join • No monthly fees • Start selling immediately
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default BecomeSeller;
