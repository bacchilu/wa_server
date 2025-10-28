import groupBy from 'lodash/groupBy.js';
import type React from 'react';

import type {Message} from '../entities/messages';
import type {SidebarItem} from './Sidebar';
import {Sidebar} from './Sidebar';

export const MessagesSidebar: React.FC<{
    messages: Message[];
    isSidebarOpen: boolean;
    onClose: () => void;
}> = function ({messages, isSidebarOpen, onClose}) {
    const items: SidebarItem[] = Object.keys(groupBy(messages, 'customer_id')).map((customerId) => ({
        id: customerId,
        label: customerId,
        href: `#${customerId}`,
    }));

    return <Sidebar title="Threads" items={items} isOpen={isSidebarOpen} onClose={onClose} />;
};
