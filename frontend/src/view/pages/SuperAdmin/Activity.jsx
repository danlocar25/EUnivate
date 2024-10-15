import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../admin.css';
import AdminNavbar from '../../components/SuperAdmin/AdminNavbar';
import { format } from 'date-fns'; // For date formatting

const Activity = () => {
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const [taskDetails, setTaskDetails] = useState({});
    const [userName, setUserName] = useState('');
    const [profilePicture, setProfilePicture] = useState('');

    const defaultProfilePictureUrl = 'https://www.imghost.net/ib/YgQep2KBICssXI1_1725211680.png'; // Default avatar image

    const toggleAccountDropdown = () => setIsAccountDropdownOpen(!isAccountDropdownOpen);

    // Fetch project and task details
    useEffect(() => {
        const fetchProjectsAndTasks = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const accessToken = user ? user.accessToken : null;

                // Fetch username and profile picture
                setUserName(`${user.firstName} ${user.lastName}`);
                if (user.profilePicture && user.profilePicture.url) {
                    setProfilePicture(user.profilePicture.url);
                } else {
                    setProfilePicture(defaultProfilePictureUrl);
                }

                const projectResponse = await axios.get('http://localhost:5000/api/users/sa-getnewproject', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                setProjects(projectResponse.data);

                const taskDetailsPromises = projectResponse.data.map(async (project) => {
                    const taskResponse = await axios.get(`http://localhost:5000/api/users/sa-tasks/${project._id}`);
                    const tasks = taskResponse.data.data;

                    return { projectId: project._id, tasks };
                });

                const details = await Promise.all(taskDetailsPromises);

                const taskDetailsMap = details.reduce((acc, { projectId, tasks }) => {
                    acc[projectId] = tasks;
                    return acc;
                }, {});

                setTaskDetails(taskDetailsMap);
            } catch (error) {
                console.error('Error fetching projects and tasks:', error);
            }
        };

        fetchProjectsAndTasks();
    }, []);

    // Function to determine what to display based on task changes
    const getTaskChanges = (task) => {
        let changes = [];

        const isTaskNew = task.createdAt === task.updatedAt;

        // Detect if the task was just created
        if (isTaskNew) {
            changes.push({
                type: 'created',
                label: 'Add task',
                value: task.taskName
            });
        }

        // Check if the start date was changed
        if (task.startDate && !isTaskNew && task.startDate !== task.previousStartDate) {
            changes.push({
                type: 'startDate',
                label: 'Change start date to',
                value: format(new Date(task.startDate), 'MMM dd, yyyy')
            });
        } else if (task.startDate && isTaskNew) {
            changes.push({
                type: 'startDate',
                label: 'Add start date',
                value: format(new Date(task.startDate), 'MMM dd, yyyy')
            });
        }

        // Check if the due date was changed
        if (task.dueDate && !isTaskNew && task.dueDate !== task.previousDueDate) {
            changes.push({
                type: 'dueDate',
                label: 'Change due date to',
                value: format(new Date(task.dueDate), 'MMM dd, yyyy')
            });
        } else if (task.dueDate && isTaskNew) {
            changes.push({
                type: 'dueDate',
                label: 'Add due date',
                value: format(new Date(task.dueDate), 'MMM dd, yyyy')
            });
        }

        // Check if the priority was changed
        if (task.priority && !isTaskNew && task.priority !== task.previousPriority) {
            changes.push({
                type: 'priority',
                label: 'Change priority to',
                value: task.priority
            });
        } else if (task.priority && isTaskNew) {
            changes.push({
                type: 'priority',
                label: 'Add priority to',
                value: task.priority
            });
        }

        // Check if the status was changed
        if (task.status && !isTaskNew && task.status !== task.previousStatus) {
            changes.push({
                type: 'status',
                label: 'Change status to',
                value: task.status
            });
        } else if (task.status && isTaskNew) {
            changes.push({
                type: 'status',
                label: 'Add status to',
                value: task.status
            });
        }

        return changes;
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-4">
                <div className="relative">
                    <h1 className="text-lg md:text-2xl font-medium text-gray-800 hidden md:block">
                        Activity
                    </h1>
                </div>
                <AdminNavbar
                    isAccountDropdownOpen={isAccountDropdownOpen}
                    toggleAccountDropdown={toggleAccountDropdown}
                />
            </div>

            {/* Project and Task Content */}
            <div className="bg-white p-4 md:p-6 border border-gray-300 rounded-lg shadow-sm">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <div key={project._id} className="mb-6">
                            <div className="flex items-center">
                                <h2 className="text-lg md:text-2xs text-gray-800">
                                    {project.projectName}
                                </h2>
                                <div className="text-gray-500 text-xs md:text-sm flex items-center ml-2">
                                    <span>&#8226;</span> {/* Bullet Point */}
                                    <span className="ml-2 ">
                                        {format(new Date(project.createdAt), 'MMM dd, yyyy')}
                                    </span> {/* Date */}
                                </div>
                            </div>
                            <ul className="mt-2 relative">
                                {taskDetails[project._id] && taskDetails[project._id].length > 0 ? (
                                    taskDetails[project._id].map((task) => {
                                        const taskChanges = getTaskChanges(task);

                                        if (taskChanges.length === 0) return null;

                                        // Chunk taskChanges into groups of 4
                                        const changeGroups = [];
                                        for (let i = 0; i < taskChanges.length; i += 4) {
                                            changeGroups.push(taskChanges.slice(i, i + 4));
                                        }

                                        return (
                                            <div key={task._id} className="mb-6">
                                                {/* Task Name */}
                                                <div className="mb-2">
                                                    <span className="text-lg md:text-2xl font-semibold">{task.taskName}</span>
                                                </div>

                                                {/* Render each group of 4 changes with its own line */}
                                                {changeGroups.map((changes, groupIndex) => (
                                                    <div key={groupIndex} className="relative">
                                                        <div className={`absolute left-[3px] md:left-1 top-4 bottom-5 md:top-5 md:bottom-6 border-l-2 border-violet-500`}></div> {/* Adjusted line positioning */}
                                                        {changes.map((change, index) => (
                                                            <li key={index} className="mb-4 flex items-start">
                                                                <div className="flex items-center">
                                                                    <span className="text-violet-500 text-xl md:text-2xl">&#8226;</span> {/* Violet Bullet Point */}
                                                                    <img
                                                                        src={profilePicture || defaultProfilePictureUrl}
                                                                        alt="Profile"
                                                                        className="w-6 h-6 md:w-8 md:h-8 rounded-full ml-2"
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col ml-3">
                                                                    <div className="text-sm md:text-base text-gray-700">
                                                                        <span className="font-medium mr-1">
                                                                            {userName}
                                                                        </span>
                                                                        <span className="text-gray-500">
                                                                            {change.label}
                                                                        </span>
                                                                        <span className="text-blue-500 ml-1">
                                                                            {change.value}
                                                                        </span>
                                                                    </div>
                                                                    <span className="text-xs md:text-sm text-gray-500">
                                                                        {format(new Date(task.updatedAt), 'MMM dd, yyyy hh:mm a')}
                                                                    </span>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-lg text-gray-500">No tasks available</p>
                                )}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p className="text-lg text-gray-500">No projects available</p>
                )}
            </div>
        </div>
    );
};

export default Activity;