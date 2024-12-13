import React from 'react';

const ParticipantList = ({ participants }) => {
    return (
        <ul>
            {participants.map((participant) => (
                <li key={participant.id}>
                    {participant.name} - {participant.email} - {participant.role}
                </li>
            ))}
        </ul>
    );
};

export default ParticipantList;
