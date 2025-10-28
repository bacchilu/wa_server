import React from 'react';

export type SidebarItem = {
    id: string;
    label: string;
    href: string;
};

export const Sidebar: React.FC<{
    title: string;
    items: SidebarItem[];
    isOpen: boolean;
    onClose: () => void;
}> = function ({title, items, isOpen, onClose}) {
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
