import groupBy from 'lodash/groupBy.js';

import {MessageType, type Message, type TextMessage} from '../entities/messages';
import {useMessages} from '../hooks/useMessages';

const TextMessageWidget: React.FC<{msg: TextMessage}> = function ({msg}) {
    return (
        <div className="card shadow-sm m-2">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-semibold text-primary">{msg.customer_id}</span>
                </div>
                <p className="mb-3 text-body">{msg.body}</p>
                <div className="text-end text-muted small">{msg.timestamp.toLocaleString()}</div>
            </div>
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
