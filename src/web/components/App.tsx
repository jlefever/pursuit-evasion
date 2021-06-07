import { h } from 'preact';
import { Router } from 'preact-router';

import Home from './Home';
import HomeBig from './HomeBig';
import NotFoundPage from './NotFound';

function App() {
    return (
        <div id="preact_root">
            <Router>
                <HomeBig path="/" />
                <NotFoundPage default />
            </Router>
        </div>
    );
};

export default App;
