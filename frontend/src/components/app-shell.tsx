import React from 'react';

import {useMessages} from '../hooks/useMessages';
import {MainPanel} from './main-panel';
import {ErrorMessage} from './messages';
import {MessagesSidebar} from './sidebar';
import {Spinner} from './spinner';
import {ThreadPanel} from './thread-panel';

export const CenteredState: React.FC<{children: React.ReactNode}> = function ({children}) {
    return <div className="app-empty-state">{children}</div>;
};

export const AppShell: React.FC<{active_thread_id?: string}> = function ({active_thread_id}) {
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
