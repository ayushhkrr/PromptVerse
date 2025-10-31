import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: '🎯',
      title: 'Browse Prompts',
      description: 'Discover hand-crafted AI prompts for ChatGPT, DALL-E, and other tools. Find exactly what you need.'
    },
    {
      icon: '💰',
      title: 'Sell Your Prompts',
      description: 'Turn your creativity into income. Upload your best prompts and start earning today.'
    },
    {
      icon: '📬',
      title: 'Easy Access',
      description: 'Purchase once, access forever. All your prompts saved in your account dashboard.'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Premium Prompts' },
    { number: '500+', label: 'Happy Creators' },
    { number: '5000+', label: 'Satisfied Users' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Colorful Blob Decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      <div className="absolute bottom-0 right-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-6000" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-8000" />
      <div className="absolute bottom-1/4 right-1/3 w-56 h-56 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-10000" />

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-50 backdrop-blur-md bg-white/30 border-b border-gray-200/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                PromptVerse
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className="px-6 py-2 rounded-xl bg-gray-900 text-white font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Sign up
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight text-gray-900"
            >
              Don't make finding
              <br />
              <span className="relative">
                AI prompts
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-3 bg-yellow-300/50 -z-10"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
              </span>
              <br />
              awkward
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              No more searching endlessly for the perfect prompt. PromptVerse makes it easy to discover,
              purchase, and sell AI prompts all in one place.
            </motion.p>

            <motion.button
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="px-8 py-4 rounded-xl bg-gray-900 text-white text-lg font-bold shadow-xl hover:shadow-2xl transition-all"
            >
              Sign up free
            </motion.button>

            {/* Mock Phone Screens */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-20 relative h-[500px] flex items-center justify-center"
            >
              {/* Left Phone - Prompt Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-1/4 w-72 h-[480px] bg-gradient-to-br from-pink-200 via-purple-200 to-orange-200 rounded-[3rem] shadow-2xl p-4 transform -rotate-6 border-8 border-gray-900"
              >
                <div className="w-full h-full bg-white/80 backdrop-blur-md rounded-[2.5rem] p-6 flex flex-col items-center justify-center">
                  <div className="w-48 h-48 bg-white rounded-3xl shadow-lg p-4 flex items-center justify-center mb-4">
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center">
                      <span className="text-6xl">✨</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900 mb-2">Premium Prompt</div>
                    <div className="text-xs text-gray-600">Browse & Purchase</div>
                  </div>
                </div>
              </motion.div>

              {/* Right Phone - Message View */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute right-1/4 w-72 h-[480px] bg-gray-900 rounded-[3rem] shadow-2xl p-4 transform rotate-6 border-8 border-gray-900"
              >
                <div className="w-full h-full bg-white rounded-[2.5rem] p-6">
                  <div className="mb-6">
                    <div className="text-xl font-bold text-gray-900 mb-2">Your Prompts</div>
                    <div className="text-sm text-gray-500">Manage your collection</div>
                  </div>

                  <div className="space-y-4">
                    <div className="backdrop-blur-md bg-purple-50 border border-purple-200 rounded-2xl p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">🎨</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900 mb-1">Design Assistant</div>
                          <div className="text-xs text-gray-600">Perfect for creative projects</div>
                        </div>
                      </div>
                    </div>

                    <div className="backdrop-blur-md bg-blue-50 border border-blue-200 rounded-2xl p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-teal-400 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">💼</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900 mb-1">Business Helper</div>
                          <div className="text-xs text-gray-600">Boost productivity instantly</div>
                        </div>
                      </div>
                    </div>

                    <div className="backdrop-blur-md bg-orange-50 border border-orange-200 rounded-2xl p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">✍️</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900 mb-1">Content Writer</div>
                          <div className="text-xs text-gray-600">Create amazing content</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900">
              Here's how it works
            </h2>
            <p className="text-xl text-gray-600">
              More prompting, less searching.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl shadow-lg mb-6"
                >
                  <span className="text-4xl">{feature.icon}</span>
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="px-8 py-4 rounded-xl bg-gray-900 text-white text-lg font-bold shadow-xl hover:shadow-2xl transition-all"
            >
              Start browsing
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center backdrop-blur-md bg-white/50 border border-gray-200 rounded-3xl p-8 shadow-lg"
              >
                <motion.h3
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                  className="text-4xl md:text-5xl font-bold text-gray-900 mb-2"
                >
                  {stat.number}
                </motion.h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600">
              Get connected and start prompting.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="backdrop-blur-md bg-white/50 border border-gray-200 rounded-3xl p-12 shadow-xl"
          >
            <div className="flex flex-col items-center space-y-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <span className="text-4xl">📧</span>
              </motion.div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-600 mb-6">
                  We typically respond within 24 hours
                </p>
                <motion.a
                  href="mailto:ayushhkrr@gmail.com"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block px-8 py-3 bg-gray-900 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  ayushhkrr@gmail.com
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                PromptVerse
              </span>
            </div>

            <p className="text-gray-600 text-center">
              Get connected and start prompting.
            </p>

            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Terms</a>
              <a href="mailto:ayushhkrr@gmail.com" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
            </div>

            <p className="text-gray-500 text-sm">
              © 2024 PromptVerse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
