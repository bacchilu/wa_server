import groupBy from 'lodash/groupBy.js';
import React from 'react';

import './App.css';
import type {SidebarItem} from './components/Sidebar';
import {Sidebar} from './components/Sidebar';
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
    const byCustomer = groupBy(messages, 'customer_id');

    return Object.keys(byCustomer).map((customer_id) => (
        <div key={customer_id} className="shadow-lg">
            <JSONContent value={byCustomer[customer_id]} />
        </div>
    ));
};

const BodyContent = function () {
    const {data: messages, error} = useMessages();

    if (error !== undefined) return <ErrorMessage msg={error.message} />;
    if (messages === undefined) return <Spinner msg="Loading messages…" />;
    if (messages.length === 0) return <Message msg="No messages yet. Incoming webhooks will appear here." />;
    return <MessagesPanel messages={messages} />;
};

const menuItems: SidebarItem[] = [
    {id: 'messages', label: 'Messages Feed', href: '#messages'},
    {id: 'templates', label: 'Templates', href: '#templates'},
    {id: 'settings', label: 'Settings', href: '#settings'},
];

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

export const App = function () {
    const [isSidebarOpen, setSidebarOpen] = React.useState(true);

    const openSidebar = function () {
        setSidebarOpen(true);
    };
    const closeSidebar = function () {
        setSidebarOpen(false);
    };

    return (
        <div className="app-root">
            <Navbar />
            <div className="app-shell">
                {!isSidebarOpen && (
                    <a className="btn btn-outline-dark btn-sm app-menu-toggle" href="#messages" onClick={openSidebar}>
                        Messages
                    </a>
                )}
                <Sidebar title="Threads" items={menuItems} isOpen={isSidebarOpen} onClose={closeSidebar} />
                <main className="app-content">
                    <div className="app-content__inner container">
                        <BodyContent />
                    </div>
                </main>
            </div>
        </div>
    );
};
