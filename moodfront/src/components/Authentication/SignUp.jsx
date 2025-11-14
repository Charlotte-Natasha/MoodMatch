import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.surname.trim()) newErrors.surname = 'Surname is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';

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
      setIsLoading(false);
      // Navigate to login page after sign up
      navigate('/login');
    }, 1500);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Branding Section */}
      <div 
        className="md:w-1/2 text-white flex flex-col items-center justify-center p-10 md:p-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2F0222 0%, #4B0B3E 50%, #6B1556 100%)' }}
      >
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center">
          <div className="text-6xl mb-6">🎵</div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
            MOODMATCH
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-md">
            Music for every emotion
          </p>
          <div className="mt-12 space-y-4 text-left max-w-md">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">✨</span>
              <span className="text-lg opacity-90">Personalized playlists</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🎭</span>
              <span className="text-lg opacity-90">Match your mood instantly</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🎧</span>
              <span className="text-lg opacity-90">Discover new favorites</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sign Up Form */}
      <div 
        className="md:w-1/2 flex items-center justify-center p-8 md:p-12 relative"
        style={{ background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%)' }}
      >
        <div className="absolute top-0 left-0 w-full h-2" style={{ background: 'linear-gradient(90deg, #2F0222 0%, #6B1556 100%)' }}></div>
        
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">
              Create Account
            </h2>
            <p className="text-gray-600 text-lg">
              Start your mood music journey today
            </p>
          </div>

          <div className="space-y-5">
            {/* First Name */}
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full p-4 rounded-xl bg-white border-2 text-gray-900 placeholder-gray-400 focus:outline-none transition-all shadow-sm ${
                  errors.firstName ? 'border-red-500' : 'border-gray-200 focus:border-[#2F0222]'
                }`}
              />
              {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
            </div>

            {/* Surname */}
            <div>
              <input
                type="text"
                name="surname"
                placeholder="Surname"
                value={formData.surname}
                onChange={handleChange}
                className={`w-full p-4 rounded-xl bg-white border-2 text-gray-900 placeholder-gray-400 focus:outline-none transition-all shadow-sm ${
                  errors.surname ? 'border-red-500' : 'border-gray-200 focus:border-[#2F0222]'
                }`}
              />
              {errors.surname && <p className="mt-1 text-sm text-red-500">{errors.surname}</p>}
            </div>

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
                placeholder="Password (min. 8 characters)"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-4 rounded-xl bg-white border-2 text-gray-900 placeholder-gray-400 focus:outline-none transition-all shadow-sm ${
                  errors.password ? 'border-red-500' : 'border-gray-200 focus:border-[#2F0222]'
                }`}
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* Submit Button with gradient layer */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full h-14 rounded-md text-white text-lg font-semibold relative overflow-hidden"
            >
              <div className={`absolute inset-0 z-0 ${isLoading ? 'bg-gray-400' : 'button-gradient-bg'}`}></div>
              <span className="relative z-10">
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </span>
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={handleLogin}
                className="font-semibold underline-offset-2 hover:underline transition-colors"
                style={{ color: '#2F0222' }}
              >
                Sign In
              </button>
            </p>
          </div>

          {/* Terms */}
          <p className="mt-6 text-xs text-gray-500 text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
