import Workspace from "../../models/SuperAdmin/addWorkspaceModel.js";


export const addNewWorkspace = async (req, res) => {
    try {
        const { workspaceTitle } = req.body;

        const addWorkspace = new Workspace({
            workspaceTitle: workspaceTitle,
            owner: req.user._id, 
        });

        
        const savedWorkspace = await addWorkspace.save();


        return res.status(201).json(savedWorkspace);
    } catch (error) {
        console.error("Error in creating newWorkspace:", error.message);
        return res.status(500).json({ error: error.message || 'An error occurred while creating the Workspace' });
    }
};


export const getAllWorkspaces = async (req, res) => {
    const userId = req.user._id; // Assuming you have middleware to set req.user
    try {
        const workspaces = await Workspace.find({ owner: userId }); // Adjust based on your data model
        res.status(200).json(workspaces);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving workspaces", error });
    }
};









