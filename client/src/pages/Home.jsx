import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { promptAPI } from '../services/api';
import Navbar from '../components/Navbar';

function Home() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('');

  const tags = ['All', 'ChatGPT', 'DALL-E', 'Midjourney', 'Writing', 'Coding', 'Marketing', 'Design'];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 mt-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            PromptVerse Marketplace
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Discover premium AI prompts crafted by experts
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            {[
              { label: 'Total Prompts', value: prompts.length },
              { label: 'Categories', value: tags.length - 1 },
              { label: 'Creators', value: '500+' },
              { label: 'Happy Users', value: '5000+' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl"
              >
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl"
        >
          <h3 className="text-white font-semibold mb-4">Browse by Category</h3>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTag(tag)}
                className={`px-6 py-2 rounded-xl font-medium transition-all ${
                  selectedTag === tag || (selectedTag === '' && tag === 'All')
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                }`}
              >
                {tag}
              </motion.button>
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {prompts.map((prompt) => (
              <motion.div
                key={prompt._id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl cursor-pointer group"
                onClick={() => navigate(`/prompt/${prompt._id}`)}
              >
                {/* Prompt Image/Icon */}
                <div className="w-full h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                  {prompt.imageUrl ? (
                    <img src={prompt.imageUrl} alt={prompt.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-6xl">✨</span>
                  )}
                </div>

                {/* Prompt Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {prompt.title}
                  </h3>
                  <p className="text-gray-300 text-sm line-clamp-2">
                    {prompt.description}
                  </p>
                </div>

                {/* Tags */}
                {prompt.tags && prompt.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {prompt.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {prompt.seller?.username?.[0]?.toUpperCase() || 'P'}
                      </span>
                    </div>
                    <span className="text-gray-300 text-sm">
                      {prompt.seller?.username || 'Anonymous'}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      ${prompt.price}
                    </div>
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
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-12 max-w-md mx-auto">
              <span className="text-6xl mb-4 block">🔍</span>
              <h3 className="text-2xl font-bold text-white mb-2">No prompts found</h3>
              <p className="text-gray-300">
                Try selecting a different category or check back later!
              </p>
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        {user?.isSeller && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 backdrop-blur-md bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-8 text-center shadow-xl"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Ready to sell your prompts?</h3>
            <p className="text-gray-300 mb-6">Share your expertise and start earning today!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/create-prompt')}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Create New Prompt
            </motion.button>
          </motion.div>
        )}

        {!user?.isSeller && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 backdrop-blur-md bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-8 text-center shadow-xl"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Want to become a seller?</h3>
            <p className="text-gray-300 mb-6">Join our community of creators and start monetizing your prompts!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/become-seller')}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Become a Seller
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Home;
