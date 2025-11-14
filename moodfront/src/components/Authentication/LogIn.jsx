import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
      console.log('Login:', formData, 'Remember me:', rememberMe);
      setIsLoading(false);
      navigate('/moods-select');
    }, 1500);
  };

  const handleSignUp = () => navigate('/signup');
  const handleForgotPassword = () => navigate('/forgot-password');

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Branding */}
      <div className="md:w-1/2 text-white flex flex-col items-center justify-center p-10 md:p-16 relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #2F0222 0%, #4B0B3E 50%, #6B1556 100%)'
        }}>
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center">
          <div className="text-6xl mb-6">🎵</div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">MOODMATCH</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-md">Welcome back!</p>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-12 relative bg-gray-100">
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-purple-800 to-pink-700"></div>

        <div className="w-full max-w-md">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 text-lg mb-6">Sign in to continue your music journey</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-4 rounded-xl bg-white border-2 text-gray-900 placeholder-gray-400 focus:outline-none transition-all shadow-sm ${
                  errors.email ? 'border-red-500' : 'border-gray-200 focus:border-[#2F0222]'
                }`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-4 rounded-xl bg-white border-2 text-gray-900 placeholder-gray-400 focus:outline-none transition-all shadow-sm ${
                  errors.password ? 'border-red-500' : 'border-gray-200 focus:border-[#2F0222]'
                }`}
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer"
                  style={{ accentColor: '#2F0222' }}
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium hover:underline transition-colors text-[#2F0222]"
              >
                Forgot password?
              </button>
            </div>

            {/* Custom Gradient Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-md text-white text-lg font-semibold relative overflow-hidden"
            >
              <div className="absolute inset-0 z-0 button-gradient-bg"></div>
              <span className="relative z-10">{isLoading ? 'Signing in…' : 'Sign In'}</span>
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={handleSignUp}
              className="font-semibold underline text-[#2F0222] hover:text-[#6B1556] transition-colors"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
