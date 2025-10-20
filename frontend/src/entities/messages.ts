export interface TextMessage {
    type: 'text';
    customer_id: string;
    id: string;
    timestamp: string;
    body: string;
}

interface UnknownMessage {
    type: 'unknown';
    raw: Record<string, unknown>;
}

export type Message = TextMessage | UnknownMessage;
