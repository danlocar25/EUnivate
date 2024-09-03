  import express from 'express';
  import { getUsers, createUser, loginUser, forgotPassword, resetPassword} from '../controllers/userController.js';
  import { updateUser, updateUserPassword } from '../controllers/updateUserInformation.js';
  import { protect, verifySuperAdmin } from '../middlewares/middleware.js';
  import { ContactEunivate } from '../controllers/contactEunivate.js';
  import { createQuotation } from '../controllers/quotationController.js'
  import upload from '../middlewares/multerMiddleware.js';
  const router = express.Router();

  router.post('/login', loginUser);

  router.post('/', upload.single('profilePicture'), createUser);

  router.post('/forgot-password', forgotPassword);
  router.post("/reset-password/:token", resetPassword);
  //User Contact Eunivate Request API route
  router.post('/contactEunivate', ContactEunivate);

  // quotation route
  router.post('/quotation',createQuotation);

        //SuperAdmin Setting Profile
      // Route to update user information
      router.put('/:id', updateUser);

      // Route to update user password

      router.put('/:id/password', updateUserPassword)


  // Protect and restrict access to superadmin route
  router.get('/superadmin', protect, verifySuperAdmin, (req, res) => {
    res.status(200).json({ message: 'Welcome to the SuperAdmin dashboard' });
  });

  // // Store the profile picture of the admin
  // router.put('/profile', updateUserProfilePicture);

  router.get('/', protect, getUsers);  // Protect this route to require authentication

  export default router;
