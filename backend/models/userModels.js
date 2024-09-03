import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        sparse: true, 
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,  
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        publicId: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: false,
        }
    },
    role: {
        type: String, 
        enum: ['User', 'guest', 'members', 'admin', 'superadmin'], 
        default: 'User'
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    refreshToken: [String], 
}, 
{
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
export default User;
