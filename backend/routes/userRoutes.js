import express from 'express';
import { getUsers, createUser } from '../controllers/userController.js';
import { loginUser, forgotPassword, resetPassword } from '../controllers/authController.js';
import {verifyLoginOtp, verifyTwoFactorAuth, resendOtp } from '../controllers/adminAuthentication.js';
import { refreshToken } from '../utils/jwtUtils.js';
import { protect, verifySuperAdmin } from '../middlewares/middleware.js';
import { updateUser, updateUserPassword } from '../controllers/updateUserInformation.js';
import upload from '../middlewares/multerMiddleware.js';

const router = express.Router();

// User Authentication Routes
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/verify-otp', verifyTwoFactorAuth);  
router.post('/verify-login-otp',  verifyLoginOtp);  
router.post('/resend-otp',  resendOtp);  
router.post('/refresh-token', refreshToken);

// User Management Routes
router.get('/', protect, getUsers);  // Protect this route to require authentication
router.post('/', upload.single('profilePicture'), createUser);


// User Update Routes
router.put('/:id', updateUser);
router.put('/:id/password', updateUserPassword);

// SuperAdmin Route (Protected)
router.get('/superadmin', protect, verifySuperAdmin, (req, res) => {
  res.status(200).json({ message: 'Welcome to the SuperAdmin dashboard' });
});

export default router;
