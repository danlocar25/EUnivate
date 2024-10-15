import User from '../../../models/Client/userModels.js';
import mongoose from 'mongoose';
import sendEmail from '../../../utils/sendEmail.js';
import InviteMember from '../../../models/SuperAdmin/saInvitedMember.js';
import Project from '../../../models/SuperAdmin/saNewProject.js';


//Please dont remove any comments it's used to debug if the system is not working as it's expected

// Fetch all users
export const getUsers = async (req, res) => {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  };
  
  
// Invite users with storation to sainvitedUser Schema
export const inviteUsers = async (req, res) => {
    try {
        const { userIds, projects, roles, profilePictures } = req.body;
        const inviterId = req.user.id;

        if (!userIds || !userIds.length) {
            return res.status(400).json({ message: 'No valid user IDs provided' });
        }

        await Promise.all(
            userIds.map(async (userId, index) => {
                try {
                    const existingUser = await User.findById(userId);
                    if (!existingUser) {
                        console.warn(`User with ID ${userId} does not exist. Skipping...`);
                        return;
                    }

                    // Check if the user is already invited
                    const invitedUser = await InviteMember.findOne({ email: existingUser.email });
                    if (invitedUser) {
                        if (!invitedUser.invitedBy.includes(inviterId)) {
                            invitedUser.invitedBy.push(inviterId);
                        }
                        invitedUser.role = roles[index] || invitedUser.role;
                        invitedUser.project = [...new Set([...invitedUser.project, ...projects.map(project => project.toString())])];

                        // Ensure profilePicture is an object
                        invitedUser.profilePicture = typeof profilePictures[index] === 'string' 
                            ? { url: profilePictures[index], publicId: '' }
                            : profilePictures[index] || invitedUser.profilePicture;

                        await invitedUser.save();
                    } else {
                        // Create a new invitation if the user is not already invited
                        const newMember = new InviteMember({
                            email: existingUser.email,
                            role: roles[index] || existingUser.role || 'User',
                            project: projects.map(project => project.toString()),
                            invitedBy: [inviterId],
                            userId: existingUser._id,
                            
                            // Ensure profilePicture is an object
                            profilePicture: typeof profilePictures[index] === 'string' 
                                ? { url: profilePictures[index], publicId: '' }
                                : profilePictures[index] || existingUser.profilePicture || {},
                        });

                        await newMember.save();
                    }

                    await sendEmail({
                        email: existingUser.email,
                        subject: 'Invitation to become a Collaborator',
                        message: `You have been invited to join the project. Please check your role and proceed.`,
                    });
                } catch (error) {
                    console.error(`Failed to invite user ID ${userId}:`, error.message);
                }
            })
        );

        res.status(200).json({ message: 'Invitation emails sent successfully' });
    } catch (error) {
        console.error('Error inviting users:', error.message);
        res.status(500).json({ message: 'Error inviting users', error: error.message });
    }
};



//Get Invited Users

export const getInvitedUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        // console.log('Fetching invited users for userId:', userId);  // Log userId to track which user is making the request

        // Fetch invited users and populate the project field with full project details
        const invitedUsers = await InviteMember.find({
            $or: [
                { invitedBy: userId },
                // Add other conditions if needed
            ]
        }).populate('project', 'projectName');  // Populates only the projectName field of related projects

        // console.log('Raw invitedUsers data:', invitedUsers);  // Log the invitedUsers data after fetching and populating

        if (invitedUsers.length === 0) {
            console.log('No invited users found for userId:', userId);  // Log if no invited users are found
            return res.status(404).json({ message: 'No invited users found' });
        }

        // console.log('Sending invitedUsers response:', invitedUsers);  // Log the data before sending the response
        res.status(200).json({ invitedUsers });
    } catch (error) {
        console.error('Error fetching invited users:', error.message);  // Log the error message
        res.status(500).json({ message: 'Error fetching invited users', error: error.message });
    }
};



// Update user role
export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        // console.log(`Updating role for userId: ${userId} to role: ${role}`);

        // Find and update the user role
        const user = await User.findByIdAndUpdate(userId, { role }, { new: true });

        if (!user) {
            console.warn(`User with ID ${userId} not found`);
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the role in InviteMember if the user was found and updated
        await InviteMember.updateMany({ email: user.email }, { role });

        // console.log(`Updated user role for ${user.email} to ${role}`);

        // Send an email to the user notifying them of the role change
        await sendEmail({
            email: user.email,
            subject: 'Your account role has been changed',
            message: `Your account role has been changed to ${role}. Please log in again.`,
        });

        // console.log(`Email notification sent to ${user.email}`);

        res.status(200).json({ message: 'Role updated successfully and email sent', user });
    } catch (error) {
        console.error('Error updating role:', error.message);
        res.status(500).json({ message: 'Error updating role', error: error.message });
    }
};


//Delete the invited members


export const removeInvitedMember = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id: userId } = req.params; // This is the userId, not the _id of saInvitedMember

        // Find and delete the invited member using the userId
        const deletedMember = await InviteMember.findOneAndDelete({ userId }).session(session);

        if (!deletedMember) {
            console.log(`No invited member found with userId: ${userId}`);
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Invited member not found' });
        }

        // Remove the user from the 'projects' field of the User model
        await User.updateMany(
            { projects: deletedMember._id },
            { $pull: { projects: deletedMember._id } },
            { session }
        );

        // Remove the user from the 'invitedUsers' field of the Project model
        await Project.updateMany(
            { invitedUsers: userId },
            { $pull: { invitedUsers: userId } },
            { session }
        );

        await session.commitTransaction(); // Commit the transaction once after all operations are successful
        session.endSession();

        res.status(200).json({ message: 'Invited member removed successfully', deletedMember });
    } catch (error) {
        await session.abortTransaction(); // Abort the transaction in case of an error
        session.endSession();
        console.error('Error removing invited member:', error.message);
        res.status(500).json({ message: 'Error removing invited member', error: error.message });
    }
};