import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TasksPage';
import './AppStyle.css';

const HomePage = () => {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        // �������� �������
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/projects');
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error.message);
            }
        };

        // �������� ������
        const fetchTasks = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/tasks');
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error.message);
            }
        };

        fetchProjects();
        fetchTasks();
    }, []);

    return (
        <div className="home-page-container">
            <div className="card-container">
                {/* �������� �������� */}
                <Link to="/projects" className="card">
                    <h2 className="card-title">Projects</h2>
                    <div className="card-content">
                        <ul>
                            {projects.length > 0 ? (
                                projects.map((project) => (
                                    <li key={project.project_id}>{project.project_name}</li>
                                ))
                            ) : (
                                <p>No projects available</p>
                            )}
                        </ul>
                    </div>
                </Link>

                {/* �������� ����� */}
                <Link to="/tasks" className="card">
                    <h2 className="card-title">Tasks</h2>
                    <div className="card-content">
                        <ul>
                            {tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <li key={task.id}>{task.title}</li>
                                ))
                            ) : (
                                <p>No tasks available</p>
                            )}
                        </ul>
                    </div>
                </Link>
            </div>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <Routes>
                {/* ������� �������� � ���������� */}
                <Route path="/" element={<HomePage />} />
                {/* �������� �������� */}
                <Route path="/projects" element={<ProjectsPage />} />
                {/* �������� ����� */}
                <Route path="/tasks" element={<TasksPage />} />
            </Routes>
        </Router>
    );
};

export default App;
