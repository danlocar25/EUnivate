import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import axios from 'axios';

const Activity_Task = ({ projects }) => {
    const [profilePicture, setProfilePicture] = useState('');
    const [userName, setUserName] = useState('');
    const [taskDetails, setTaskDetails] = useState({});
    const defaultProfilePictureUrl = 'https://www.imghost.net/ib/YgQep2KBICssXI1_1725211680.png'; // Default image URL

    // Fetch user data and task details for each project
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            // Set the username and profile picture from localStorage
            setUserName(`${storedUser.firstName} ${storedUser.lastName}`);
            setProfilePicture(storedUser.profilePicture?.url || storedUser.profilePicture || defaultProfilePictureUrl);
        }

        const fetchTaskDetails = async () => {
            const taskDetailsPromises = projects.map(async (project) => {
                const response = await axios.get(`http://localhost:5000/api/users/sa-tasks/${project._id}`);
                const tasks = response.data.data;
                return { projectId: project._id, tasks };
            });

            const details = await Promise.all(taskDetailsPromises);
            const taskDetailsMap = details.reduce((acc, { projectId, tasks }) => {
                acc[projectId] = tasks;
                return acc;
            }, {});

            setTaskDetails(taskDetailsMap);
        };

        if (projects.length > 0) {
            fetchTaskDetails();
        }
    }, [projects]);

    const getTaskChanges = (task) => {
        let changesByUser = {};
    
        task.history.forEach((change) => {
            const parsedChanges = JSON.parse(change.changes);
    
            // Safely access modifiedBy.username and provide fallback values
            const username = change.modifiedBy?.username || 'Unknown User';
            const profilePicture = change.modifiedBy?.profilePicture?.url || change.modifiedBy?.profilePicture || defaultProfilePictureUrl;

    
            // Group changes by the user who modified the task
            if (!changesByUser[username]) {
                changesByUser[username] = {
                    profilePicture,
                    changes: []
                };
            }
    
            Object.keys(parsedChanges).forEach((key) => {
                let changeType = '';
                let newValue = parsedChanges[key];
    
                // Set specific labels for the type of change
                switch (key) {
                    case 'taskName':
                        changeType = 'changed task name to';
                        break;
                    case 'description':
                        changeType = 'added new description';
                        break;
                    case 'objectives':
                        changeType = 'updated objectives';
                        newValue = parsedChanges[key].map((objective, index) => (
                              <li key={index}>
                                <span>{objective.text}</span>
                                {objective.done ? (
                                  <span className="text-green-500 ml-2">(Completed)</span>
                                ) : (
                                  <span className="text-red-500 ml-2">(Not Completed)</span>
                                )}
                              </li>
                            ));
                        break;
                    case 'priority':
                        changeType = 'changed the priority to';
                        break;
                    case 'status':
                        changeType = 'changed the status to';
                        break;
                    case 'startDate':
                        changeType = 'changed start date to';
                        newValue = format(new Date(parsedChanges[key]), 'MMM d, yyyy hh:mm a');
                        break;
                    case 'dueDate':
                        changeType = 'changed due date to';
                        newValue = format(new Date(parsedChanges[key]), 'MMM d, yyyy hh:mm a');
                        break;
                    case 'attachment':
                        changeType = 'added new attachment';
                        newValue = Array.isArray(parsedChanges[key])
                            ? parsedChanges[key].map((attachment, index) => (
                                <div key={index}>
                                    <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                        {attachment.publicId}
                                    </a>
                                </div>
                            ))
                            : (
                                <a href={parsedChanges[key].url} target="_blank" rel="noopener noreferrer">
                                    {parsedChanges[key].url}
                                </a>
                            );
                        break;
                    case 'assignee':
                        changeType = 'assigned to';
                        newValue = Array.isArray(parsedChanges[key])
                            ? parsedChanges[key].map((assignee) => assignee.username).join(', ')
                            : 'Other User';
                        break;
                    default:
                        changeType = 'made an update';
                        break;
                }
    
                changesByUser[username].changes.push({
                    type: changeType,
                    newValue,
                    modifiedAt: change.modifiedAt
                });
            });
        });
    
        return changesByUser;
    };
    
    return (
        <div className="w-full h-full">
            <h2 className="text-medium font-semibold text-gray-800 mb-2">Activity</h2>
            <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-sm h-full overflow-y-auto">
                {projects.length > 0 ? (
                    projects.map((project, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex items-center mb-2">
                                <h3 className="text-gray-800 font-medium text-sm">{project.projectName}</h3>
                                <div className="text-gray-500 text-xs flex ml-2 items-center">
                                    <span>&#8226;</span>
                                    <span className="ml-2">{format(new Date(project.createdAt), 'MMM dd, yyyy')}</span>
                                </div>
                            </div>

                            <ul className="mt-5">
                                {taskDetails[project._id] && taskDetails[project._id].length > 0 ? (
                                    taskDetails[project._id].map((task) => {
                                        const changesByUser = getTaskChanges(task);

                                        return (
                                            <li key={task._id} className="mb-2">
                                                <div className="text-gray-800 font-medium text-sm">
                                                    {task.taskName}
                                                </div>

                                                {/* Display changes grouped by user */}
                                                {Object.entries(changesByUser).map(([username, userChanges], idx) => (
                                                    <div key={idx} className="mt-4">
                                                        <div className="flex items-center">
                                                            <img
                                                                src={userChanges.profilePicture}
                                                                alt="Profile"
                                                                className="w-6 h-6 rounded-full object-cover mr-2"
                                                            />
                                                            <span className="text-gray-600 text-sm font-semibold">
                                                                {username}
                                                            </span>
                                                        </div>
                                                        <ul className="pl-10 ">
                                                            {userChanges.changes.map((change, idx) => (
                                                                <li key={idx} className="text-sm text-gray-500 mb-2">
                                                                    {change.type}{' '}
                                                                    <span className="text-blue-500">
                                                                        {typeof change.newValue === 'object' ? (
                                                                            <ul>{change.newValue}</ul>
                                                                        ) : (
                                                                            change.newValue
                                                                        )}
                                                                    </span>
                                                                    
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </li>
                                        );
                                    })
                                ) : (
                                    <p className="text-gray-500">No tasks available</p>
                                )}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No activity available</p>
                )}
            </div>
        </div>
    );
};

export default Activity_Task;