import { h } from 'preact';
import { Route, Router } from 'preact-router';

import Home from './home';
import NotFoundPage from './notfound';
import Header from './header';

function App() {
    return (
        <div id="preact_root">
            <Header />
            <Router>
                <Home path="/" />
                <NotFoundPage default />
            </Router>
        </div>
    );
};

export default App;
