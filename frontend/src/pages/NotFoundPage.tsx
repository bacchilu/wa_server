import {Link} from 'react-router';

import {CenteredState} from '../components/app-shell';

export const NotFoundPage = function () {
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
