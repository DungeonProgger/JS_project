import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ParticipantCard from './ParticipantCard';
import './ProjectsPage.css';

const ProjectsPage = () => {
    const [projectTitle, setProjectTitle] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [participants, setParticipants] = useState([]);
    const [projects, setProjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');  // Состояние для поиска по названию проекта
    const [showForm, setShowForm] = useState(false);
    const [showAddParticipantForm, setShowAddParticipantForm] = useState(false);
    const [newParticipantName, setNewParticipantName] = useState('');
    const [newParticipantEmail, setNewParticipantEmail] = useState('');
    const [newParticipantRole, setNewParticipantRole] = useState('');

    const formRef = useRef(null);

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

    useEffect(() => {
        fetchParticipants();
        fetchProjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Создание нового проекта
            await axios.post('http://localhost:3000/api/projects', {
                name: projectTitle,
                description: projectDescription,
            });

            setProjectTitle('');
            setProjectDescription('');
            fetchProjects();
            setShowForm(false);
        } catch (error) {
            console.error('Error submitting project:', error.message);
        }
    };

    const handleAddParticipant = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/participants', {
                name: newParticipantName,
                email: newParticipantEmail,
                role: newParticipantRole,
            });
            setNewParticipantName('');
            setNewParticipantEmail('');
            setNewParticipantRole('');
            fetchParticipants();
            setShowAddParticipantForm(false);
        } catch (error) {
            console.error('Error adding participant:', error.message);
        }
    };

    const handleDeleteProject = async (projectId) => {
        try {
            await axios.delete(`http://localhost:3000/api/projects/${projectId}`);
            fetchProjects(); // Обновите список проектов после удаления
        } catch (error) {
            console.error('Error deleting project:', error.message);
        }
    };

    // Фильтрация проектов по названию
    const filteredProjects = projects.filter(project =>
        project.project_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="projects-container">
            <div className="tasks-button-container">
                <a href="/tasks" className="tasks-button">Tasks</a>
            </div>
            <div className="projects-left">
                <h1>Projects</h1>

                {/* Поле поиска */}
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by project name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="add-project-btn-container">
                    <button onClick={() => setShowForm(!showForm)} className="toggle-form-btn">
                        {showForm ? 'Close Form' : 'Add Project'}
                    </button>
                </div>

                {showForm && (
                    <form ref={formRef} onSubmit={handleSubmit} className="add-project-form">
                        <div className="form-group">
                            <label>Title:</label>
                            <input
                                type="text"
                                value={projectTitle}
                                onChange={(e) => setProjectTitle(e.target.value)}
                                required
                                className="input-field"
                            />
                        </div>
                        <div className="form-group">
                            <label>Description:</label>
                            <textarea
                                value={projectDescription}
                                onChange={(e) => setProjectDescription(e.target.value)}
                                className="textarea-field"
                            />
                        </div>
                        <button type="submit" className="submit-btn">
                            Create Project
                        </button>
                    </form>
                )}

                <div className="project-cards-container">
                    {/* Отображаем отфильтрованные проекты */}
                    {filteredProjects.map((project) => (
                        <div key={project.project_id} className="project-card">
                            <div className="project-card-header">
                                <h2 className="project-title">{project.project_name}</h2>
                                <p><strong>Description:</strong> {project.description}</p>
                            </div>

                            <div className="project-participants">
                                <p><strong>Participants:</strong></p>
                                <ul>
                                    {project.participants && project.participants.length > 0 ? (
                                        project.participants.map((p) => (
                                            <li key={p.id}>
                                                {p.participant_name}
                                            </li>
                                        ))
                                    ) : (
                                        <p>No participants</p>
                                    )}
                                </ul>
                            </div>

                            <div className="project-tasks">
                                <p><strong>Tasks:</strong></p>
                                <ul>
                                    {project.tasks && project.tasks.length > 0 ? (
                                        project.tasks.map((task) => (
                                            <li key={task.id}>
                                                {task.task_title || 'No title'}
                                            </li>
                                        ))
                                    ) : (
                                        <p>No tasks</p>
                                    )}
                                </ul>
                            </div>

                            <div className="project-card-footer">
                                <button
                                    onClick={() => handleDeleteProject(project.project_id)}
                                    className="delete-btn"
                                >
                                    Delete Project
                                </button>
                            </div>
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

export default ProjectsPage;
