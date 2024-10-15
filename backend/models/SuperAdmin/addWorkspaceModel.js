import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema({
    workspaceTitle: {
        type: String,
        required: true,
        unique: true
    },

    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
      }, 
    
}, {
    timestamps: true
});

const Workspace = mongoose.model('Workspace', workspaceSchema);

export default Workspace;
