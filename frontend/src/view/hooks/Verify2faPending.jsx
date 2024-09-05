import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Verify2FAPending = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [storedUser, setStoredUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setStoredUser(user);

    if (user && user.twoFactorEnabled) {
      setSuccess('Please enter the OTP sent to your email.');
    }
  }, []);

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        // Move to the next input if a digit is entered
        document.getElementById(`otp-input-${index + 1}`).focus();
      } else if (!value && index > 0) {
        // Move to the previous input if the value is cleared
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
  };

      const handleVerifyOtp = async () => {
        setLoading(true);
        const userId = storedUser.userId || storedUser._id;

        if (!userId) {
          setError('User data not found. Please log in again.');
          return;
        }
      
        const otpCode = otp.join('');
      
        if (otpCode.length < 4) {
          setError('Please enter the complete OTP.');
          return;
        }
      
        try {
          const response = await axios.post('http://localhost:5000/api/users/verify-otp', {
            userId,
            otp: otpCode,
          });
      
          if (response.status === 200) {
            setSuccess('OTP verified successfully!');
      
            // Store access token and refresh token in local storage
            const {
              _id,
              firstName,
              lastName,
              email,
              role,
              username,
              phoneNumber,
              profilePicture,
              accessToken,
              refreshToken,
              twoFactorToken,
            } = response.data;
      
            localStorage.setItem('user', JSON.stringify({
              _id,
              firstName,
              lastName,
              username,
              email,
              phoneNumber,
              profilePicture,
              role,
              accessToken,
              refreshToken,
              twoFactorToken,
            }));
      
            // Redirect based on user role after 2 seconds
            setTimeout(() => {
              if (role) {
                const roleLowerCase = role.toLowerCase();
                if (roleLowerCase === 'superadmin') {
                  navigate('/superadmin/dashboard');
                } else if (roleLowerCase === 'admin') {
                  navigate('/admin');
                } else if (roleLowerCase === 'collaborator') {
                  navigate('/collaborator-dashboard');
                } else if (roleLowerCase === 'ser') {
                  navigate('/');
                } else {
                  console.error('Unknown role:', role);
                  navigate('/');
                }
              } else {
                console.error('Role is not defined.');
                navigate('/login'); // Redirect to login if role is undefined
              }
            }, 2000);
          } else {
            setError('Invalid OTP. Please try again.');
          }
        } catch (err) {
          setLoading(false);
          setError('Failed to verify OTP. Please try again later.');
        }
      };

  const handleResendOtp = async () => {
    if (!storedUser) {
      setError('User data not found. Please log in again.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/users/resend-otp', {
        email: storedUser.email,
      });
      setSuccess('OTP resent successfully!');
    } catch (err) {
      setError('Failed to resend OTP. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mb-2 text-center">Check your email</h2>
        <p className="text-gray-600 text-center mb-4">
          We sent a verification link to {storedUser?.email}.
        </p>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-center mb-4">{success}</p>}

        <div className="flex justify-center space-x-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(e, index)}
              className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          ))}
        </div>

        <button
          onClick={handleVerifyOtp}
          className="w-full bg-red-800 text-white py-2 rounded-lg shadow hover:bg-red-600 transition duration-300"
          disabled={loading} 
        >
          {loading ? 'Confirming...' : 'Confirm'}
        </button>

        <p className="text-center mt-4 text-gray-600">
          Didn't receive the email?{' '}
          <span
            onClick={handleResendOtp}
            className="text-red-800 cursor-pointer hover:underline"
          >
            Click to resend
          </span>
        </p>

        <div className="text-center mt-4">
          <button onClick={() => navigate('/login')} className="text-gray-600 hover:underline">
            &larr; Back to log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verify2FAPending;
