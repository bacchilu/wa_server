import axios from 'axios';

import type {Message} from '../entities/messages';

export const getMessages = async (): Promise<Message[]> => {
    try {
        const response = await axios.get<Message[]>('http://localhost:8001/messages');
        return response.data;
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : 'Unknown error');
    }
};
