import groupBy from 'lodash/groupBy.js';
import React from 'react';

import './App.css';
import {MainPanel} from './components/MainPanel';
import type {SidebarItem} from './components/Sidebar';
import {Sidebar} from './components/Sidebar';
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

const Navbar: React.FC = function () {
    return (
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
            <div className="container-fluid justify-content-between">
                <div>
                    <span className="navbar-brand fw-semibold">MSG Manager</span>
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
        href: `#${customer_id}`,
    }));
    return <Sidebar title="Threads" items={menuItems} isOpen={isSidebarOpen} onClose={closeSidebar} />;
};

const CenteredState: React.FC<{children: React.ReactNode}> = function ({children}) {
    return <div className="app-empty-state">{children}</div>;
};

const AppShell = function () {
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
                <a className="btn btn-outline-dark btn-sm app-menu-toggle" href="#messages" onClick={openSidebar}>
                    Messages
                </a>
            )}
            <MessagesSidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <MainPanel />
        </div>
    );
};

export const App = function () {
    return (
        <div className="app-root">
            <Navbar />
            <AppShell />
        </div>
    );
};
