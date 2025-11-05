export const Spinner: React.FC<{msg: string}> = function ({msg}) {
    return (
        <div className="d-flex align-items-center gap-3">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <span className="text-muted">{msg}</span>
        </div>
    );
};
