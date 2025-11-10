import React from 'react';
import {Link, Navigate, Route, Routes, useParams} from 'react-router';

import './App.css';
import {MainPanel} from './components/main-panel';
import {ErrorMessage} from './components/messages';
import {Navbar} from './components/navbar';
import {MessagesSidebar} from './components/sidebar';
import {Spinner} from './components/spinner';
import {ThreadPanel} from './components/thread-panel';
import {useMessages} from './hooks/useMessages';

const CenteredState: React.FC<{children: React.ReactNode}> = function ({children}) {
    return <div className="app-empty-state">{children}</div>;
};

const AppShell: React.FC<{active_thread_id?: string}> = function ({active_thread_id}) {
    const {data: messages, error} = useMessages();
    const [isSidebarOpen, setSidebarOpen] = React.useState(true);

    const openSidebar = function () {
        setSidebarOpen(true);
    };

    if (error !== undefined)
        return (
            <CenteredState>
                <ErrorMessage msg={error.message} />
            </CenteredState>
        );
    if (messages === undefined)
        return (
            <CenteredState>
                <Spinner msg="Loading messages…" />
            </CenteredState>
        );
    return (
        <div className="app-shell">
            {!isSidebarOpen && (
                <button type="button" className="btn btn-outline-dark btn-sm app-menu-toggle" onClick={openSidebar}>
                    Messages
                </button>
            )}
            <MessagesSidebar
                isSidebarOpen={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
                thread_id={active_thread_id}
            />
            {active_thread_id === undefined ? <MainPanel /> : <ThreadPanel thread_id={active_thread_id} />}
        </div>
    );
};

const Home = function () {
    return (
        <div className="app-root">
            <Navbar />
            <AppShell />
        </div>
    );
};

const ThreadPage = function () {
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

const NotFound = function () {
    return (
        <CenteredState>
            <h1 className="h4 text-body">Page not found</h1>
            <p className="text-muted mb-3">The requested route is not available.</p>
            <Link className="btn btn-primary" to="/">
                Back to inbox
            </Link>
        </CenteredState>
    );
};

export const App = function () {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/thread/:thread_id" element={<ThreadPage />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};
