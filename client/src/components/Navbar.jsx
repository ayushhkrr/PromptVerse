import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-gray-900/50 border-b border-white/10 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" onClick={closeMobileMenu}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                PromptVerse
              </span>
            </motion.div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-gray-300 hover:text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/home">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    Browse
                  </motion.button>
                </Link>

                {user?.role === 'admin' && (
                  <Link to="/admin">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-lg text-gray-300 hover:text-purple-400 transition-colors"
                    >
                      Admin
                    </motion.button>
                  </Link>
                )}

                {(user?.role === 'seller' || user?.role === 'admin') && (
                  <>
                    <Link to="/my-prompts">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-lg text-gray-300 hover:text-blue-400 transition-colors"
                      >
                        My Prompts
                      </motion.button>
                    </Link>

                    <Link to="/create-prompt">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                      >
                        Create Prompt
                      </motion.button>
                    </Link>
                  </>
                )}

                <Link to="/my-purchases">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    My Purchases
                  </motion.button>
                </Link>

                {user?.role === 'buyer' && (
                  <Link to="/become-seller">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                    >
                      Become Seller
                    </motion.button>
                  </Link>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/30"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                  >
                    Register
                  </motion.button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden backdrop-blur-xl bg-gray-900/95 border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link to="/home" onClick={closeMobileMenu}>
                    <div className="block px-4 py-3 rounded-lg text-gray-300 hover:text-blue-400 hover:bg-white/5 transition-colors">
                      Browse
                    </div>
                  </Link>

                  {user?.role === 'admin' && (
                    <Link to="/admin" onClick={closeMobileMenu}>
                      <div className="block px-4 py-3 rounded-lg text-gray-300 hover:text-purple-400 hover:bg-white/5 transition-colors">
                        Admin
                      </div>
                    </Link>
                  )}

                  {(user?.role === 'seller' || user?.role === 'admin') && (
                    <>
                      <Link to="/my-prompts" onClick={closeMobileMenu}>
                        <div className="block px-4 py-3 rounded-lg text-gray-300 hover:text-blue-400 hover:bg-white/5 transition-colors">
                          My Prompts
                        </div>
                      </Link>

                      <Link to="/create-prompt" onClick={closeMobileMenu}>
                        <div className="block px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center">
                          Create Prompt
                        </div>
                      </Link>
                    </>
                  )}

                  <Link to="/my-purchases" onClick={closeMobileMenu}>
                    <div className="block px-4 py-3 rounded-lg text-gray-300 hover:text-blue-400 hover:bg-white/5 transition-colors">
                      My Purchases
                    </div>
                  </Link>

                  {user?.role === 'buyer' && (
                    <Link to="/become-seller" onClick={closeMobileMenu}>
                      <div className="block px-4 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center">
                        Become Seller
                      </div>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white text-center"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeMobileMenu}>
                    <div className="block px-4 py-3 rounded-lg text-gray-300 hover:text-blue-400 hover:bg-white/5 transition-colors">
                      Login
                    </div>
                  </Link>
                  <Link to="/register" onClick={closeMobileMenu}>
                    <div className="block px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center">
                      Register
                    </div>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
