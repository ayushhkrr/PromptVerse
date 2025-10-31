import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { orderAPI } from '../services/api';

function MyPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPurchases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyPurchases();
      setPurchases(response.data.prompts || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch purchases');
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Prompt copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Navbar />
        <div className="pt-24 flex justify-center items-center h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Purchases
            </h1>
            <p className="text-gray-600 mt-2">
              Access all your purchased prompts
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8"
            >
              {error}
            </motion.div>
          )}

          {purchases.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-lg p-12 text-center"
            >
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No purchases yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start exploring our marketplace to find amazing prompts
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg"
              >
                Browse Prompts
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {purchases.map((prompt, index) => (
                <motion.div
                  key={prompt._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Thumbnail */}
                    <div className="md:w-64 h-48 md:h-auto bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0">
                      {prompt.thumbnail?.url ? (
                        <img
                          src={prompt.thumbnail.url}
                          alt={prompt.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white text-6xl font-bold opacity-50">
                            {prompt.title[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            {prompt.title}
                          </h3>
                          <p className="text-gray-600">
                            {prompt.description}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold whitespace-nowrap ml-4">
                          Purchased
                        </span>
                      </div>

                      {/* Tags */}
                      {prompt.tags && prompt.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {prompt.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs rounded-lg"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Prompt Body */}
                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-semibold text-gray-600 uppercase">
                            Full Prompt
                          </h4>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => copyToClipboard(prompt.body)}
                            className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Copy
                          </motion.button>
                        </div>
                        <p className="text-gray-700 font-mono text-sm whitespace-pre-wrap max-h-32 overflow-y-auto">
                          {prompt.body}
                        </p>
                      </div>

                      {/* Type Badge */}
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold uppercase">
                          {prompt.promptType}
                        </span>
                        <span className="text-gray-500 text-sm">
                          Type: {prompt.promptType === 'text' ? 'Text Generation' : 'Image Generation'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyPurchases;
