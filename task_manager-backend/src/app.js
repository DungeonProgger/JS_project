const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const pool = require('./config/db');
const participantsRoutes = require('./routes/participants');
const projectsRoutes = require('./routes/projects');
const tasksRoutes = require('./routes/tasks');

const app = express();


app.use(cors({
    origin: 'http://localhost:3001', 
}));


app.use(bodyParser.json());

// Проверка подключения к базе данных
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    } else {
        console.log('Database connected successfully at:', res.rows[0].now);
    }
});

app.use('/api/participants', participantsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/tasks', tasksRoutes);

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
