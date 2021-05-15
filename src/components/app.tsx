import { h } from 'preact';
import { Route, Router } from 'preact-router';

import Home from './home';
import NotFoundPage from './notfound';
import Header from './header';

import ELK from 'elkjs/lib/elk.bundled';

function App() {

    const graph = {
        id: "root",
        layoutOptions: { 'elk.algorithm': 'layered' },
        children: [
          { id: "n1", width: 30, height: 30 },
          { id: "n2", width: 30, height: 30 },
          { id: "n3", width: 30, height: 30 }
        ],
        edges: [
          { id: "e1", sources: [ "n1" ], targets: [ "n2" ] },
          { id: "e2", sources: [ "n1" ], targets: [ "n3" ] }
        ]
      }

    const elk = new ELK()

    // elk.layout(graph).then(console.log).catch(console.error);

    return (
        <div id="preact_root">
            <Header />
            <Router>
                <Home path="/:itemPath*" />
                <NotFoundPage default />
            </Router>
        </div>
    );
};

export default App;
