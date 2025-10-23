import './App.css';
import type {Message} from './entities/messages';
import {useMessages} from './hooks/useMessages';

const Spinner: React.FC<{msg: string}> = function ({msg}) {
    return (
        <div className="d-flex align-items-center gap-3">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <span className="text-muted">{msg}</span>
        </div>
    );
};

const ErrorMessage: React.FC<{msg: string}> = function ({msg}) {
    return <p className="text-danger mb-0 mt-3">Error: {msg}</p>;
};

const Message: React.FC<{msg: string}> = function ({msg}) {
    return <p className="text-muted mb-0 mt-3">{msg}</p>;
};

const JSONContent: React.FC<{value: Message[]}> = function ({value}) {
    return <pre className="bg-body-tertiary p-3 rounded mt-3">{JSON.stringify(value, null, 1)}</pre>;
};

const MessagesPanel: React.FC<{messages: Message[]}> = function ({messages}) {
    return (
        <div className="shadow-lg">
            <JSONContent value={messages} />
        </div>
    );
};

const BodyContent = function () {
    const {data: messages, error} = useMessages();

    if (error !== undefined) return <ErrorMessage msg={error.message} />;
    if (messages === undefined) return <Spinner msg="Loading messages…" />;
    if (messages.length === 0) return <Message msg="No messages yet. Incoming webhooks will appear here." />;
    return <MessagesPanel messages={messages} />;
};

const Navbar = function () {
    return (
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
            <div className="container">
                <span className="navbar-brand fw-semibold">MSG Manager</span>
                <span className="text-secondary">Messages Workspace</span>
            </div>
        </nav>
    );
};
export const App = function () {
    return (
        <>
            <Navbar />
            <div className="container py-4">
                <BodyContent />
            </div>
        </>
    );
};
