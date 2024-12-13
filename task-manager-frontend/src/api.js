import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // ������� URL API
});

// ������ ��� ��������� ���� ����������
export const fetchParticipants = async () => {
    const response = await api.get('/participants');
    return response.data;
};

// ������ ��� ���������� ������ ���������
export const addParticipant = async (participant) => {
    const response = await api.post('/participants', participant);
    return response.data;
};
