export const AuthPage = function () {
    return (
        <div className="auth-page">
            <div className="auth-page__panel">
                <div className="auth-page__intro">
                    <p className="text-uppercase fw-semibold text-primary mb-2">MSG Manager</p>
                </div>
                <form className="auth-page__form">
                    <div className="mb-3">
                        <label htmlFor="auth-email" className="form-label">
                            Email
                        </label>
                        <input
                            id="auth-email"
                            type="email"
                            className="form-control"
                            placeholder="you@example.com"
                            autoComplete="username"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="auth-password" className="form-label">
                            Password
                        </label>
                        <input
                            id="auth-password"
                            type="password"
                            className="form-control"
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                    </div>
                    <div className="d-grid gap-2">
                        <button type="button" className="btn btn-primary btn-lg">
                            Enter workspace
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
