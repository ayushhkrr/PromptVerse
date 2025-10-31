import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function PromptCard({ prompt }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/prompt/${prompt._id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden cursor-pointer hover:shadow-blue-500/20 hover:bg-white/15 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500/50 to-purple-600/50 overflow-hidden">
        {prompt.thumbnail?.url ? (
          <img
            src={prompt.thumbnail.url}
            alt={prompt.title}
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white text-6xl font-bold opacity-50">
              {prompt.title[0].toUpperCase()}
            </span>
          </div>
        )}
        {/* Price Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-4 right-4 backdrop-blur-md bg-gray-900/80 border border-white/20 px-3 py-1 rounded-full shadow-lg"
        >
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            ${prompt.price}
          </span>
        </motion.div>
        {/* Type Badge */}
        <div className="absolute top-4 left-4 backdrop-blur-md bg-gray-900/70 border border-white/10 px-3 py-1 rounded-full">
          <span className="text-xs font-semibold text-gray-300 uppercase">
            {prompt.promptType}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-100 mb-2 line-clamp-1">
          {prompt.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {prompt.description}
        </p>

        {/* Tags */}
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {prompt.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 backdrop-blur-md bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs rounded-lg"
              >
                #{tag}
              </span>
            ))}
            {prompt.tags.length > 3 && (
              <span className="px-2 py-1 backdrop-blur-md bg-white/10 border border-white/20 text-gray-400 text-xs rounded-lg">
                +{prompt.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-white/10">
          <div className="flex items-center space-x-1 text-gray-400 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span>{prompt.purchaseCount || 0} purchases</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow"
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default PromptCard;
