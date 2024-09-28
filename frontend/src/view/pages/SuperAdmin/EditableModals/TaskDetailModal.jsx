import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaTimes, FaCircle, FaFlag, FaEdit, FaTrash, FaPlus, FaCheckCircle } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TaskDetailModal = ({ isOpen, onClose, task, projectName, onUpdateTask }) => {
  if (!task) return null;

  // State hooks for managing form inputs and other data
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [newObjective, setNewObjective] = useState('');
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');
  const [comment, setComment] = useState('');
  const [isAddingObjective, setIsAddingObjective] = useState(false);
  const [commentsList, setCommentsList] = useState([]);
  const [startDate, setStartDate] = useState(new Date(task.startDate));
  const [dueDate, setDueDate] = useState(new Date(task.dueDate));
  const [isEditingTaskName, setIsEditingTaskName] = useState(false);
  const [editedTaskName, setEditedTaskName] = useState(task.taskName);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [isEditingStartDate, setIsEditingStartDate] = useState(false);
  const [isEditingDueDate, setIsEditingDueDate] = useState(false);
  const [showSaveStartDateButton, setShowSaveStartDateButton] = useState(false);
  const [showSaveDueDateButton, setShowSaveDueDateButton] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(task.priority);  // Store selected priority
  const [selectedStatus, setSelectedStatus] = useState(task.status);      
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [isEditingPriority, setIsEditingPriority] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [showSavePriorityButton, setShowSavePriorityButton] = useState(false);
  const [showSaveStatusButton, setShowSaveStatusButton] = useState(false);

  const [editedAssignees, setEditedAssignees] = useState(task.assignee || [])


  const handleTaskNameClick = () => {
    setIsEditingTaskName(true);
    setShowSaveButton(false); // Hide save button initially
  };

  const updateTaskInDatabase = async (updatedTask) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/sa-tasks/${task._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Task updated successfully:', data);
      } else {
        console.error('Error updating task:', data.message);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleSaveTaskName = () => {
    const updatedTask = { ...task, taskName: editedTaskName };
    onUpdateTask(updatedTask); // Update the UI state
    updateTaskInDatabase(updatedTask); // Send update to the backend
    setIsEditingTaskName(false);
  };

  const handleSaveStartDate = () => {
    const updatedTask = { ...task, startDate };
    onUpdateTask(updatedTask); // Update the UI state
    updateTaskInDatabase(updatedTask); // Send update to the backend
    setIsEditingStartDate(false);
    setShowSaveStartDateButton(false);
};

const handleSaveDueDate = () => {
    const updatedTask = { ...task, dueDate };
    onUpdateTask(updatedTask); // Update the UI state
    updateTaskInDatabase(updatedTask); // Send update to the backend
    setIsEditingDueDate(false);
    setShowSaveDueDateButton(false);
};

  const handleTaskNameChange = (e) => {
    setEditedTaskName(e.target.value);
    setShowSaveButton(true); // Show save button when input changes
  };
  const handleSavePriority = () => {
    const updatedTask = { ...task, priority: selectedPriority };
    onUpdateTask(updatedTask);
    updateTaskInDatabase(updatedTask);
    setShowSavePriorityButton(false);
  };
  const handlePriorityClick = () => {
    setShowPriorityDropdown(!showPriorityDropdown);
  };

  const handlePriorityChange = (newPriority) => {
    setSelectedPriority(newPriority);
    setShowSavePriorityButton(true);
    setShowPriorityDropdown(false);
  };




  const handleStatusClick = () => {
    setShowStatusDropdown(!showStatusDropdown);
  };

  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
    setShowSaveStatusButton(true);
    setShowStatusDropdown(false);
  
    // Update the task's status in the UI immediately
    const updatedTask = { ...task, status: newStatus };
    onUpdateTask(updatedTask);
  };

  const handleSaveStatus = async () => {
    const updatedTask = { ...task, status: selectedStatus };
    console.log("Saving status:", updatedTask.status); // Debugging output
    
    // Update UI state
    onUpdateTask(updatedTask);
  
    // Update the database
    await updateTaskInDatabase(updatedTask);
  
    // Close save button
    setShowSaveStatusButton(false);
  };



  const handleDateChange = (dateType, date) => {
    if (dateType === 'start') {
      setStartDate(date);
      setShowSaveStartDateButton(true);
    } else {
      setDueDate(date);
      setShowSaveDueDateButton(true);
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      const updatedAttachments = [...task.attachment, { url }];
      onUpdateTask({ ...task, attachment: updatedAttachments });
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'easy':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'hard':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditDescription = () => {
    setIsEditing(true);
};

const handleSaveDescription = async () => {
    const updatedTask = { ...task, description: editedDescription };
    console.log("Saving description:", updatedTask.description); // Debugging output
    
    // Update UI state
    onUpdateTask(updatedTask);
    const response = await updateTaskInDatabase(updatedTask);
    // Update the database
    await updateTaskInDatabase(updatedTask);
  
    // Stop editing mode
    setIsEditing(false);
};
  const handleDeleteObjective = (objective) => {
    const updatedObjectives = task.objectives.filter(obj => obj !== objective);
    onUpdateTask({ ...task, objectives: updatedObjectives });
  };

  const handleAddObjective = () => {
    if (newObjective) {
      const updatedObjectives = [...task.objectives, newObjective];
      onUpdateTask({ ...task, objectives: updatedObjectives });
      setNewObjective('');
      setIsAddingObjective(false);
    }
  };

  const handleDeleteAttachment = (attachmentUrl) => {
    const updatedAttachments = task.attachment.filter(att => att.url !== attachmentUrl);
    onUpdateTask({ ...task, attachment: updatedAttachments });
  };

  const handleAddAttachment = () => {
    if (newAttachmentUrl) {
      const updatedAttachments = [...task.attachment, { url: newAttachmentUrl }];
      onUpdateTask({ ...task, attachment: updatedAttachments });
      setNewAttachmentUrl('');
    }
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      const newComment = {
        text: comment,
        name: "Your Name",
        avatar: "path/to/your/avatar.jpg"
      };
      setCommentsList([...commentsList, newComment]);
      setComment('');
    }
  };

  const handleAddAssignee = (newAssignee) => {
    if (!editedAssignees.some(assignee => assignee._id === newAssignee._id)) {
      setEditedAssignees([...editedAssignees, newAssignee]);
    }
  };

  const handleRemoveAssignee = (assigneeToRemove) => {
    const updatedAssignees = editedAssignees.filter(assignee => assignee._id !== assigneeToRemove._id);
    setEditedAssignees(updatedAssignees);
  };

  const handleSaveAssignees = async () => {
    const updatedTask = { ...task, assignee: editedAssignees.map(assignee => assignee._id) };
    onUpdateTask(updatedTask);
    await updateTaskInDatabase(updatedTask);
  };

  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    className="flex items-center justify-center"
    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end"
  >
    <div className="bg-white rounded-lg shadow-lg p-6 w-96 h-[100vh] max-h-[100vh] overflow-y-auto relative">
      <FaTimes className="absolute top-4 right-4 cursor-pointer text-gray-600 hover:text-gray-800" size={20} onClick={onClose} />

      <div className="flex items-center mb-4">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${task.status === 'Done' ? 'bg-green-500' : 'bg-gray-300'}`}>
          {task.status === 'Done' ? <FaCheckCircle className="text-white" size={20} /> : <FaCircle className="text-white" size={20} />}
        </div>
        <div className="ml-2">
          <h2 className="text-sm text-gray-500 font-semibold">{projectName}</h2>
          {isEditingTaskName ? (
            <div className="flex items-center">
              <input
                type="text"
                className="text-xl font-semibold text-gray-500 border-b border-gray-300 mr-2"
                value={editedTaskName}
                onChange={handleTaskNameChange}
                onBlur={handleSaveTaskName} // Save when input loses focus
                autoFocus
              />
              {showSaveButton && (
                <button className="bg-red-500 text-white py-1 px-2 rounded ml-2" onClick={handleSaveTaskName}>
                  Save
                </button>
              )}
            </div>
          ) : (
            <h2
              className="text-xl font-semibold text-gray-500 cursor-pointer"
              onClick={handleTaskNameClick}
            >
              {task.taskName}
            </h2>
          )}
        </div>
      </div>


        {/* Assignees */}
        <div className="mb-4 flex items-center">
          <strong className="mr-2 text-gray-500 font-semibold">Assignees:</strong>
          <div className='flex -space-x-2'> 
            {editedAssignees.map((member, index) => (
              <img 
                key={index} 
                src={member.profilePicture} 
                alt={member.name} 
                className="w-8 h-8 rounded-full border-2 border-white" 
                title={member.name} 
              />
            ))}
            <FaPlus 
              className="cursor-pointer text-gray-500 hover:text-black ml-2"
              onClick={() => {/* logic to show modal or dropdown to add assignee */}} 
            />
          </div>
        </div>
        
        {/* Add a button to save assignees */}
        <button 
          className="bg-red-500 text-white py-1 px-2 rounded ml-2" 
          onClick={handleSaveAssignees}
        >
          Save Assignees
        </button>


            {/* Start Date */}
          <div className="mb-4 flex items-center text-gray-500 relative">
              <div className='text-gray-500 font-semibold'>Start Date:</div>
              <DatePicker
                  selected={startDate}
                  onChange={(date) => handleDateChange('start', date)}
                  className="ml-2 p-1 bg-transparent"
                  dateFormat="MM/dd/yyyy"
                  popperClassName="bg-white"
              />
              {showSaveStartDateButton && (
                  <button
                      className="bg-red-500 text-white py-1 px-2 rounded ml-2"
                      onClick={handleSaveStartDate}
                  >
                      Save
                  </button>
              )}
          </div>

          {/* Due Date */}
          <div className="mb-4 flex items-center text-gray-500 relative">
              <div className='text-gray-500 font-semibold'>Due Date:</div>
              <DatePicker
                  selected={dueDate}
                  onChange={(date) => handleDateChange('due', date)}
                  className="ml-2 p-1 bg-transparent"
                  dateFormat="MM/dd/yyyy"
                  popperClassName="bg-white"
              />
              {showSaveDueDateButton && (
                  <button
                      className="bg-red-500 text-white py-1 px-2 rounded ml-2"
                      onClick={handleSaveDueDate}
                  >
                      Save
                  </button>
              )}
          </div>


            {/* Priority */}

            <div className="mb-4 flex items-center text-gray-500 relative">
                    <div className="text-gray-500 font-semibold">Priority:</div>
                    <div className="ml-9 flex items-center cursor-pointer" onClick={handlePriorityClick}>
                      <FaFlag className={getPriorityColor(selectedPriority)} />
                      <span className={`ml-2 ${getPriorityColor(selectedPriority)}`}>{selectedPriority.charAt(0).toUpperCase() + selectedPriority.slice(1)}</span>
                    </div>

                    {showPriorityDropdown && (
                      <div className="absolute top-10 left-20 bg-white border border-gray-300 shadow-lg rounded-md w-40 z-10">
                        <ul>
                          {['easy', 'medium', 'hard'].map((priority) => (
                            <li
                              key={priority}
                              className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 ${getPriorityColor(priority)}`}
                              onClick={() => handlePriorityChange(priority)}
                            >
                              <FaFlag className={getPriorityColor(priority)} />
                              <span className="ml-2">{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {showSavePriorityButton && (
                      <button className="bg-red-500 text-white py-1 px-2 rounded ml-2" onClick={handleSavePriority}>
                        Save
                      </button>
                    )}
                  </div>

                  {/* Status */}
                            <div className="mb-4 flex items-center space-x-4">
            <label className="block text-gray-700 text-sm font-semibold">Status</label>
            <div className="relative">
              <button
                type="button"
                onClick={handleStatusClick}
                className="text-gray-700 px-4 py-2 border-gray-300 rounded flex items-center space-x-2"
              >
                <span>{selectedStatus || 'Select Status'}</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              {showStatusDropdown && (
                <div className="absolute top-full right-0 bg-white border left-0 border-gray-300 rounded shadow-lg mt-1 w-48 z-10">
                  {['Document', 'Todo', 'Ongoing', 'Done', 'Backlog'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleStatusChange(item)}
                      className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {showSaveStatusButton && (
              <button className="bg-red-500 text-white py-1 px-2 rounded ml-2" onClick={handleSaveStatus}>
                Save
              </button>
            )}
          </div>


      {/* Description */}
<div className="mb-4">
  <div className="flex justify-between items-center">
    <div className="text-gray-500 font-semibold">Description:</div>
    <FaEdit
      className="cursor-pointer text-gray-500 hover:text-gray-700"
      size={18}
      onClick={handleEditDescription}
    />
  </div>
  {isEditing ? (
    <div>
      <textarea
        className="w-full mt-2 p-2 border border-gray-300 rounded text-sm"
        value={editedDescription}
        onChange={(e) => setEditedDescription(e.target.value)}
      />
      <button
        className="mt-2 bg-red-500 text-white py-1 px-4 rounded text-sm hover:bg-red-600 transition-all duration-200"
        onClick={handleSaveDescription}
      >
        Save
      </button>
    </div>
  ) : (
    <div className="relative">
      <p className="mt-2 text-gray-500 text-sm">{task.description}</p>
    </div>
  )}
</div>


        {/* Objectives */}
        <div className="mb-4">
          <div className="mb-4 flex justify-between items-center">
            <div className="text-gray-500 font-semibold">Objectives:</div>
            <FaPlus className="cursor-pointer text-gray-500 hover:text-black" onClick={() => setIsAddingObjective(!isAddingObjective)} />
          </div>
          {task.objectives && task.objectives.length > 0 ? (
  <ul className="list-disc list-inside">
    {task.objectives.map((objective, index) => (
      <li key={index} className="mt-1 flex justify-between items-center text-gray-500 text-sm">
        {/* Access the correct field of the objective object */}
        {typeof objective === 'string' ? objective : objective.text} 
        <FaTrash
          className="ml-2 cursor-pointer text-red-500 hover:text-red-700"
          onClick={() => handleDeleteObjective(objective)}
        />
      </li>
    ))}
  </ul>
) : (
  <span className="text-gray-500 text-sm">No objectives defined</span>
)}
          {isAddingObjective && (
            <div className="mt-2 flex">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="New objective"
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
              />
              <button className="ml-2 bg-red-700 text-white py-1 px-4 rounded text-sm" onClick={handleAddObjective}>Add</button>
            </div>
          )}
        </div>
        
        {/* Attachments */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <div className="text-gray-500 font-semibold">Attachments:</div>
            <FaPlus
              className="cursor-pointer text-gray-500 hover:text-black"
              onClick={() => document.getElementById('attachmentInput').click()}
            />
          </div>
          <input
            type="file"
            id="attachmentInput"
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
          />
          {task.attachment && task.attachment.length > 0 ? (
            <div className="flex overflow-x-auto space-x-2 py-2">
              {task.attachment.map((attachment, index) => (
                <div key={index} className="relative">

                  <img src={attachment.url} 
                  alt={`Attachment ${index + 1}`} 
                  className="w-32 h-32 object-cover rounded-md" />

                  <FaTrash
                    className="absolute top-1 right-1 cursor-pointer text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteAttachment(attachment.url)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <span className="text-gray-500">No attachments</span>
          )}
        </div>

        {/* Comments */}
        <div className="mb-4">
          <textarea
            className="w-full mt-2 p-2 border border-gray-300 rounded"
            placeholder="Ask question or post an update"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="mt-2 bg-red-700 text-white py-2 px-6 rounded text-md w-full hover:bg-red-700 transition-all duration-200"
            onClick={handleCommentSubmit}
          >
            Post
          </button>

          {/* Render posted comments */}
          <div className="mt-4">
            <h3 className="font-semibold text-gray-500">Comments:</h3>
            {commentsList.length > 0 ? (
              <ul className="list-disc list-inside">
                {commentsList.map((cmt, index) => (
                  <li key={index} className="mt-1 flex items-start text-gray-500">

                    <img 
                    src={cmt.avatar}
                    alt={cmt.name} 
                    className="w-8 h-8 rounded-full mr-2" />
                    
                    <div>
                      <strong>{cmt.name}</strong>
                      <p>{cmt.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-gray-500">No comments yet.</span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailModal;