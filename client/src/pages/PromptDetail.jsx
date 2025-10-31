import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { promptAPI, orderAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

function PromptDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [prompt, setPrompt] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchPromptPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPromptPreview = async () => {
    try {
      setLoading(true);
      const response = await promptAPI.getPromptPreview(id);
      setPrompt(response.data.prompt);
      setPreview(response.data.preview);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch prompt details');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setPurchasing(true);
      const response = await orderAPI.createCheckout(id);
      window.location.href = response.data.url;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate purchase');
    } finally {
      setPurchasing(false);
    }
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

  if (error || !prompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Navbar />
        <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
          >
            {error || 'Prompt not found'}
          </motion.div>
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
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Image/Preview */}
              <div className="p-8">
                <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
                  {prompt.thumbnail?.url ? (
                    <img
                      src={prompt.thumbnail.url}
                      alt={prompt.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white text-9xl font-bold opacity-50">
                        {prompt.title[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      {prompt.promptType}
                    </span>
                  </div>
                </div>

                {/* Preview Output */}
                {preview && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl"
                  >
                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                      Preview Output
                    </h3>
                    {prompt.promptType === 'image' && preview.imageUrl ? (
                      <img
                        src={preview.imageUrl}
                        alt="Preview"
                        className="w-full rounded-lg shadow-lg"
                      />
                    ) : (
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {preview.text || preview}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Right Side - Details */}
              <div className="p-8">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    {prompt.title}
                  </h1>

                  <div className="flex items-center space-x-4 mb-6">
                    <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ${prompt.price}
                    </span>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      <span>{prompt.purchaseCount || 0} purchases</span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                    {prompt.description}
                  </p>

                  {/* Tags */}
                  {prompt.tags && prompt.tags.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {prompt.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-lg text-sm font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sample Input */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                      Sample Input
                    </h3>
                    <p className="text-gray-700 font-mono text-sm">
                      {prompt.sampleInput}
                    </p>
                  </div>

                  {/* Purchase Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePurchase}
                    disabled={purchasing}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-2xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {purchasing ? 'Processing...' : 'Purchase Now'}
                  </motion.button>

                  {!isAuthenticated && (
                    <p className="text-center text-sm text-gray-500 mt-4">
                      You need to login to purchase this prompt
                    </p>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default PromptDetail;
