const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Получение всех участников
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM participants');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching participants:', error.message);
        res.status(500).json({ error: 'Failed to fetch participants' });
    }
});

// Добавление участника
router.post('/', async (req, res) => {
    const { name, email, role } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO participants (name, email, role) VALUES ($1, $2, $3) RETURNING *',
            [name, email, role]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding participant:', error.message);
        res.status(500).json({ error: 'Failed to add participant' });
    }
});

// Удаление участника
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM participants WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Participant not found' });
        }
        res.status(200).json({ message: 'Participant deleted' });
    } catch (error) {
        console.error('Error deleting participant:', error.message);
        res.status(500).json({ error: 'Failed to delete participant' });
    }
});

// Редактирование участника
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;
    try {
        const result = await pool.query(
            'UPDATE participants SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING *',
            [name, email, role, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Participant not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating participant:', error.message);
        res.status(500).json({ error: 'Failed to update participant' });
    }
});


module.exports = router;
