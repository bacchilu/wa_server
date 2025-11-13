import {Navigate, useParams} from 'react-router';

import {AppShell} from '../components/app-shell';
import {Navbar} from '../components/navbar';

export const ThreadPage = function () {
    const params = useParams<{thread_id: string}>();
    const thread_id = params.thread_id;

    if (thread_id === undefined) return <Navigate to="/" replace />;
    return (
        <div className="app-root">
            <Navbar />
            <AppShell active_thread_id={thread_id} />
        </div>
    );
};
