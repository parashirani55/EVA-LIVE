// utils/trello.js
import axios from 'axios';

const key = process.env.REACT_APP_TRELLO_KEY;
const token = process.env.REACT_APP_TRELLO_TOKEN;
const listId = process.env.REACT_APP_TRELLO_LIST_ID;

export const createTrelloCard = async (name, description) => {
    try {
        const url = `https://api.trello.com/1/cards`;
        const response = await axios.post(url, null, {
            params: {
                name,
                desc: description,
                idList: listId,
                key,
                token,
            },
        });

        return response.data; // Returns the created card object
    } catch (error) {
        console.error('Error creating Trello card:', error);
        throw new Error('Failed to create Trello card.');
    }
};
