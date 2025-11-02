import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { promptAPI } from '../services/api';

function CreatePrompt() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    body: '',
    price: '',
    promptType: 'text',
    sampleInput: '',
    tags: '',
    thumbnail: ''
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [bodyError, setBodyError] = useState('');

  // Check if user is a seller
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Decode JWT to get user role
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decoded = JSON.parse(jsonPayload);
      setUserRole(decoded.role);

      if (decoded.role !== 'seller') {
        setError('Only sellers can create prompts. Please become a seller first.');
      }
    } catch (err) {
      console.error('Failed to decode token:', err);
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Validate prompt body for {INPUT} placeholder
    if (e.target.name === 'body') {
      if (e.target.value && !e.target.value.includes('{INPUT}')) {
        setBodyError('Prompt body must contain {INPUT} placeholder for dynamic content');
      } else {
        setBodyError('');
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPG, JPEG, or PNG)');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check if user is a seller
    if (userRole !== 'seller') {
      setError('Only sellers can create prompts. Please become a seller first.');
      return;
    }

    // Validate {INPUT} placeholder
    if (!formData.body.includes('{INPUT}')) {
      setError('Prompt body must contain {INPUT} placeholder for dynamic content');
      return;
    }

    if (!thumbnail) {
      setError('Please upload a thumbnail image');
      return;
    }

    // Validate price
    if (parseFloat(formData.price) < 0) {
      setError('Price must be a positive number');
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim());
      data.append('body', formData.body.trim());
      data.append('price', formData.price);
      data.append('promptType', formData.promptType);
      data.append('sampleInput', formData.sampleInput.trim());
      data.append('tags', formData.tags.trim());
      data.append('thumbnail', thumbnail);

      await promptAPI.createPrompt(data);

      // Show success message and redirect
      alert('Prompt created successfully! It will be reviewed before being published.');
      navigate('/my-prompts');
    } catch (err) {
      console.error('Error creating prompt:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.Forbidden || 'Failed to create prompt';
      setError(errorMessage);
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
            className="mb-6 sm:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create New Prompt
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              List your prompt on the marketplace
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8"
          >
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 text-sm">
                {error}
              </div>
            )}

            {userRole === 'seller' && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm">
                  Your prompt will be reviewed by our team before being published to the marketplace.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Title */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter prompt title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Description * (max 500 characters)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  maxLength={500}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of your prompt"
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {formData.description.length}/500 characters
                </p>
              </div>

              {/* Prompt Body */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Full Prompt *
                </label>
                <textarea
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  required
                  rows={6}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono ${
                    bodyError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter the complete prompt that buyers will receive. Use {INPUT} as a placeholder for dynamic content."
                />
                {bodyError && (
                  <p className="text-xs sm:text-sm text-red-600 mt-1">{bodyError}</p>
                )}
                <p className="text-xs sm:text-sm text-blue-600 mt-1">
                  Important: Include <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{INPUT}'}</code> in your prompt where user input should be inserted.
                </p>
              </div>

              {/* Price and Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Prompt Type *
                  </label>
                  <select
                    name="promptType"
                    value={formData.promptType}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="text">Text Generation</option>
                    <option value="image">Image Generation</option>
                  </select>
                </div>
              </div>

              {/* Sample Input */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Sample Input *
                </label>
                <input
                  type="text"
                  name="sampleInput"
                  value={formData.sampleInput}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Example input for preview generation"
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  This will be used to generate a preview of your prompt
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Tags * (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., marketing, copywriting, business"
                />
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Thumbnail Image * (JPG, JPEG, PNG - Max 5MB)
                </label>
                <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="flex-1 w-full">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleFileChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {thumbnailPreview && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shadow-lg"
                    >
                      <img
                        src={thumbnailPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => navigate('/my-prompts')}
                  className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || userRole !== 'seller'}
                  className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Prompt'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default CreatePrompt;
