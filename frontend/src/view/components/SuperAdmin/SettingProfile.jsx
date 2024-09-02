import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const SettingProfile = () => {
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [isPhoneEditable, setIsPhoneEditable] = useState(false);
  const [isBiodataEditable, setIsBiodataEditable] = useState(false);

  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [biodata, setBiodata] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const defaultProfilePictureUrl = 'https://www.imghost.net/ib/YgQep2KBICssXI1_1725211680.png'; // Replace with your actual default image URL

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
        setEmail(storedUser.email || '');
        setPhoneNumber(storedUser.phoneNumber || '');
        setBiodata(storedUser.role || '');
        setUsername(storedUser.username || '');
        setFirstName(storedUser.firstName || '');
        setLastName(storedUser.lastName || '');

        // Handle the profile picture logic
        if (storedUser.profilePicture && storedUser.profilePicture.url) {
            setProfilePicture(storedUser.profilePicture.url);
        } else if (storedUser.profilePicture && typeof storedUser.profilePicture === 'string') {
            setProfilePicture(storedUser.profilePicture);
        } else {
            setProfilePicture(defaultProfilePictureUrl);
        }
    }
  }, []);

  const handleEditClick = (field) => {
    if (field === 'email') {
      setIsEmailEditable((prevState) => !prevState);
    } else if (field === 'phone') {
      setIsPhoneEditable((prevState) => !prevState);
    } else if (field === 'biodata') {
      setIsBiodataEditable((prevState) => !prevState);
    }
  };

  const toggleEditProfileModal = () => {
    setShowEditProfileModal(!showEditProfileModal);
  };

  const toggleChangePasswordModal = () => {
    setShowChangePasswordModal(!showChangePasswordModal);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
  };

  const handleSaveProfile = async () => {
    const uploadImageToCloudinary = async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'EunivateImage'); // Replace with your actual Cloudinary upload preset
      formData.append('cloud_name', 'dzxzc7kwb'); // Replace with your actual Cloudinary cloud name

      try {
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dzxzc7kwb/image/upload',
          formData
        );
        return response.data.url; // This is the URL of the uploaded image
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
    };

    const storedUser = JSON.parse(localStorage.getItem('user')); // Retrieve the stored user data

    if (!storedUser || !storedUser._id) {
      console.error('User is not logged in or user ID is missing.');
      return;
    }

    let profilePictureUrl = profilePicture;
    if (profilePicture instanceof File) {
      try {
        profilePictureUrl = await uploadImageToCloudinary(profilePicture);
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        return;
      }
    } else if (!profilePictureUrl) {
      // If profilePicture is empty or null, set it to default
      profilePictureUrl = defaultProfilePictureUrl;
    }

    const updatedUser = {
      firstName,
      lastName,
      email,
      phoneNumber,
      username,
      profilePicture: profilePictureUrl,
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${storedUser._id}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token in the request
          },
        }
      );
      localStorage.setItem('user', JSON.stringify(response.data)); // Update local storage
      toggleEditProfileModal(); // Close the modal
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword === confirmPassword) {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user')); // Retrieve the stored user data
        if (!storedUser || !storedUser._id) {
          console.error('User is not logged in or user ID is missing.');
          return;
        }

        await axios.put(
          `http://localhost:5000/api/users/${storedUser._id}/password`,
          {
            newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token in the request
            },
          }
        );

        toggleChangePasswordModal(); // Close the modal
      } catch (error) {
        console.error('Error changing password', error);
      }
    } else {
      console.error('Passwords do not match');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={profilePicture || defaultProfilePictureUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full mr-4"
          />
          <div className="flex flex-col">
            <div className="text-lg font-medium">
              {firstName} {lastName}
            </div>
            <p className="text-sm text-gray-600 mt-1">@{username}</p>
          </div>
        </div>
        <button
          onClick={toggleEditProfileModal}
          className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-900"
        >
          Edit User Profile
        </button>
      </div>

      <div className="p-4 bg-gray-100 rounded-lg shadow-md">
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="flex flex-col flex-grow">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 mb-1 ml-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-2 py-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                disabled={!isEmailEditable}
              />
            </div>
            <button
              className="ml-2 px-4 py-1 border border-blue-500 text-blue-500 bg-transparent rounded hover:bg-blue-100 hover:text-blue-700"
              onClick={() => handleEditClick('email')}
            >
              {isEmailEditable ? 'Save' : 'Edit'}
            </button>
          </div>

          <div className="flex items-center">
            <div className="flex flex-col flex-grow">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700 mb-1 ml-1"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="px-2 py-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                disabled={!isPhoneEditable}
              />
            </div>
            <button
              className="ml-2 px-4 py-1 border border-blue-500 text-blue-500 bg-transparent rounded hover:bg-blue-100 hover:text-blue-700"
              onClick={() => handleEditClick('phone')}
            >
              {isPhoneEditable ? 'Save' : 'Edit'}
            </button>
          </div>

          <div className="flex items-center">
            <div className="flex flex-col flex-grow">
              <label
                htmlFor="biodata"
                className="text-sm font-medium text-gray-700 mb-1 ml-1"
              >
                Biodata
              </label>
              <input
                id="biodata"
                type="text"
                value={biodata}
                onChange={(e) => setBiodata(e.target.value)}
                className="px-2 py-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                disabled={!isBiodataEditable}
              />
            </div>
            <button
              className="ml-2 px-4 py-1 border border-blue-500 text-blue-500 bg-transparent rounded hover:bg-blue-100 hover:text-blue-700"
              onClick={() => handleEditClick('biodata')}
            >
              {isBiodataEditable ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h4 className="text-2xl font-bold text-gray-900">
          Password & Authentication
        </h4>
        <p className="mt-2 text-gray-600">
          You can change your password periodically to increase the security of
          your account. Make sure you remember your current password to prove
          that the person who changed the password was actually you.
        </p>
        <div className="mt-3 flex">
          <button
            onClick={toggleChangePasswordModal}
            className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-900"
          >
            Change Password
          </button>
        </div>
      </div>

      <div className="mt-12">
        <h4 className="text-2xl font-bold text-gray-900">
          Two-Factor Authentication
        </h4>
        <p className="mt-2 text-gray-600">
          Protect your account with an extra layer of security. Once configured,
          you will be required to enter both your password and an authentication
          code from your mobile phone in order to sign in.
        </p>
        <div className="mt-3 flex">
          <button className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-900">
            Enable Two-Factor Auth
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="editUsername"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="editUsername"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="editFirstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  id="editFirstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="editLastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id="editLastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="editProfilePicture"
                  className="block text-sm font-medium text-gray-700"
                >
                  Profile Picture
                </label>
                <input
                  id="editProfilePicture"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="mt-1 block w-full"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-start">
              <button
                onClick={toggleEditProfileModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile} // Update this line to save the profile changes
                className="ml-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <FontAwesomeIcon
                      icon={showConfirmPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-start">
              <button
                onClick={toggleChangePasswordModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword} // Update this line to save the password changes
                className="ml-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingProfile;
