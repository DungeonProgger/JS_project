import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Select from 'react-select';
import ParticipantCard from './ParticipantCard';
const styles = require('./TasksPage.css');

const TasksPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [projectId, setProjectId] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [progress, setProgress] = useState(0);
    const [editingTask, setEditingTask] = useState(null);
    const [showAddParticipantForm, setShowAddParticipantForm] = useState(false);
    const [newParticipantName, setNewParticipantName] = useState('');
    const [newParticipantEmail, setNewParticipantEmail] = useState('');
    const [newParticipantRole, setNewParticipantRole] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); 

    const formRef = useRef(null); // Reference to the form for scrolling

    const fetchParticipants = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/participants');
            setParticipants(response.data);
        } catch (error) {
            console.error('Error fetching participants:', error.message);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error.message);
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error.message);
        }
    };

    useEffect(() => {
        fetchParticipants();
        fetchProjects();
        fetchTasks();
    }, []);

    // Фильтрация задач
    const filteredTasks = tasks.filter((task) =>
        task.title.includes(searchQuery)
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedParticipants.length === 0) {
            alert('Please select at least one participant.');
            return;
        }

        try {
            const selectedIds = selectedParticipants.map(participant => participant.value);

            if (editingTask) {
                await axios.put(`http://localhost:3000/api/tasks/${editingTask.task_id}`, {
                    title,
                    description,
                    project_id: projectId ? projectId.value : null,
                    participant_ids: selectedIds,
                    progress
                });
                setEditingTask(null);
            } else {
                await axios.post('http://localhost:3000/api/tasks', {
                    title,
                    description,
                    project_id: projectId ? projectId.value : null,
                    participant_ids: selectedIds,
                    progress
                });
            }

            setTitle('');
            setDescription('');
            setProjectId(null);
            setSelectedParticipants([]);
            setProgress(0);
            fetchTasks();

            setShowForm(false);
        } catch (error) {
            console.error('Error submitting task:', error.message);
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setTitle(task.title);
        setDescription(task.description);
        setProjectId({ value: task.project_id, label: task.project_name });
        setSelectedParticipants(task.participants.map(p => ({ value: p.participant_id, label: p.participant_name })));
        setProgress(task.progress);
        setShowForm(true);

        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleDelete = async (taskId) => {
        try {
            await axios.delete(`http://localhost:3000/api/tasks/${taskId}`);
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error.message);
        }
    };

    const handleProgressChange = (e) => {
        setProgress(e.target.value);
    };

    const calculateProgressColor = (progress) => {
        if (progress <= 50) {
            const green = Math.floor((progress / 50) * 255);
            return `rgb(255, ${green}, 0)`;
        } else {
            const red = Math.floor(((100 - progress) / 50) * 255);
            return `rgb(${red}, 255, 0)`;
        }
    };

    const handleAddParticipant = async (e) => {
        e.preventDefault();

        // Валидация данных
        if (!newParticipantName || !newParticipantEmail || !newParticipantRole) {
            console.error('All fields are required');
            return;
        }

        try {

            const response = await axios.post('http://localhost:3000/api/participants', {
                name: newParticipantName,
                email: newParticipantEmail,
                role: newParticipantRole,
            });


            setNewParticipantName('');
            setNewParticipantEmail('');
            setNewParticipantRole(''); 


            fetchParticipants();


            setShowAddParticipantForm(false);

            console.log('Participant added successfully:', response.data);
        } catch (error) {

            console.error('Error adding participant:', error.response ? error.response.data : error.message);
            alert('Failed to add participant. Please try again.');
        }
    };

    return (
        <div className="tasks-container">
            <div className="tasks-button-container">
                <a href="/projects" className="tasks-button">Projects</a>
            </div>
            <div className="tasks-left">
                <h1>Tasks</h1>

                {/* поиск */}
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search tasks by title"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="add-task-btn-container">
                    <button onClick={() => setShowForm(!showForm)} className="toggle-form-btn">
                        {showForm ? 'Close Form' : 'Add Task'}
                    </button>
                </div>

                {showForm && (
                    <form ref={formRef} onSubmit={handleSubmit} className="add-task-form">
                        <div className="form-group">
                            <label>Title:</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="input-field"
                            />
                        </div>
                        <div className="form-group">
                            <label>Description:</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="textarea-field"
                            />
                        </div>
                        <div className="form-group">
                            <label>Project:</label>
                            <Select
                                options={projects.map(project => ({
                                    value: project.project_id,
                                    label: project.project_name
                                }))}
                                value={projectId}
                                onChange={setProjectId}
                                required
                                className="select-field"
                            />
                        </div>
                        <div className="form-group">
                            <label>Assign Participants:</label>
                            <Select
                                isMulti
                                options={participants.map(participant => ({
                                    value: participant.id,
                                    label: participant.name
                                }))}
                                value={selectedParticipants}
                                onChange={setSelectedParticipants}
                                className="select-field"
                            />
                        </div>
                        <div className="form-group">
                            <label>Progress:</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={progress}
                                onChange={handleProgressChange}
                                className="range-input"
                            />
                            <span>{progress}%</span>
                        </div>
                        <button type="submit" className="submit-btn">
                            {editingTask ? 'Update Task' : 'Create Task'}
                        </button>
                    </form>
                )}

                <div className="task-cards-container">
                    {/* Отображаем отфильтрованные задачи */}
                    {filteredTasks.map((task) => (
                        <div key={task.task_id} className="task-card">
                            <div>
                                <strong className="task-title">{task.title}</strong>
                                <p><strong>Project:</strong> {task.project_name}</p>
                                <p><strong>Description:</strong> {task.description}</p>
                                <p><strong>Status:</strong> {task.status}</p>
                                <p><strong>Participants:</strong> {task.participants.map(p => p.participant_name).join(', ')}</p>
                                <p><strong>Progress:</strong> {task.progress}%</p>
                                <div className="progress-bar-container">
                                    <div
                                        className="progress-bar"
                                        style={{
                                            width: `${task.progress}%`,
                                            backgroundColor: calculateProgressColor(task.progress)
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <button onClick={() => handleEdit(task)} className="edit-btn">Edit</button>
                            <button onClick={() => handleDelete(task.task_id)} className="delete-btn">Delete</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="participants-right">
                <h2>Participants</h2>
                <button
                    onClick={() => setShowAddParticipantForm(!showAddParticipantForm)}
                    className="add-participant-btn"
                >
                    {showAddParticipantForm ? 'Cancel' : 'Add New Participant'}
                </button>

                {showAddParticipantForm && (
                    <form onSubmit={handleAddParticipant} className="add-participant-form">
                        <div className="form-group">
                            <label>Name:</label>
                            <input
                                type="text"
                                value={newParticipantName}
                                onChange={(e) => setNewParticipantName(e.target.value)}
                                required
                                className="input-field"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={newParticipantEmail}
                                onChange={(e) => setNewParticipantEmail(e.target.value)}
                                required
                                className="input-field"
                            />
                        </div>
                        <div className="form-group">
                            <label>Role:</label>
                            <input
                                type="text"
                                value={newParticipantRole}
                                onChange={(e) => setNewParticipantRole(e.target.value)}
                                required
                                className="input-field"
                            />
                        </div>
                        <button type="submit" className="submit-btn">Add Participant</button>
                    </form>
                )}

                <div className="participants-container">
                    {participants.map(participant => (
                        <ParticipantCard key={participant.id} participant={participant} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TasksPage;
