import React, { useState, useEffect } from 'react';
import { Loginback } from '../../../constants/assets';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [savedCredentials, setSavedCredentials] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load saved emails from localStorage
    const savedCreds = JSON.parse(localStorage.getItem('savedCredentials')) || [];
    setSavedCredentials(savedCreds);
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email: email,
        password: password,
      });
  
      const data = response.data;
      console.log(data);
  
      if (response.status === 200) {
        const { _id, firstName, lastName, email, role, username, phoneNumber, profilePicture, token } = data;
  
        localStorage.setItem('user', JSON.stringify({
          _id,
          firstName,
          lastName,
          username,
          email,
          phoneNumber,
          profilePicture,
          token,
          role,
        }));
  
        if (rememberMe) {
          const newCreds = { email, password };
          const updatedCreds = [...savedCredentials.filter((cred) => cred.email !== email), newCreds];
          localStorage.setItem('savedCredentials', JSON.stringify(updatedCreds));
        }
  
        const roleLowerCase = role.toLowerCase(); 
        if (roleLowerCase === 'superadmin') {
          navigate('/superadmin/dashboard');
        } else if (roleLowerCase === 'admin') {
          navigate('/admin');
        } else if (roleLowerCase === 'collaborator') {
          navigate('/collaborator-dashboard');
        } else if (roleLowerCase === 'user') {
          navigate('/');
        } else {
          console.error('Unknown role:', role);
        }
      } else {
        console.error('Login failed:', data.message);
        setError(data.message);
      }
    } catch (error) {
      
      if (error.response && error.response.status === 400) {
      setError('Invalid email or password.');
    } else if (error.response && error.response.status === 404) {
      setError('Email not found.');
    } else {
      setError('An error occurred while trying to log in. Please try again later.');
    }
    console.error('Error logging in:', error);
  }
};
  
  

  const handleEmailFocus = () => {
    setShowSuggestions(true);
  };

  const handleEmailSelect = (selectedEmail) => {
    const selectedCred = savedCredentials.find((cred) => cred.email === selectedEmail);
    setEmail(selectedEmail);
    setPassword(selectedCred.password);
    setShowSuggestions(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url(${Loginback})` }}>
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6">Log In</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="mb-4 relative">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
          <input
            type="email"
            placeholder="Enter Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={handleEmailFocus}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click on suggestion
          />
         {showSuggestions && (
  <ul className="absolute bg-white rounded-md mt-1 w-full max-h-40 overflow-y-auto z-10 shadow-md">
    {savedCredentials.map((cred, index) => (
      <li
        key={index}
        className="p-2 cursor-pointer hover:bg-gray-100"
        onClick={() => handleEmailSelect(cred.email)}
      >
        {cred.email}
      </li>
    ))}
  </ul>
)}

        </div>
        <div className="mb-4 relative">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={togglePasswordVisibility} className="absolute right-3 top-9 cursor-pointer text-gray-500">
            {showPassword ? 'Hide' : 'Show'}
          </span>
        </div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              className="mr-2"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="rememberMe" className="text-gray-700 text-sm">Remember me</label>
          </div>
          <Link to="/forgot" className="text-sm text-red-600 hover:underline">Forgot Password?</Link>
        </div>
        <button className="w-full bg-yellow-500 text-white p-3 rounded-lg shadow hover:bg-yellow-600 transition duration-300" onClick={handleLogin}>
          Login
        </button>
        <div className="text-center mt-6 text-gray-700">
          <p>
            Don’t have an account? <Link to="/signup" className="text-red-600 hover:underline">SIGN UP</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
