import {Route, Routes} from 'react-router';

import './App.css';
import {AuthPage} from './pages/AuthPage';
import {HomePage} from './pages/HomePage';
import {NotFoundPage} from './pages/NotFoundPage';
import {ThreadPage} from './pages/ThreadPage';

export const App = function () {
    return (
        <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/thread/:thread_id" element={<ThreadPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};
