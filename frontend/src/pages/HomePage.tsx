import {AppShell} from '../components/app-shell';
import {Navbar} from '../components/navbar';

export const HomePage = function () {
    return (
        <div className="app-root">
            <Navbar />
            <AppShell />
        </div>
    );
};
