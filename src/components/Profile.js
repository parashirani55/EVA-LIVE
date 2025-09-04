import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Briefcase, Edit2, Save, X, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ id: '', name: '', role: '', email: '', company: '', initials: '' });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', company: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/refresh`,
        { refreshToken }
      );
      localStorage.setItem('accessToken', response.data.accessToken);
      return true;
    } catch (err) {
      console.error('Error refreshing token:', err);
      return false;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('accessToken');
      const storedUser = JSON.parse(localStorage.getItem('userData'));

      if (!token) {
        toast.error('Please log in to view your profile.', { theme: 'colored' });
        navigate('/login');
        return;
      }

      try {
        // Prefill from local storage
        if (storedUser && storedUser.name && storedUser.name !== 'Unknown User') {
          const initials = storedUser.name
            ? storedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()
            : 'U';
          setUser({
            id: storedUser.id || '',
            name: storedUser.name || 'Unknown User',
            role: storedUser.role || 'user',
            email: storedUser.email || 'Not provided',
            company: storedUser.company || 'Not provided',
            initials
          });
          setFormData({
            name: storedUser.name || '',
            email: storedUser.email || '',
            company: storedUser.company || '',
            password: '',
            confirmPassword: ''
          });
        }

        // Fetch latest from API
        let response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/user`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Profile: Fetched user data:', response.data);

        if (response.status === 403) {
          const refreshed = await refreshToken();
          if (refreshed) {
            response = await axios.get(
              `${process.env.REACT_APP_API_URL}/api/user`,
              { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
            );
          } else {
            throw new Error('Token refresh failed');
          }
        }

        const userData = response.data;
        const initials = userData.name
          ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase()
          : 'U';

        setUser({
          id: userData.id,
          name: userData.name || 'Unknown User',
          role: userData.role || 'user',
          email: userData.email || 'Not provided',
          company: userData.company || 'Not provided',
          initials
        });

        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          company: userData.company || '',
          password: '',
          confirmPassword: ''
        });

        localStorage.setItem('userData', JSON.stringify({
          id: userData.id,
          name: userData.name,
          role: userData.role,
          email: userData.email,
          company: userData.company
        }));

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load profile. Please log in again.', { theme: 'colored' });
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        company: user.company || '',
        password: '',
        confirmPassword: ''
      });
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Please log in to update your profile.', { theme: 'colored' });
      navigate('/login');
      return;
    }

    if (formData.password && formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long.', { theme: 'colored' });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.', { theme: 'colored' });
      return;
    }

    try {
      let response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/user`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 403) {
        const refreshed = await refreshToken();
        if (refreshed) {
          response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/user`,
            formData,
            { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
          );
        } else {
          throw new Error('Token refresh failed');
        }
      }

      const updatedUser = response.data.user;
      const initials = updatedUser.name
        ? updatedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : 'U';

      setUser({
        id: updatedUser.id,
        name: updatedUser.name || 'Unknown User',
        role: updatedUser.role || 'user',
        email: updatedUser.email || 'Not provided',
        company: updatedUser.company || 'Not provided',
        initials
      });

      localStorage.setItem('userData', JSON.stringify({
        id: updatedUser.id,
        name: updatedUser.name,
        role: updatedUser.role,
        email: updatedUser.email,
        company: updatedUser.company
      }));

      setEditMode(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
      toast.success('Profile updated successfully!', { theme: 'colored' });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile.', { theme: 'colored' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-800/50 rounded-xl border border-slate-700 shadow-2xl shadow-blue-500/25 p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-white">{user.initials}</span>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
            <p className="text-sm text-slate-400">{user.role}</p>
          </div>

          {editMode ? (
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-slate-600 rounded-xl bg-slate-900 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-slate-600 rounded-xl bg-slate-900 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Company</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                  </div>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-slate-600 rounded-xl bg-slate-900 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your company"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">New Password (optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-blue-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3 border border-slate-600 rounded-xl bg-slate-900 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Confirm New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-blue-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3 border border-slate-600 rounded-xl bg-slate-900 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="flex-1 px-4 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all duration-200 flex items-center justify-center"
                >
                  <X className="w-5 h-5 mr-2" />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="w-full space-y-4">
              <div className="flex items-center space-x-3 text-slate-300">
                <Mail className="w-5 h-5 text-blue-400" />
                <span>Email: {user.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <Briefcase className="w-5 h-5 text-blue-400" />
                <span>Company: {user.company}</span>
              </div>
              <button
                onClick={handleEditToggle}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
              >
                <Edit2 className="w-5 h-5 mr-2" />
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
