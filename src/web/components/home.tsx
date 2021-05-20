import { h } from 'preact';
import Game from '../../pe/views/game';

function Home(props: { path: string }) {
    return (
        <div class="section">
            <div class="container is-max-desktop">
                <h1 class="title">Home</h1>
                <p class="subtitle">This is the Home component.</p>
                <nav class="panel">
                    <p class="panel-heading">Browse</p>
                    <div class="panel-block">
                        <p class="control has-icons-left">
                            <input class="input" type="text" placeholder="Search" />
                            <span class="icon is-left">
                                <i class="fas fa-search" aria-hidden="true"></i>
                            </span>
                        </p>
                    </div>
                    <Game></Game>
                </nav>
            </div>
        </div>
    );
};

export default Home;
