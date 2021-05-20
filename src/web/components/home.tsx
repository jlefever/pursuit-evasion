import { h, Fragment } from "preact";
import Game from "../../pe/views/game";

function Home(props: { path: string }) {
    return <div class="section">
        <div class="container is-widescreen">
            <h1 class="title">Pursuit Evasion</h1>
            <div class="content">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate
                    sapien. Condimentum id venenatis a condimentum vitae sapien pellentesque
                    habitant morbi. Non odio euismod lacinia at quis risus sed vulputate.
                    </p>
            </div>
            <div class="columns">
                <div class="column is-three-quarters">
                    <div class="box">
                        <Game />
                    </div>
                </div>
                <div class="column">
                    <nav class="panel is-info" style="height: 100%">
                        <p class="panel-heading">Options</p>
                        <p class="panel-tabs">
                            <a class="is-active">One</a>
                            <a>Two</a>
                            <a>Three</a>
                        </p>
                        <div class="panel-block">
                            <p class="control has-icons-left">
                                <input class="input" type="text" placeholder="Search" />
                                <span class="icon is-left">
                                    <i class="fas fa-search" aria-hidden="true"></i>
                                </span>
                            </p>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    </div>;
};

export default Home;
