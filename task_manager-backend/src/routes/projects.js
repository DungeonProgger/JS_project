const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// Получение всех проектов с задачами и участниками
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.id AS project_id, p.name AS project_name, p.description,
                   t.id AS task_id, t.title AS task_title,
                   pa.id AS participant_id, pa.name AS participant_name
            FROM projects p
            LEFT JOIN tasks t ON t.project_id = p.id
            LEFT JOIN task_participants tp ON tp.task_id = t.id
            LEFT JOIN participants pa ON pa.id = tp.participant_id
            ORDER BY p.id, t.id
        `);

        const projects = [];
        let currentProject = null;

        result.rows.forEach(row => {
            if (!currentProject || currentProject.project_id !== row.project_id) {
                currentProject = {
                    project_id: row.project_id,
                    project_name: row.project_name,
                    description: row.description,
                    tasks: [],
                    participants: []
                };
                projects.push(currentProject);
            }

            if (row.task_id) {
                const existingTask = currentProject.tasks.find(task => task.task_id === row.task_id);
                if (!existingTask) {
                    currentProject.tasks.push({
                        task_id: row.task_id,
                        task_title: row.task_title,
                        participants: []
                    });
                }
            }

            if (row.participant_id) {
                const task = currentProject.tasks.find(task => task.task_id === row.task_id);
                if (task && !task.participants.find(participant => participant.participant_id === row.participant_id)) {
                    task.participants.push({
                        participant_id: row.participant_id,
                        participant_name: row.participant_name
                    });
                }

                if (!currentProject.participants.find(participant => participant.participant_id === row.participant_id)) {
                    currentProject.participants.push({
                        participant_id: row.participant_id,
                        participant_name: row.participant_name
                    });
                }
            }
        });

        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error.message);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Создание нового проекта
router.post('/', async (req, res) => {
    const { name, description } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING id',
            [name, description]
        );

        const newProjectId = result.rows[0].id;

        res.status(201).json({
            message: 'Project created successfully',
            project_id: newProjectId
        });
    } catch (error) {
        console.error('Error creating project:', error.message);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Удаление проекта
router.delete('/:id', async (req, res) => {
    const projectId = req.params.id;

    try {
        // Удаление всех задач проекта
        await pool.query('DELETE FROM tasks WHERE project_id = $1', [projectId]);

        // Удаление проекта
        const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING id', [projectId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error.message);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

module.exports = router;
