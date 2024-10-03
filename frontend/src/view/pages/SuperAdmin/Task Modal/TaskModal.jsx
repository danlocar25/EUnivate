import React, { useState } from 'react';
import { FaTimes, FaCheckCircle, FaRegCalendarAlt, FaFlag } from 'react-icons/fa';  // Import flag icon

const TaskModal = ({ task, isOpen, onClose, formatDate }) => {
    if (!task) return null;

    const [message, setMessage] = useState(""); // State to handle the message input
    const [description, setDescription] = useState(task.description || ""); // State to handle the task description
    const [objectives, setObjectives] = useState(task.objectives || []); // State to handle the objectives

    const isTaskDone = task.status.toLowerCase() === 'done';

    // Function to determine flag color based on priority
    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'easy':
                return 'text-green-500'; // Green for easy
            case 'medium':
                return 'text-yellow-500'; // Yellow for medium
            case 'hard':
                return 'text-red-500'; // Red for hard
            default:
                return 'text-gray-500'; // Default color
        }
    };

    // Function to determine background color based on status
    const getStatusColor = (status) => {
        switch (status) {
            case 'Document':
                return 'bg-[#DDFBC5]';
            case 'Todo':
                return 'bg-[#CFE8FF]';
            case 'Ongoing':
                return 'bg-[#FCE9C0]';
            case 'Done':
                return 'bg-[#DBDBDBFF]';
            case 'Backlog':
                return 'bg-[#FED5F2]';
            default:
                return 'bg-gray-200'; // Default color if status is unknown
        }
    };

    // Handle checkbox change for objectives
    const handleObjectiveChange = (index) => {
        const updatedObjectives = objectives.map((objective, idx) => {
            if (index === idx) {
                return {
                    ...objective,
                    completed: !objective.completed, // Toggle the completed status
                };
            }
            return objective;
        });
        setObjectives(updatedObjectives); // Update the objectives state
    };

    // Count the number of completed objectives
    const completedCount = objectives.filter(objective => objective.completed).length;

    return (
        <div
            className={`fixed inset-0 z-50 flex justify-end bg-gray-800 bg-opacity-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div
                className={`bg-white py-6 rounded-l-lg shadow-lg max-w-sm w-full h-full overflow-y-auto transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <button
                    className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={onClose}
                >
                    <FaTimes className="text-1xl" />
                </button>

                <div className="relative">
                    <div className="absolute top-0 left-6 mt-2 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {isTaskDone && (
                            <FaCheckCircle className="text-green-500 text-2xl" />
                        )}
                    </div>
                    <h2 className="text-xm mb-1 mt-5 ml-20">{task.projectName}</h2>
                    <p className="text-md mb-4 ml-20 font-bold text-gray-600">{task.taskName}</p>
                </div>

                {/* Display Assignee with profile picture closer to the Assignee text */}
                <div className="mt-4 flex items-center ml-5 mr-10">
                    <p className="font-semibold">Assignee:</p>
                    <div className="flex items-center">
                        {task.invitedUsers.slice(0, 3).map(user => (
                            <div key={user._id} className="flex items-center ml-2">
                                <img
                                    src={user.profilePicture?.url || 'https://www.imghost.net/ib/YgQep2KBICssXI1_1725211680.png'}
                                    alt={user.username || 'Profile Picture'}
                                    className="w-5 h-5 rounded-full object-cover"  
                                />
                                <p className="ml-2 text-sm">{user.username}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Display Due Date with Calendar Icon */}
                <div className="mt-3 flex items-center ml-5 mr-10">
                    <p className="font-semibold">Due Date:</p>
                    <FaRegCalendarAlt className="text-gray-600 ml-3" />  
                    <p className="text-sm ml-2">{formatDate(task.dueDate)}</p>
                </div>

                {/* Display Priority with Flag Icon and color change based on priority */}
                <div className="mt-3 flex items-center ml-5 mr-10">
                    <p className="font-semibold">Priority:</p>
                    <FaFlag className={`ml-7 ${getPriorityColor(task.priority)}`} />  
                    <p className="ml-2 text-sm">{task.priority}</p>
                </div>

                {/* Display Status with colored box for the status value only */}
                <div className="mt-3 flex items-center ml-5 mr-10">
                    <p className="font-semibold">Status:</p>
                    <div className={`ml-10 px-3 py-1 rounded-md ${getStatusColor(task.status)}`}>
                        <p className="text-sm">{task.status}</p>
                    </div>
                </div>

                {/* Task Description inside textarea */}
                <div className="mt-4 ml-5 mr-5">
                    <p className="font-semibold">Description:</p>
                    <textarea
                        className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} // Allow user to edit the description if needed
                        placeholder="No description available"
                    />
                </div>

                {/* Attachments Section */}
                <div className="mt-4 ml-5 mr-5">
                    <p className="font-semibold">Attachments:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {task.attachments && task.attachments.length > 0 ? (
                            task.attachments.map((attachment, index) => (
                                <img
                                    key={index}
                                    src={attachment.url}
                                    alt={`attachment-${index}`}
                                    className="w-20 h-20 object-cover rounded-md border border-gray-200"
                                />
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No attachments available.</p>
                        )}
                    </div>
                </div>

{/* Objectives Section with Circle Checkboxes */}
<div className="mt-4 ml-5 mr-5">
    <p className="font-semibold">Objectives ({completedCount}/{objectives.length} completed):</p>
    <div className="space-y-2 mt-2">
        {objectives.map((objective, index) => (
            <div key={index} className="flex items-center space-x-2">
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={objective.completed}
                        onChange={() => handleObjectiveChange(index)}
                        className="hidden" // Hide the default checkbox
                    />
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${objective.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                        {objective.completed && (
                            <FaCheckCircle className="text-white text-sm6" /> // Use Font Awesome check icon
                        )}
                    </div>
                </label>
                <p className={`text-sm ${objective.completed ? 'line-through text-gray-500' : ''}`}>
                    {objective.text}
                </p>
            </div>
        ))}
    </div>
</div>

{/* Textarea below the objectives section */}
<div className="mt-4 ml-5 mr-5">
    <textarea
        className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="1" // Reduce the height by setting fewer rows
        value={message}
        onChange={(e) => setMessage(e.target.value)} // Update the message state when the user types
        placeholder="Ask question or post an update"
        style={{ resize: 'none' }} // Prevent the textarea from being resized
    />
</div>




            </div>
        </div>
    );
};

export default TaskModal;
