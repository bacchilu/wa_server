import axios from 'axios';
import {z, ZodError} from 'zod';

import type {Message} from '../entities/messages';

const TextMessageSchema = z.object({
    type: z.literal('text'),
    customer_id: z.string(),
    id: z.string(),
    timestamp: z.coerce.date(),
    body: z.string(),
});

const UnknownMessageSchema = z.object({type: z.literal('unknown'), raw: z.record(z.string(), z.unknown())});

const MessageSchema: z.ZodType<Message> = z.union([
    TextMessageSchema,
    UnknownMessageSchema,
]) satisfies z.ZodType<Message>;

type ParsedMessage = z.infer<typeof MessageSchema>;

const parseMessages = function (payload: unknown): ParsedMessage[] {
    return MessageSchema.array().parse(payload);
};

export const getMessages = async function (): Promise<Message[]> {
    try {
        const response = await axios.get('http://localhost:8001/messages');
        return parseMessages(response.data);
    } catch (err) {
        if (err instanceof ZodError) throw new Error(`Invalid message payload: ${err.message}`);
        if (err instanceof Error) throw new Error(err.message);
        throw new Error('Unknown error');
    }
};
