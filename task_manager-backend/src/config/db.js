const { Pool } = require('pg');

// ������������ ����������� � ���� ������
const pool = new Pool({
    user: 'ilyab', // ������������ ���� ������
    host: 'localhost', // ���� ���� ������
    database: 'mydatabase', // ��� ���� ������
    password: 'Password_12345', // ������ ���� ������
    port: 5432, // ���� ���� ������
});

module.exports = pool;
