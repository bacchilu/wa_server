import groupBy from 'lodash/groupBy.js';
import React from 'react';
import {useMessages} from '../hooks/useMessages';

export type SidebarItem = {
    id: string;
    label: string;
    href: string;
};

const Sidebar: React.FC<{
    title: string;
    items: SidebarItem[];
    isOpen: boolean;
    onClose: () => void;
    customerId?: string;
}> = function ({title, items, isOpen, onClose, customerId}) {
    const handleItemClick = function (item: SidebarItem) {
        return () => {
            console.log(item);
            onClose();
        };
    };

    return (
        <>
            <aside className={`app-sidebar ${isOpen ? 'is-open' : ''}`}>
                <div className="app-sidebar__header">
                    <span className="app-sidebar__title">{title}</span>
                    <button type="button" className="btn-close d-lg-none" aria-label="Close menu" onClick={onClose} />
                </div>
                <div className="app-sidebar__body">
                    <nav className="nav flex-column">
                        {items.map((item) => (
                            <a
                                key={item.id}
                                href={item.href ?? '#'}
                                className="nav-link app-sidebar__link"
                                onClick={handleItemClick(item)}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                </div>
            </aside>
            <div className={`app-sidebar__backdrop d-lg-none ${isOpen ? 'is-visible' : ''}`} onClick={onClose} />
        </>
    );
};

export const MessagesSidebar: React.FC<{
    isSidebarOpen: boolean;
    setSidebarOpen: (v: boolean) => void;
    customerId?: string;
}> = function ({isSidebarOpen, setSidebarOpen, customerId}) {
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
    return (
        <Sidebar
            title="Threads"
            items={menuItems}
            isOpen={isSidebarOpen}
            onClose={closeSidebar}
            customerId={customerId}
        />
    );
};
