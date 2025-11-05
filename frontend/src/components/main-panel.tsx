const CenteredState: React.FC<{children: React.ReactNode}> = function ({children}) {
    return <div className="app-empty-state">{children}</div>;
};

export const MainPanel = function () {
    return <CenteredState>TODO</CenteredState>;
};
