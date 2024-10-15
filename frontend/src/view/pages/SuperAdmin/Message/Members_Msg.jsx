import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Members_Msg = ({ onInvitedUsersFetched }) => {
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workspaces, setWorkspaces] = useState([]); // State to hold workspaces
  const [selectedWorkspace, setSelectedWorkspace] = useState(''); // State to hold selected workspace

  // Fetch workspaces and users when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const accessToken = user ? user.accessToken : null;

        if (!accessToken) {
          setError('Authentication required. Please log in.');
          return;
        }

        // Fetch available workspaces (teams)
        const workspacesResponse = await axios.get('http://localhost:5000/api/users/workspaces', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Set fetched workspaces in state
        setWorkspaces(workspacesResponse.data);

        // Fetch all users
        const allUsersResponse = await axios.get('http://localhost:5000/api/users/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Fetch invited users from projects
        const invitedUsersResponse = await axios.get('http://localhost:5000/api/users/invited', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const allUsers = allUsersResponse.data;
        const invitedUsersList = invitedUsersResponse.data.invitedUsers.map((invitedUser) => {
          const userFromDB = allUsers.find((user) => user.email === invitedUser.email);
          return userFromDB ? { ...invitedUser, ...userFromDB } : invitedUser;
        });

        setInvitedUsers(invitedUsersList);
        setCurrentUser(allUsers.find((u) => u._id === user._id));

        // Pass the invited users back to Messages component
        onInvitedUsersFetched(invitedUsersList);
      } catch (error) {
        setError('Failed to load users and workspaces. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [onInvitedUsersFetched]);

  // UseEffect to load the selected workspace from localStorage on component mount
  useEffect(() => {
    const savedWorkspace = localStorage.getItem('selectedWorkspace');
    if (savedWorkspace) {
      setSelectedWorkspace(savedWorkspace);
    }
  }, []);

  // Handle workspace selection change
  const handleWorkspaceChange = (event) => {
    const selected = event.target.value;
    setSelectedWorkspace(selected);

    // Save the selected workspace to localStorage to persist across refreshes
    localStorage.setItem('selectedWorkspace', selected);
  };

  const totalMembers = invitedUsers.length;

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
      {/* About Section */}
      <div className="mb-4">
        <h2 className="text-sm font-bold text-gray-800">About</h2>
      </div>

      {/* Workspace Selection Dropdown */}
      <div className="mt-4">
        <label htmlFor="workspace" className="block text-sm font-medium text-gray-700">
          Select Workspace (Team)
        </label>
        <select
          id="workspace"
          value={selectedWorkspace}
          onChange={handleWorkspaceChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="" disabled>Select a Workspace</option>
          {workspaces.map((workspace) => (
            <option key={workspace._id} value={workspace._id}>
              {workspace.workspaceTitle}
            </option>
          ))}
        </select>
      </div>

      {/* Workspace Description */}
      <div className="bg-gray-100 p-4 rounded-md h-52 mt-4">
        <p className="text-gray-600 text-sm">Topic</p>
        <p className="text-sm mt-2">All about the workspace topic related only</p>
        <p className="text-gray-600 text-sm mt-5">Description</p>
        <p className="text-sm mt-2">
          In this channel, we can collaborate and communicate with fellow members.
        </p>
      </div>

      {/* Member Count and List */}
      <div className="mt-4 flex items-center">
        <p className="text-gray-800 text-sm font-semibold">Member</p>
        <div className="bg-orange-500 text-white text-sm font-bold ml-2 px-1 py-0.5 rounded-md">
          {totalMembers}
        </div>
      </div>

      {/* Display Current User */}
      {currentUser && (
        <div className="mt-4 flex items-center">
          <div className="relative">
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 border-2 border-white rounded-full"></span>
            <img
              src={currentUser.profilePicture?.url || 'https://www.imghost.net/ib/YgQep2KBICssXI1_1725211680.png'}
              alt={currentUser.username || 'Profile Picture'}
              className="w-8 h-8 rounded-full object-cover border-2 border-white"
            />
          </div>
          <p className="ml-2 text-gray-800 text-sm font-semibold">{currentUser.username} (You)</p>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {/* Invited Members List */}
      <div className="mt-1 flex-grow overflow-y-auto">
        <p className="text-gray-500 text-sm mt-3">Invited Members - {invitedUsers.length}</p>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading users...</p>
        ) : (
          invitedUsers.map((user) => (
            <div key={user._id} className="flex items-center mt-3">
              <div className="relative">
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                <img
                  src={user.profilePicture?.url || 'https://www.imghost.net/ib/YgQep2KBICssXI1_1725211680.png'}
                  alt={user.username || 'Profile Picture'}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white"
                />
              </div>
              <p className="ml-2 text-gray-800 text-sm">{user.username}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Members_Msg;
