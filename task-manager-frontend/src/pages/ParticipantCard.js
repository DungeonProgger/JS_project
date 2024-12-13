import React from 'react';
import './ParticipantCard.css';

const ParticipantCard = ({ participant }) => {
    return (
        <div className="participant-card">
            <h4>{participant.name}</h4> {/* Заголовок участника по центру */}
            <p>{participant.role}</p> {/* Роль участника тоже по центру */}
        </div>
    );
};

export default ParticipantCard;
