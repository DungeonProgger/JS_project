
const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Получение всех задач с названиями проектов
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT t.id AS task_id, t.title, t.description, t.status, t.project_id, 
                   p.name, t.progress,  -- Добавляем поле progress
                   pa.id AS participant_id, pa.name AS participant_name
            FROM tasks t
            LEFT JOIN task_participants tp ON t.id = tp.task_id
            LEFT JOIN participants pa ON tp.participant_id = pa.id
            LEFT JOIN projects p ON t.project_id = p.id 
            ORDER BY t.id
        `);

        const tasks = [];
        let currentTask = null;

        result.rows.forEach(row => {

            if (!currentTask || currentTask.task_id !== row.task_id) {
                currentTask = {
                    task_id: row.task_id,
                    title: row.title,
                    description: row.description,
                    status: row.status,
                    project_name: row.name,
                    progress: row.progress,  
                    participants: []
                };
                tasks.push(currentTask);
            }

            // Добавляем участника в задачу
            if (row.participant_id) {
                currentTask.participants.push({
                    participant_id: row.participant_id,
                    participant_name: row.participant_name
                });
            }
        });

        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error.message);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Добавление новой задачи
router.post('/', async (req, res) => {
    const { title, description, project_id, participant_ids, progress } = req.body;

    try {
        // Сначала создаём задачу
        const result = await pool.query(
            'INSERT INTO tasks (title, description, project_id, status, progress) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [title, description, project_id, 'pending', progress || 0]  
        );
        const task_id = result.rows[0].id;

        // Добавляем участников в промежуточную таблицу task_participants
        if (participant_ids && participant_ids.length > 0) {
            const participantQueries = participant_ids.map(participant_id => {
                return pool.query(
                    'INSERT INTO task_participants (task_id, participant_id) VALUES ($1, $2)',
                    [task_id, participant_id]
                );
            });


            await Promise.all(participantQueries);
        }

        res.status(201).json({ message: 'Task created successfully', task_id });
    } catch (error) {
        console.error('Error creating task:', error.message);
        res.status(500).json({ error: 'Failed to create task' });
    }
});
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {

        await pool.query('DELETE FROM task_participants WHERE task_id = $1', [id]);


        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error.message);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, project_id, participant_ids, progress } = req.body;

    try {
        // Обновляем данные задачи
        await pool.query(
            'UPDATE tasks SET title = $1, description = $2, project_id = $3, progress = $4 WHERE id = $5',
            [title, description, project_id, progress, id]
        );

        // Удаляем старых участников
        await pool.query('DELETE FROM task_participants WHERE task_id = $1', [id]);

        // Добавляем новых участников
        if (participant_ids && participant_ids.length > 0) {
            const participantQueries = participant_ids.map(participant_id => {
                return pool.query(
                    'INSERT INTO task_participants (task_id, participant_id) VALUES ($1, $2)',
                    [id, participant_id]
                );
            });

            // Ожидаем выполнения всех запросов для добавления участников
            await Promise.all(participantQueries);
        }

        res.status(200).json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error('Error updating task:', error.message);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

module.exports = router;
