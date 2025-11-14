import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// --- FIREBASE IMPORTS ---
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig'; // Import initialized auth

const Signup = () => { // Renamed to SignupPage for consistency
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(''); // For Firebase errors
  const [isLoading, setIsLoading] = useState(false);
  
  // Define necessary gradients for the responsive design
  const purpleGradient = 'linear-gradient(135deg, #2F0222 0%, #4B0B3E 50%, #6B1556 100%)';


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear specific field errors when typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    setGeneralError('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    // --- STEP 1: Client-Side Validation ---
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setGeneralError('');
    setErrors({}); // Clear specific errors before network call

    // --- STEP 2: Firebase Registration ---
    try {
      // 2a. Create the user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      // 2b. Set the display name (First + Surname)
      const displayName = `${formData.firstName} ${formData.surname}`;
      await updateProfile(userCredential.user, { displayName: displayName });

      console.log('Firebase Sign Up Successful:', userCredential.user.uid);
      
      // 2c. Navigate to the next screen
      navigate('/welcome');

    } catch (err) {
      console.error('Sign Up Error:', err.code, err.message);
      
      // Map Firebase errors to user-friendly messages
      if (err.code === 'auth/email-already-in-use') {
        setGeneralError('That email address is already in use. Please sign in.');
      } else if (err.code === 'auth/weak-password') {
        setGeneralError('Password must be at least 6 characters long.');
      } else {
        setGeneralError('Sign up failed. Please check your network or details.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    // Outer container uses the dark gradient globally
    <div 
        className="min-h-screen flex flex-col md:flex-row text-white"
        style={{ background: purpleGradient }}
    >
      {/* Left Branding Section (HIDDEN on Mobile) */}
      <div 
        className="hidden md:flex md:w-1/2 text-white flex-col items-center justify-center p-10 md:p-16 relative overflow-hidden"
        style={{ background: purpleGradient }}
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

      {/* Right Sign Up Form (Dark on Mobile, Light on Desktop) */}
      <div 
        // On Mobile: W-full, Dark text (from parent)
        // On Desktop (md): W-1/2, Light background (overrides parent)
        className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 relative"
        style={{ 
          // Applies light gradient only on desktop; mobile inherits dark purple
          background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%)', 
        }}
      >
        <div className="absolute top-0 left-0 w-full h-2 hidden md:block" style={{ background: 'linear-gradient(90deg, #2F0222 0%, #6B1556 100%)' }}></div>
        
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white md:text-gray-900">
              Create Account
            </h2>
            <p className="text-white md:text-gray-600 text-lg">
              Start your mood music journey today
            </p>
          </div>
          
          {/* General Error Message (e.g., Email already in use) */}
          {generalError && (
            <div className="p-3 mb-4 bg-purple-600 text-white rounded-lg text-center font-medium">
              {generalError}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Input fields */}
            {['firstName', 'surname', 'email', 'password'].map((field) => (
              <div key={field}>
                <input
                  type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace('password', 'Password (min. 8 characters)')}
                  value={formData[field]}
                  onChange={handleChange}
                  // Responsive styles for input fields
                  className={`w-full p-4 rounded-xl bg-white/20 md:bg-white border-2 text-white md:text-gray-900 placeholder-white/70 md:placeholder-gray-400 focus:outline-none transition-all shadow-sm ${
                    errors[field] ? 'border-purple-500' : 'border-gray-200 focus:border-[#2F0222]'
                  }`}
                />
                {errors[field] && <p className="mt-1 text-sm text-red-400 md:text-red-500">{errors[field]}</p>}
              </div>
            ))}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-xl text-white text-lg font-semibold relative overflow-hidden transition-all duration-200"
            >
              <div 
                className={`absolute inset-0 z-0 
                  ${isLoading 
                    ? 'bg-gray-400' 
                    : 'bg-linear-to-r from-purple-700 to-pink-600 hover:from-purple-800 hover:to-pink-700'
                  }
                `}
              ></div>
              <span className="relative z-10">
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Sign Up'
                )}
              </span>
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-white md:text-gray-600">
              Already have an account?{' '}
              <button
                onClick={handleLogin}
                className="font-semibold underline-offset-2 hover:underline transition-colors text-pink-400 md:text-[#2F0222]"
              >
                Sign In
              </button>
            </p>
          </div>

          {/* Terms */}
          <p className="mt-6 text-xs text-white/60 md:text-gray-500 text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;