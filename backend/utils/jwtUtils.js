import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';

// Generate Access Token
export const generateAccessToken = (id) => {
  return jwt.sign({ _id: id  }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Generate Refresh Token
export const generateRefreshToken = (id) => {
  return jwt.sign({ _id: id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// Refresh Token Controller
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh Token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded._id);

    if (!user || !user.refreshToken.includes(refreshToken)) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Generate a new access token
    const newAccessToken = generateAccessToken(user._id);

    res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired refresh token', error });
  }
};
