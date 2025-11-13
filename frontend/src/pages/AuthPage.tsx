import React from 'react';

const useSetShow = function (): [boolean, () => void] {
    const [showAlert, setShowAlert] = React.useState<boolean>(false);
    React.useEffect(() => {
        if (!showAlert) return;
        const timeoutId: number = setTimeout(() => {
            setShowAlert(false);
        }, 5000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [showAlert]);

    return [showAlert, () => setShowAlert(true)];
};

export const AuthPage = function () {
    const [authEmail, setAuthEmail] = React.useState<string>('');
    const [authPassword, setAuthPassword] = React.useState<string>('');
    const [showAlert, setShowAlert] = useSetShow();

    const handleChange = function (id: 'auth-email' | 'auth-password') {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            if (id === 'auth-email') setAuthEmail(e.target.value);
            if (id === 'auth-password') setAuthPassword(e.target.value);
        };
    };

    const handleSubmit = function (event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log({authEmail, authPassword});
        setShowAlert();
    };

    return (
        <div className="auth-page">
            <div className="auth-page__panel">
                <div className="auth-page__intro">
                    <p className="text-uppercase fw-semibold text-primary mb-2">MSG Manager</p>
                </div>
                <form className="auth-page__form" onSubmit={handleSubmit}>
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
                            value={authEmail}
                            onChange={handleChange('auth-email')}
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
                            value={authPassword}
                            onChange={handleChange('auth-password')}
                        />
                    </div>
                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary btn-lg">
                            Enter workspace
                        </button>
                    </div>
                    {showAlert && (
                        <div className="alert alert-danger mt-3 mb-0" role="alert">
                            Authentication is not yet implemented.
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};
