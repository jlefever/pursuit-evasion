import { h } from 'preact';
import { Router } from 'preact-router';

import Home from './Home';
import NotFoundPage from './NotFound';

function App() {
    return (
        <div id="preact_root">
            <Router>
                <Home path="/" />
                <NotFoundPage default />
            </Router>
        </div>
    );
};

export default App;
