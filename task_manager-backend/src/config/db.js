const { Pool } = require('pg');

// Конфигурация подключения к базе данных
const pool = new Pool({
    user: 'ilyab', // Пользователь базы данных
    host: 'localhost', // Хост базы данных
    database: 'mydatabase', // Имя базы данных
    password: 'Password_12345', // Пароль базы данных
    port: 5432, // Порт базы данных
});

module.exports = pool;
