import axios from 'axios';

import type {Message} from '../entities/messages';

interface RawTextMessage {
    type: 'text';
    customer_id: string;
    id: string;
    timestamp: string;
    body: string;
}

interface RawUnknownMessage {
    type: 'unknown';
    raw: Record<string, unknown>;
}

type RawMessage = RawTextMessage | RawUnknownMessage;

const normalizeMessage = function (message: RawMessage): Message {
    if (message.type === 'text') {
        const {timestamp, ...rest} = message;
        return {...rest, timestamp: new Date(timestamp)};
    }
    return message;
};

export const getMessages = async (): Promise<Message[]> => {
    try {
        const response = await axios.get<RawMessage[]>('http://localhost:8001/messages');
        return response.data.map(normalizeMessage);
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : 'Unknown error');
    }
};
