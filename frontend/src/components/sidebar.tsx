import groupBy from 'lodash/groupBy.js';
import React from 'react';

import {useMessages} from '../hooks/useMessages';

export type SidebarItem = {
    thread_id: string;
    label: string;
    href: string;
};

const ThreadButton: React.FC<{item: SidebarItem; onClick: () => void; activeThreadId?: string}> = function ({
    item,
    onClick,
    activeThreadId,
}) {
    const isActive = activeThreadId !== undefined && item.thread_id === activeThreadId;
    return (
        <a
            href={item.href ?? '#'}
            className={`nav-link app-sidebar__link${isActive ? ' is-active' : ''}`}
            onClick={onClick}
        >
            {item.label}
        </a>
    );
};

const Sidebar: React.FC<{
    title: string;
    items: SidebarItem[];
    isOpen: boolean;
    onClose: () => void;
    thread_id?: string;
}> = function ({title, items, isOpen, onClose, thread_id}) {
    console.log(thread_id);

    const buttons = items.map((item) => {
        const handleClick = function () {
            console.log(item);
            onClose();
        };

        return <ThreadButton key={item.thread_id} item={item} onClick={handleClick} activeThreadId={thread_id} />;
    });
    return (
        <>
            <aside className={`app-sidebar ${isOpen ? 'is-open' : ''}`}>
                <div className="app-sidebar__header">
                    <span className="app-sidebar__title">{title}</span>
                    <button type="button" className="btn-close d-lg-none" aria-label="Close menu" onClick={onClose} />
                </div>
                <div className="app-sidebar__body">
                    <nav className="nav flex-column">{buttons}</nav>
                </div>
            </aside>
            <div className={`app-sidebar__backdrop d-lg-none ${isOpen ? 'is-visible' : ''}`} onClick={onClose} />
        </>
    );
};

export const MessagesSidebar: React.FC<{
    isSidebarOpen: boolean;
    setSidebarOpen: (v: boolean) => void;
    thread_id?: string;
}> = function ({isSidebarOpen, setSidebarOpen, thread_id}) {
    const {data: messages} = useMessages();

    const closeSidebar = function () {
        setSidebarOpen(false);
    };

    const byCustomer = groupBy(messages, 'customer_id');
    const menuItems: SidebarItem[] = Object.keys(byCustomer).map((customer_id) => ({
        thread_id: customer_id,
        label: customer_id,
        href: `#/thread/${customer_id}`,
    }));
    return (
        <Sidebar
            title="Threads"
            items={menuItems}
            isOpen={isSidebarOpen}
            onClose={closeSidebar}
            thread_id={thread_id}
        />
    );
};
