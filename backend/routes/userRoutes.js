import express from 'express';

  import { createQuotation, confirmQuotationEmail, checkVerificationStatus } from '../controllers/quotationController.js'
  import { upload } from '../middlewares/multerMiddleware.js';
  import quotationTokenModel from '../models/quotationTokenModel.js';
  import Quotation from '../models/quotationModel.js';

  import {createUser } from '../controllers/userController.js';
  import { loginUser, forgotPassword, resetPassword } from '../controllers/authController.js';
  import {verifyLoginOtp, verifyTwoFactorAuth, resendOtp } from '../controllers/adminAuthentication.js';
  import { refreshToken } from '../utils/jwtUtils.js';
  import { protect, verifySuperAdmin } from '../middlewares/middleware.js';
  import { ContactEunivate } from '../controllers/contactEunivate.js';
  import { updateUser, updateUserPassword } from '../controllers/updateUserInformation.js';
  import { inviteUsers, updateUserRole, getUsers} from '../controllers/peopleController.js';

const router = express.Router();

// User Authentication Routes
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/verify-otp', verifyTwoFactorAuth);  
router.post('/verify-login-otp',  verifyLoginOtp);  
router.post('/resend-otp',  resendOtp);  
router.post('/refresh-token', refreshToken);

//User Messages Related
router.post('/contactEunivate',ContactEunivate )
// router.get('/emails', getEmails); 
// User Management Routes
router.get('/', getUsers); 
router.post('/signup', createUser);  
router.post('/', upload.single('profilePicture'), createUser);
router.post('/invite', inviteUsers);  
router.put('/:userId/role', updateUserRole); 

  // quotation route
  router.post('/quotation',createQuotation);
  router.get('/quotation/confirm/:quotationToken', confirmQuotationEmail);
  router.get('/quotations/:id/status', checkVerificationStatus);

// User Update Routes
router.put('/:id', updateUser);
router.put('/:id/password', updateUserPassword);

// SuperAdmin Route (Protected)
router.get('/superadmin', protect, verifySuperAdmin, (req, res) => {
  res.status(200).json({ message: 'Welcome to the SuperAdmin dashboard' });
});

export default router;