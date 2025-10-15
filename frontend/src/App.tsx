import axios from 'axios';
import {useState} from 'react';

import './App.css';

type RequestState = 'idle' | 'loading' | 'success' | 'error';

const getMessages = async function (): Promise<any> {
    try {
        const response = await axios.get('http://localhost:8001/messages');
        return response.data;
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : 'Unknown error');
    }
};

export const App = function () {
    const [status, setStatus] = useState<RequestState>('idle');
    const [payload, setPayload] = useState<unknown>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFetchMessages = async function () {
        setStatus('loading');
        setError(null);
        try {
            setPayload(await getMessages());
            setStatus('success');
        } catch (err) {
            setStatus('error');
            setPayload(null);
            setError((err as Error).message);
        }
    };

    return (
        <div className="container py-5">
            <header className="text-center mb-5">
                <h1 className="display-5 fw-semibold">MSG Manager Frontend</h1>
                <p className="text-muted mb-0">Bootstrap-powered React starter</p>
            </header>

            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <button
                                type="button"
                                className="btn btn-primary"
                                disabled={status === 'loading'}
                                onClick={handleFetchMessages}
                            >
                                {status === 'loading' ? 'Loading…' : 'Load Messages'}
                            </button>
                            <div className="mt-3">
                                {status === 'idle' && (
                                    <p className="text-muted mb-0">Press the button to query `GET /messages`.</p>
                                )}
                                {status === 'success' && (
                                    <pre className="bg-body-tertiary p-3 rounded">
                                        {JSON.stringify(payload, null, 1)}
                                    </pre>
                                )}
                                {status === 'error' && <p className="text-danger mb-0">Error: {error}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
