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

const BodyContent = function () {
    const {data: messages, error} = useMessages();

    if (error !== undefined) return <ErrorMessage msg={error.message} />;
    if (messages === undefined) return <Spinner msg="Loading messages…" />;
    if (messages.length === 0) return <Message msg="No messages yet. Incoming webhooks will appear here." />;
    return <JSONContent value={messages} />;
};

export const App = function () {
    return (
        <div className="container py-5">
            <header className="text-center mb-5">
                <h1 className="display-5 fw-semibold">MSG Manager Frontend</h1>
                <p className="text-muted mb-0">Bootstrap-powered React starter</p>
            </header>

            <div className="row justify-content-center">
                <div className="col-lg-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <BodyContent />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
