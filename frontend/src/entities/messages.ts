export interface TextMessage {
    type: 'text';
    customer_id: string;
    id: string;
    timestamp: Date;
    body: string;
}

interface UnknownMessage {
    type: 'unknown';
    raw: Record<string, unknown>;
}

export type Message = TextMessage | UnknownMessage;
