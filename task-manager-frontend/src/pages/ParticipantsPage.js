import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ParticipantsPage = () => {
    const [participants, setParticipants] = useState([]);
    const [newParticipant, setNewParticipant] = useState({
        name: '',
        email: '',
        role: '',
    });

    const [editMode, setEditMode] = useState(false);
    const [editedParticipant, setEditedParticipant] = useState({
        id: '',
        name: '',
        email: '',
        role: '',
    });

    // Получение всех участников
    const fetchParticipants = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/participants');
            setParticipants(response.data);
        } catch (error) {
            console.error('Error fetching participants:', error.message);
        }
    };

    // Добавление нового участника
    const addParticipant = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/participants', newParticipant);
            setParticipants([...participants, response.data]);
            setNewParticipant({ name: '', email: '', role: '' });
        } catch (error) {
            console.error('Error adding participant:', error.message);
        }
    };

    // Удаление участника
    const deleteParticipant = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/participants/${id}`);
            setParticipants(participants.filter(participant => participant.id !== id));
        } catch (error) {
            console.error('Error deleting participant:', error.message);
        }
    };

    // Включение режима редактирования
    const editParticipant = (participant) => {
        setEditMode(true);
        setEditedParticipant({
            id: participant.id,
            name: participant.name,
            email: participant.email,
            role: participant.role,
        });
    };

    // Сохранение изменений участника
    const saveParticipant = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:3000/api/participants/${editedParticipant.id}`, editedParticipant);
            setParticipants(participants.map(participant =>
                participant.id === editedParticipant.id ? response.data : participant
            ));
            setEditMode(false);
            setEditedParticipant({ id: '', name: '', email: '', role: '' });
        } catch (error) {
            console.error('Error updating participant:', error.message);
        }
    };

    useEffect(() => {
        fetchParticipants();
    }, []);

    return (
        <div>
            <h1>Participants</h1>

            {/* Форма для добавления нового участника */}
            <form onSubmit={addParticipant}>
                <input
                    type="text"
                    placeholder="Name"
                    value={newParticipant.name}
                    onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newParticipant.email}
                    onChange={(e) => setNewParticipant({ ...newParticipant, email: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Role"
                    value={newParticipant.role}
                    onChange={(e) => setNewParticipant({ ...newParticipant, role: e.target.value })}
                    required
                />
                <button type="submit">Add Participant</button>
            </form>

            {/* Форма для редактирования участника */}
            {editMode && (
                <div>
                    <h2>Edit Participant</h2>
                    <form onSubmit={saveParticipant}>
                        <input
                            type="text"
                            placeholder="Name"
                            value={editedParticipant.name}
                            onChange={(e) => setEditedParticipant({ ...editedParticipant, name: e.target.value })}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={editedParticipant.email}
                            onChange={(e) => setEditedParticipant({ ...editedParticipant, email: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Role"
                            value={editedParticipant.role}
                            onChange={(e) => setEditedParticipant({ ...editedParticipant, role: e.target.value })}
                            required
                        />
                        <button type="submit">Save</button>
                    </form>
                </div>
            )}

            {/* Список участников с кнопками редактирования и удаления */}
            <ul>
                {participants.map((participant) => (
                    <li key={participant.id}>
                        {participant.name} - {participant.email} - {participant.role}
                        <button onClick={() => deleteParticipant(participant.id)}>Delete</button>
                        <button onClick={() => editParticipant(participant)}>Edit</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ParticipantsPage;
