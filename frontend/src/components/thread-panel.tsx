import groupBy from 'lodash/groupBy.js';

import {MessageType, type TextMessage} from '../entities/messages';
import {useMessages} from '../hooks/useMessages';

const JSONContent: React.FC<{value: TextMessage}> = function ({value}) {
    return <pre className="bg-body-tertiary p-3 rounded mt-3">{JSON.stringify(value, null, 1)}</pre>;
};

const MessagesPanel: React.FC<{thread_id: string}> = function ({thread_id}) {
    const {data: messages} = useMessages();
    const byCustomer = groupBy(messages, 'customer_id');

    const messagesByThread = byCustomer[thread_id].filter((msg) => msg.type === MessageType.Text);

    return messagesByThread.map((msg) => (
        <div key={msg.id} className="shadow-lg">
            <JSONContent value={msg} />
        </div>
    ));
};

export const ThreadPanel: React.FC<{thread_id: string}> = function ({thread_id}) {
    return (
        <main className="app-content">
            <div className="app-content__inner container">
                <MessagesPanel thread_id={thread_id} />
            </div>
        </main>
    );
};
