import type {Message, TextMessage} from '../entities/messages';

const mockMessages: TextMessage[] = Array.from({length: 10}, (_, index) => ({
    type: 'text',
    customer_id: `customer-${(index % 3) + 1}`,
    id: `msg-${index + 1}`,
    timestamp: new Date(Date.UTC(2025, 0, 1, 12, index)).toISOString(),
    body: `Sample message ${index + 1}`,
}));

export const getMessages = async (): Promise<Message[]> => {
    return Promise.resolve(mockMessages);
};
