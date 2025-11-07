import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { promptAPI, orderAPI } from '../services/api';
import Navbar from '../components/Navbar';

function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('');
  const [purchasingId, setPurchasingId] = useState(null);

  const tags = ['All', 'ChatGPT', 'DALL-E', 'Writing', 'Coding', 'Marketing', 'Design'];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    fetchPrompts();
  }, [selectedTag]);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const response = await promptAPI.getAllPrompts(1, 20, selectedTag === 'All' ? '' : selectedTag);
      setPrompts(response.data.prompts || []);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  const handlePurchase = async (e, promptId) => {
    e.stopPropagation(); // This is CRITICAL. It stops the card's main click.

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setPurchasingId(promptId); // Show loader on this specific button
      const response = await orderAPI.createCheckout(promptId);
      window.location.href = response.data.url; // Redirect to Stripe
    } catch (err) {
      console.error('Purchase failed', err);
      alert(err.response?.data?.message || 'Failed to initiate purchase');
      setPurchasingId(null); // Clear loader on error
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden starry-background">
      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12 mt-20 sm:mt-24 px-2"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            PromptVerse Marketplace
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 px-4">
            Discover premium AI prompts crafted by experts
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-8 sm:mb-12">
            {[
              { label: 'Total Prompts', value: prompts.length },
              { label: 'Tags', value: tags.length - 1 },
              { label: 'Creators', value: '500+' },
              { label: 'Happy Users', value: '5000+' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-xl"
              >
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tag Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 sm:mb-8 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl"
        >
          <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Browse by Tags</h3>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all ${
                  selectedTag === tag || (selectedTag === '' && tag === 'All')
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Prompts Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
            />
          </div>
        ) : prompts.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {prompts.map((prompt) => (
              <motion.div
                key={prompt._id}
                variants={itemVariants}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl cursor-pointer group hover:shadow-2xl transition-shadow"
                onClick={() => navigate(`/prompt/${prompt._id}`)}
              >
                {/* Prompt Image/Icon */}
                <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg sm:rounded-xl mb-3 sm:mb-4 flex items-center justify-center overflow-hidden">
                  {prompt.thumbnail?.url ? (
                    <img src={prompt.thumbnail.url} alt={prompt.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl sm:text-6xl">✨</span>
                  )}
                </div>

                {/* Prompt Info */}
                <div className="mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 group-hover:text-purple-400 transition-colors line-clamp-1">
                    {prompt.title}
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm line-clamp-2">
                    {prompt.description}
                  </p>
                </div>

                {/* Tags */}
                {prompt.tags && prompt.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    {prompt.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 sm:px-3 py-0.5 sm:py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="pt-3 sm:pt-4 border-t border-white/10">
                  {/* Price and Seller */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {prompt.seller?.username?.[0]?.toUpperCase() || 'P'}
                        </span>
                      </div>
                      <span className="text-gray-300 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">
                        {prompt.seller?.username || 'Anonymous'}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-bold text-white">
                        ${prompt.price}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={(e) => handlePurchase(e, prompt._id)}
                      disabled={purchasingId === prompt._id}
                      className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                    >
                      {purchasingId === prompt._id ? '...' : 'Buy'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-8 sm:p-12 max-w-md mx-auto">
              <span className="text-4xl sm:text-6xl mb-3 sm:mb-4 block">🔍</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">No prompts found</h3>
              <p className="text-sm sm:text-base text-gray-300">
                Try selecting a different tag or check back later!
              </p>
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        {user?.role === 'seller' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 sm:mt-12 backdrop-blur-md bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center shadow-xl"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Ready to sell your prompts?</h3>
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">Share your expertise and start earning today!</p>
            <button
              onClick={() => navigate('/create-prompt')}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Create New Prompt
            </button>
          </motion.div>
        )}

        {user && user.role !== 'seller' && user.role !== 'admin' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 sm:mt-12 backdrop-blur-md bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center shadow-xl"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Want to become a seller?</h3>
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 px-4">Join our community of creators and start monetizing your prompts!</p>
            <button
              onClick={() => navigate('/become-seller')}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Become a Seller
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Home;
