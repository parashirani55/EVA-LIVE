// src/api/trello.js
import axios from 'axios';

const key = process.env.TWILIO_AUTH_TOKEN;
const token = process.env.TWILIO_ACCOUNT_SID;

const TRELLO_BASE_URL = 'https://api.trello.com/1';

export const getListsOnBoard = async (boardId) => {
    try {
        const response = await axios.get(`${TRELLO_BASE_URL}/boards/${boardId}/lists`, {
            params: {
                key,
                token,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching Trello lists:', error);
        throw error;
    }
};

export const createCard = async (listId, name, desc = '') => {
    try {
        const response = await axios.post(`${TRELLO_BASE_URL}/cards`, null, {
            params: {
                key,
                token,
                idList: listId,
                name,
                desc,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating Trello card:', error);
        throw error;
    }
};
