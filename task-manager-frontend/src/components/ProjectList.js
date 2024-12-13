// src/components/ProjectList.js
import React from 'react';

function ProjectList({ projects }) {
    return (
        <ul>
            {projects.map((project) => (
                <li key={project.id}>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                </li>
            ))}
        </ul>
    );
}

export default ProjectList;
