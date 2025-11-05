import groupBy from 'lodash/groupBy.js';
import React from 'react';
import {Link, Navigate, Route, Routes, useParams} from 'react-router';

import './App.css';
import {MainPanel} from './components/main-panel';
import {ErrorMessage} from './components/messages';
import type {SidebarItem} from './components/Sidebar';
import {Sidebar} from './components/Sidebar';
import {Spinner} from './components/spinner';
import {ThreadPanel} from './components/thread-panel';
import {useMessages} from './hooks/useMessages';

const Navbar: React.FC = function () {
    return (
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
            <div className="container-fluid justify-content-between">
                <div>
                    <Link to="/" className="navbar-brand fw-semibold">
                        MSG Manager
                    </Link>
                    <span className="text-secondary ms-lg-3">Messages Workspace</span>
                </div>
            </div>
        </nav>
    );
};

const MessagesSidebar: React.FC<{isSidebarOpen: boolean; setSidebarOpen: (v: boolean) => void}> = function ({
    isSidebarOpen,
    setSidebarOpen,
}) {
    const {data: messages} = useMessages();

    const closeSidebar = function () {
        setSidebarOpen(false);
    };

    const byCustomer = groupBy(messages, 'customer_id');
    const menuItems: SidebarItem[] = Object.keys(byCustomer).map((customer_id) => ({
        id: customer_id,
        label: customer_id,
        href: `#/thread/${customer_id}`,
    }));
    return <Sidebar title="Threads" items={menuItems} isOpen={isSidebarOpen} onClose={closeSidebar} />;
};

const CenteredState: React.FC<{children: React.ReactNode}> = function ({children}) {
    return <div className="app-empty-state">{children}</div>;
};

const AppShell: React.FC<{activeCustomerId?: string}> = function ({activeCustomerId}) {
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
            <MessagesSidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            {activeCustomerId === undefined ? <MainPanel /> : <ThreadPanel customerId={activeCustomerId} />}
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
    const params = useParams<{customer_id: string}>();
    const customerId = params.customer_id;

    if (customerId === undefined) return <Navigate to="/" replace />;
    return (
        <div className="app-root">
            <Navbar />
            <AppShell activeCustomerId={customerId} />
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
            <Route path="/thread/:customer_id" element={<ThreadPage />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};
