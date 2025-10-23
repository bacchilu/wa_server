import useSWR from 'swr';

import {getMessages} from '../api/messages';
import type {Message} from '../entities/messages';

export const useMessages = function (): {data: Message[] | undefined; error: Error | undefined} {
    const {data, error} = useSWR<Message[]>('MESSAGES', getMessages, {dedupingInterval: 60000});

    return {data, error};
};
