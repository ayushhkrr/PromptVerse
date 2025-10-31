import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { adminAPI, promptAPI } from '../services/api';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, promptsRes] = await Promise.all([
        adminAPI.getStats(),
        promptAPI.getAllPrompts(1, 100)
      ]);
      setStats(statsRes.data);
      setPrompts(promptsRes.data.prompts || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      setPrompts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptStatusUpdate = async (promptId, status) => {
    try {
      await promptAPI.updatePromptStatus(promptId, status);
      setPrompts(prompts.map(p =>
        p._id === promptId ? { ...p, status } : p
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update prompt status');
    }
  };

  const handleUserStatusUpdate = async (userId, status) => {
    try {
      await adminAPI.updateUserStatus(userId, status);
      alert('User status updated successfully');
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
      case 'active':
        return 'bg-green-500/20 border border-green-500/50 text-green-300';
      case 'pending':
        return 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-300';
      case 'rejected':
      case 'banned':
        return 'bg-red-500/20 border border-red-500/50 text-red-300';
      default:
        return 'bg-gray-500/20 border border-gray-500/50 text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <Navbar />
        <div className="pt-24 flex justify-center items-center h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <Navbar />

      <div className="relative z-10 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-300 mt-2">
              Manage users and prompts
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="backdrop-blur-md bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-8"
            >
              {error}
            </motion.div>
          )}

          {/* Tabs */}
          <div className="flex space-x-2 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'stats'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'backdrop-blur-md bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20'
              }`}
            >
              Statistics
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('prompts')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'prompts'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'backdrop-blur-md bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20'
              }`}
            >
              Manage Prompts
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'backdrop-blur-md bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20'
              }`}
            >
              Manage Users
            </motion.button>
          </div>

          {/* Statistics Tab */}
          {activeTab === 'stats' && stats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  {stats.totalUsers || 0}
                </h3>
                <p className="text-gray-300">Total Users</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📝</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  {stats.totalPrompts || 0}
                </h3>
                <p className="text-gray-300">Total Prompts</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  ${stats.totalRevenue || 0}
                </h3>
                <p className="text-gray-300">Total Revenue</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-500/20 border border-yellow-500/30 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⏳</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  {stats.pendingPrompts || 0}
                </h3>
                <p className="text-gray-300">Pending Prompts</p>
              </motion.div>
            </motion.div>
          )}

          {/* Prompts Management Tab */}
          {activeTab === 'prompts' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {prompts.length === 0 ? (
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl p-12 text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    No prompts found
                  </h2>
                  <p className="text-gray-300">
                    There are no prompts in the system yet
                  </p>
                </div>
              ) : (
                prompts.map((prompt, index) => (
                <motion.div
                  key={prompt._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-white">
                          {prompt.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(prompt.status)}`}>
                          {prompt.status}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4">{prompt.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>Price: ${prompt.price}</span>
                        <span>Type: {prompt.promptType}</span>
                        <span>Sales: {prompt.purchaseCount || 0}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      {prompt.status === 'pending' && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePromptStatusUpdate(prompt._id, 'approved')}
                            className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Approve
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePromptStatusUpdate(prompt._id, 'rejected')}
                            className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Reject
                          </motion.button>
                        </>
                      )}
                      {prompt.status === 'approved' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePromptStatusUpdate(prompt._id, 'rejected')}
                          className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Reject
                        </motion.button>
                      )}
                      {prompt.status === 'rejected' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePromptStatusUpdate(prompt._id, 'approved')}
                          className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Approve
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )))}
            </motion.div>
          )}

          {/* Users Management Tab */}
          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {!stats?.users || stats.users.length === 0 ? (
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl p-12 text-center">
                  <div className="text-6xl mb-4">👥</div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    No users found
                  </h2>
                  <p className="text-gray-300">
                    There are no users in the system yet
                  </p>
                </div>
              ) : (
                stats.users.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-white">
                          {user.fullName}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                        <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-full text-xs font-semibold">
                          {user.role}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">{user.email}</p>
                      <p className="text-gray-400 text-sm">@{user.username}</p>
                    </div>
                    <div className="flex gap-2">
                      {user.status === 'active' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUserStatusUpdate(user._id, 'banned')}
                          className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Ban
                        </motion.button>
                      )}
                      {user.status === 'banned' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUserStatusUpdate(user._id, 'active')}
                          className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Activate
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
