import React from 'react';
import './ParticipantCard.css';

const ParticipantCard = ({ participant }) => {
    return (
        <div className="participant-card">
            <h4>{participant.name}</h4> {/* ��������� ��������� �� ������ */}
            <p>{participant.role}</p> {/* ���� ��������� ���� �� ������ */}
        </div>
    );
};

export default ParticipantCard;
