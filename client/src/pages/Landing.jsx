import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DynamicBackground from '../components/DynamicBackground';

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
      title: 'Premium AI Prompts',
      description: 'Discover hand-crafted prompts for ChatGPT, DALL-E, and other AI tools'
    },
    {
      icon: '💰',
      title: 'Earn as Creator',
      description: 'Sell your best prompts and earn money from your creativity'
    },
    {
      icon: '🚀',
      title: 'Instant Access',
      description: 'Purchase once, use forever. No subscriptions or hidden fees'
    },
    {
      icon: '🔒',
      title: 'Secure Payments',
      description: 'Safe and secure transactions powered by Stripe'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Premium Prompts' },
    { number: '500+', label: 'Happy Creators' },
    { number: '5000+', label: 'Satisfied Users' },
    { number: '24/7', label: 'Support Available' }
  ];

  return (
    <div className="min-h-screen">
      <DynamicBackground />

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-gray-900/50 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                PromptVerse
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-blue-400 transition-colors"
              >
                Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30"
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div
              variants={fadeInUp}
              className="mb-6"
            >
              <span className="px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-semibold backdrop-blur-md">
                🎉 The Ultimate AI Prompt Marketplace
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Unlock the Power
              </span>
              <br />
              <span className="text-white">of AI Prompts</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
            >
              Buy and sell premium AI prompts. Transform your creativity into income or discover the perfect prompts for your projects.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold shadow-2xl shadow-blue-500/50 overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Discover Prompts</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className="px-8 py-4 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white text-lg font-bold hover:bg-white/20 transition-all"
              >
                Start Selling
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Floating Cards Animation */}
          <div className="mt-20 relative h-64">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 100 }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                  y: [100, -20, 100],
                  x: [0, (i - 1) * 50, 0]
                }}
                transition={{
                  duration: 5,
                  delay: i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute left-1/2 transform -translate-x-1/2 w-64 h-40 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-4"
                style={{ zIndex: 3 - i }}
              >
                <div className="h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-3xl">✨</span>
                    <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 text-green-300 text-xs rounded-lg">
                      Premium
                    </span>
                  </div>
                  <div>
                    <div className="h-2 bg-white/20 rounded mb-2" />
                    <div className="h-2 bg-white/20 rounded w-3/4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <motion.h3
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2"
                >
                  {stat.number}
                </motion.h3>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Why Choose Us?
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need in one place
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer group"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl mb-4"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                About PromptVerse
              </span>
            </h2>
            <p className="text-xl text-gray-300 text-center mb-8 leading-relaxed">
              PromptVerse is the premier marketplace for AI prompts, connecting creators with users who need
              high-quality prompts for their AI projects. Whether you're using ChatGPT, DALL-E, Midjourney,
              or any other AI tool, we have the perfect prompts to unlock your creativity.
            </p>
            <p className="text-lg text-gray-400 text-center leading-relaxed">
              Our mission is to empower creators to monetize their expertise while providing users with
              battle-tested prompts that deliver exceptional results. Join thousands of creators and users
              who trust PromptVerse for their AI prompt needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Get In Touch
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Have questions? We'd love to hear from you!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12"
          >
            <div className="flex flex-col items-center space-y-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50"
              >
                <span className="text-4xl">📧</span>
              </motion.div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Email Us</h3>
                <p className="text-gray-400 mb-4">
                  We typically respond within 24 hours
                </p>
                <motion.a
                  href="mailto:ayushhkrr@gmail.com"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/30"
                >
                  ayushhkrr@gmail.com
                </motion.a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
                <div className="text-center p-4 backdrop-blur-md bg-white/5 rounded-xl border border-white/10">
                  <div className="text-3xl mb-2">💬</div>
                  <h4 className="text-white font-semibold mb-1">General Inquiries</h4>
                  <p className="text-gray-400 text-sm">Questions about our platform</p>
                </div>
                <div className="text-center p-4 backdrop-blur-md bg-white/5 rounded-xl border border-white/10">
                  <div className="text-3xl mb-2">🤝</div>
                  <h4 className="text-white font-semibold mb-1">Partnership</h4>
                  <p className="text-gray-400 text-sm">Collaborate with us</p>
                </div>
                <div className="text-center p-4 backdrop-blur-md bg-white/5 rounded-xl border border-white/10">
                  <div className="text-3xl mb-2">🛠️</div>
                  <h4 className="text-white font-semibold mb-1">Support</h4>
                  <p className="text-gray-400 text-sm">Technical assistance</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                PromptVerse
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 PromptVerse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
