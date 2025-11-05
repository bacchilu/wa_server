import React from 'react';
import {Link} from 'react-router';

export const Navbar: React.FC = function () {
    return (
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
            <div className="container-fluid justify-content-between">
                <div>
                    <Link to="/" className="navbar-brand fw-semibold">
                        MSG Manager
                    </Link>
                    <span className="text-secondary ms-lg-3">Messages Workspace</span>
                </div>
            </div>
        </nav>
    );
};
