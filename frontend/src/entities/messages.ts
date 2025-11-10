export enum MessageType {
    Text = 'text',
    Unknown = 'unknown',
}

export interface TextMessage {
    type: MessageType.Text;
    customer_id: string;
    id: string;
    timestamp: Date;
    body: string;
}

interface UnknownMessage {
    type: MessageType.Unknown;
    raw: Record<string, unknown>;
}

export type Message = TextMessage | UnknownMessage;
