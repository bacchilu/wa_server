import groupBy from 'lodash/groupBy.js';

import {MessageType, type Message, type TextMessage} from '../entities/messages';
import {useMessages} from '../hooks/useMessages';

const JSONContent: React.FC<{value: TextMessage}> = function ({value}) {
    return <pre className="bg-body-tertiary p-3 rounded mt-3">{JSON.stringify(value, null, 1)}</pre>;
};

const TextMessageWidget: React.FC<{msg: TextMessage}> = function ({msg}) {
    return (
        <div className="shadow-lg">
            <JSONContent value={msg} />
        </div>
    );
};

const MessageWidget: React.FC<{msg: Message}> = function ({msg}) {
    if (msg.type === MessageType.Unknown) return null;
    return <TextMessageWidget msg={msg} />;
};

export const ThreadPanel: React.FC<{thread_id: string}> = function ({thread_id}) {
    const {data: messages} = useMessages();
    const byCustomer = groupBy(messages, 'customer_id');

    const messagesByThread = byCustomer[thread_id];
    const renderedMessages = messagesByThread.map((msg, i) => <MessageWidget key={i} msg={msg} />);
    return (
        <main className="app-content">
            <div className="app-content__inner container">{renderedMessages}</div>
        </main>
    );
};
