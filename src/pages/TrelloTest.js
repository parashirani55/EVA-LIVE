// src/pages/TrelloTest.js
import React, { useState } from 'react';
import { getListsOnBoard, createCard } from '../api/trello';

const TrelloTest = () => {
    const [boardId, setBoardId] = useState('');
    const [lists, setLists] = useState([]);
    const [cardName, setCardName] = useState('');
    const [selectedListId, setSelectedListId] = useState('');

    const fetchLists = async () => {
        const result = await getListsOnBoard(boardId);
        setLists(result);
    };

    const handleCreateCard = async () => {
        await createCard(selectedListId, cardName, 'Test Description');
        alert('Card created!');
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>🔧 Trello API Tester</h2>

            <div>
                <input
                    type="text"
                    placeholder="Enter Board ID"
                    value={boardId}
                    onChange={(e) => setBoardId(e.target.value)}
                />
                <button onClick={fetchLists}>Fetch Lists</button>
            </div>

            {lists.length > 0 && (
                <div>
                    <select onChange={(e) => setSelectedListId(e.target.value)}>
                        {lists.map((list) => (
                            <option key={list.id} value={list.id}>
                                {list.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Card Title"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                    />
                    <button onClick={handleCreateCard}>Create Card</button>
                </div>
            )}
        </div>
    );
};

export default TrelloTest;
