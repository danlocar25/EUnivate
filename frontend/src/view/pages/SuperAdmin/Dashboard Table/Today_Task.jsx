import React, { useState } from 'react';
import { FaCheckCircle, FaRegCircle, FaRegCalendarAlt, FaPaperclip, FaFlag } from 'react-icons/fa'; // Import icons
import { format, parseISO } from 'date-fns'; // For date formatting
import filterIcon from '../../../../assets/Filter.png'; // Import the small image

const Today_Task = ({ projects, taskDetails }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const getFlagColor = (priority) => {
        switch (priority) {
            case 'easy':
                return 'text-green-500'; // Green for easy
            case 'medium':
                return 'text-yellow-500'; // Yellow for medium
            case 'hard':
                return 'text-red-500'; // Red for hard
            default:
                return 'text-gray-400'; // Default gray color
        }
    };

    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };

    const renderTodayTasks = () => {
        if (!projects.length) return <p>No tasks for today</p>;

        return projects.map((project) => {
            const { tasks = [] } = taskDetails[project._id] || {};
            
            // Only display projects that have tasks
            if (tasks.length === 0) return null;

            return tasks.map((task, index) => (
                <div 
                    key={index} 
                    className="relative flex items-start mb-4 pb-4 border-b border-gray-300"
                >
                    {/* Checkmark if task is done, otherwise show empty circle */}
                    {task.status === 'Done' ? (
                        <FaCheckCircle className="text-green-500 text-3xl mr-3 relative top-5" />
                    ) : (
                        <FaRegCircle className="text-gray-400 text-3xl mr-3 relative top-5" />
                    )}
                    <div className="flex-1">
                        {/* Display project name above each task */}
                        <h3 className="text-sm text-gray-800 mb-1">{project.projectName}</h3>
                        <div className="text-gray-600 text-sm font-bold">{task.taskName}</div>
                        
                        {/* Display calendar icon, start date, objectives count, attachments count, and priority */}
                        <div className="flex text-xs text-gray-500 mt-1">
                            <div className="flex items-center">
                                {/* Calendar icon and Start Date */}
                                <FaRegCalendarAlt className="text-gray-400 mr-1" />
                                {task.startDate ? format(parseISO(task.startDate), 'd MMM') : 'N/A'}
                            </div>
                            <div className="ml-4 flex items-center">
                                {/* Small image next to objectives */}
                                <img src={filterIcon} alt="Objectives icon" className="w-4 h-4 mr-1" /> {/* Icon always visible */}
                                {/* Display objectives count */}
                                <span className="hidden sm:inline"> {/* Hide text on mobile */}
                                    {task.objectives && task.objectives.length > 0 
                                        ? `${task.objectives.length} Objective` 
                                        : '-'}
                                </span>
                                <span className="sm:hidden">{task.objectives?.length || 0}</span> {/* Show only number on mobile */}
                            </div>
                            <div className="ml-4 flex items-center">
                                {/* Paperclip icon and attachments count */}
                                <FaPaperclip className="text-gray-400 mr-1" />
                                <span className="hidden sm:inline"> {/* Hide text on mobile */}
                                    {task.attachment && task.attachment.length > 0 
                                        ? `${task.attachment.length} Attachment` 
                                        : '-'}
                                </span>
                                <span className="sm:hidden">{task.attachment?.length || 0}</span> {/* Show only number on mobile */}
                            </div>
                            <div className="ml-4 flex items-center">
                                {/* Flag icon for priority */}
                                <FaFlag className={`${getFlagColor(task.priority)} mr-1`} />
                                {/* Priority label */}
                                <span className="hidden sm:inline">{task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'No Priority'}</span> {/* Hide priority label on mobile */}
                            </div>
                        </div>
                    </div>

                    {/* New Attachment section positioned at the right */}
                    {task.attachment && task.attachment.length > 0 && (
                        <div className="absolute right-0 top-0 flex space-x-2">
                            {task.attachment.map((attachment, i) => (
                                <img 
                                    key={i}
                                    src={attachment.url} 
                                    alt="attachment preview" 
                                    className="w-16 h-16 sm:w-12 sm:h-12 rounded-md object-cover border-2 border-gray-200 cursor-pointer" 
                                    onClick={() => openImageModal(attachment.url)} // Open modal on click
                                />
                            ))}
                        </div>
                    )}
                </div>
            ));
        });
    };

    return (
        <div>
            <h2 className="text-medium font-semibold text-gray-800 mb-2">Today Task</h2>
            <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-sm today-task-div">
                {renderTodayTasks()}
            </div>

            {/* Image Modal */}
            {isModalOpen && selectedImage && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div className="relative bg-white p-4 rounded-lg shadow-lg w-96 h-96 flex items-center justify-center">
                        <button className="absolute top-0 right-0 m-2 text-gray-500" onClick={closeModal}>
                            &times;
                        </button>
                        <img src={selectedImage} alt="Full View" className="max-w-full max-h-full object-contain" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Today_Task;
