import SaNewProject from '../../../models/SuperAdmin/saNewProject.js';
import User from '../../../models/Client/userModels.js';



export const createSaNewProject = async (req, res) => {
    try {
      const { projectName, thumbnail, invitedUsers, workspaceId } = req.body;

        if (!projectName || !thumbnail || !workspaceId || !req.user) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newSaNewProject = new SaNewProject({
            projectName,
            thumbnail,
            workspaceId,  
            owner: req.user._id,  
            invitedUsers
        });

      
        const savedSaNewProject = await newSaNewProject.save();
        return res.status(201).json(savedSaNewProject);
    } catch (error) {
        
        console.error("Error in createSaNewProject:", error);

        return res.status(500).json({
            error: error.message || 'An error occurred while creating the SaNewProject'
        });
    }
};



export const getAllProjects = async (req, res) => {
    try {
      const { workspaceId } = req.query; // Get the workspaceId from query parameters
  
      // Validate the workspaceId
      if (!workspaceId) {
        return res.status(400).json({ message: 'Workspace ID is required' });
      }
  
      // Find the user and populate their projects
      const user = await User.findById(req.user._id).populate({
        path: 'projects',
        match: { workspaceId }, // Filter user's projects by the workspaceId
        populate: {
          path: 'invitedUsers',
          select: 'username profilePicture'
        }
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Find owned and invited projects that match the workspaceId
      const ownedProjects = await SaNewProject.find({ owner: req.user._id, workspaceId })
        .populate('invitedUsers', 'username profilePicture');
      const invitedProjects = await SaNewProject.find({ invitedUsers: req.user._id, workspaceId })
        .populate('invitedUsers', 'username profilePicture');
  
      // Combine the projects
      const allProjects = [...ownedProjects, ...invitedProjects, ...user.projects];
  
      // Check if there are any projects
      if (allProjects.length === 0) {
        return res.status(404).json({ message: 'No projects found for the selected workspace' });
      }
  
      // Send the filtered projects as a response
      return res.status(200).json(allProjects);
    } catch (error) {
      console.error("Error in fetching projects:", error.message);
      return res.status(500).json({ error: error.message || 'An error occurred while fetching the projects' });
    }
  };
  
  
  
//Get Project by id
export const getProjectById = async (req, res) => {
    try {
        const projectId = req.params.id;    

        // Fetch project by ID from the database
        const project = await SaNewProject.findById(projectId)
        .populate('invitedUsers', 'username profilePicture') // Populate invitedUsers with username and profilePicture
        .exec();

        // Check if project exists
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        return res.status(200).json(project);
    } catch (error) {
        console.error("Error in fetching project:", error.message);
        return res.status(500).json({ error: error.message || 'An error occurred while fetching the project' });
    }
};


export const inviteUsersToProject = async (req, res) => {
    try {
        const { projectId, users } = req.body;

        // Debugging log
        console.log("Request Body:", req.body);

        // Validate input
        if (!Array.isArray(users) || !projectId) {
            return res.status(400).json({ message: 'Invalid input data' });
        }

        const project = await SaNewProject.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const alreadyInvited = users.filter(userId => 
            project.invitedUsers.includes(userId)
        );

        if (alreadyInvited.length > 0) {
            return res.status(400).json({ message: 'Some users are already invited.' });
        }

        // Check if current user is the owner
        if (!req.user || project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You do not have permission to invite users to this project' });
        }

        // Add user IDs directly to the invitedUsers array
        project.invitedUsers = [...new Set([...project.invitedUsers, ...users])]; // Prevent duplicates
        await project.save();

        return res.status(200).json(project);
    } catch (error) {
        console.error("Error in inviting users:", error.message);
        return res.status(500).json({ error: error.message || 'An error occurred while inviting users' });
    }
};
