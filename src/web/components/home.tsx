import { h, Fragment, Component } from "preact";
import Game2 from "./game2";

interface HomeState {
    playing: boolean;
    updatesPerSecond: number;
}

class Home extends Component<{}, HomeState> {
    constructor() {
        super();
        this.state = { playing: false, updatesPerSecond: 20 };
    }

    render() {
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
                            {/* 962 x 592 */}
                            <Game2 width={962} numHCells={26} numVCells={26} playing={this.state.playing} desiredUps={this.state.updatesPerSecond} />
                        </div>
                        <div class="box">
                            <table class="table is-striped is-hoverable is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>Agent</th>
                                        <th>Team</th>
                                        <th>Position</th>
                                        <th>Velocity</th>
                                        <th>Target</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>0</th>
                                        <td>Evader</td>
                                        <td>(0.4, 2)</td>
                                        <td>(0.4, 2)</td>
                                        <td>(0.4, 2)</td>
                                    </tr>
                                    <tr>
                                        <th>1</th>
                                        <td>Pursuer</td>
                                        <td>(0.4, 2)</td>
                                        <td>(0.4, 2)</td>
                                        <td>(0.4, 2)</td>
                                    </tr>
                                    <tr>
                                        <th>2</th>
                                        <td>Pursuer</td>
                                        <td>(0.4, 2)</td>
                                        <td>(0.4, 2)</td>
                                        <td>(0.4, 2)</td>
                                    </tr>
                                    <tr>
                                        <th>3</th>
                                        <td>Pursuer</td>
                                        <td>(0.4, 2)</td>
                                        <td>(0.4, 2)</td>
                                        <td>(0.4, 2)</td>
                                    </tr>
                                    <tr>
                                        <th>4</th>
                                        <td>Pursuer</td>
                                        <td>(0.4, 2)</td>
                                        <td>(0.4, 2)</td>
                                        <td>(0.4, 2)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="column">
                        <nav class="panel">
                            <p class="panel-heading">Simulation</p>
                            <div class="panel-block">

                                <p class="control is-expanded">
                                    <button onClick={_ => {
                                        this.setState({ playing: !this.state.playing })
                                    }}
                                        class="button is-fullwidth is-outlined is-link">
                                        <span class="icon">
                                            {this.state.playing ? <i class="fas fa-pause" /> : <i class="fas fa-play" />}
                                        </span>
                                    </button>
                                </p>
                            </div>
                            <div class="panel-block">
                                <input
                                    value={this.state.updatesPerSecond}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        this.setState({ updatesPerSecond: parseInt((e.target as HTMLInputElement).value) });
                                    }}
                                    class="slider has-output mt-0 mb-0" step="1" min="0" max="500" type="range" />
                                <output class="pr-2 pl-2">{this.state.updatesPerSecond}</output>
                            </div>
                        </nav>
                        
                        <nav class="panel">
                            <p class="panel-heading">Options</p>
                            <div class="panel-block is-justify-content-center has-text-weight-semibold">
                                Pursuers
                        </div>

                            <div class="panel-block">
                                <div style="width: 100%">
                                    <div class="field">
                                        <label class="label has-text-weight-light">Speed</label>
                                        <div class="control">
                                            <input class="slider has-output is-fullwidth mt-0 mb-0" step="1" min="1" max="360" value="50" type="range" />
                                            <output>50</output>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="panel-block">
                                <div style="width: 100%">
                                    <div class="field">
                                        <label class="label has-text-weight-light">Turn Radius</label>
                                        <div class="control">
                                            <input class="slider has-output is-fullwidth mt-0 mb-0" step="1" min="0" max="100" value="50" type="range" />
                                            <output >50</output>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="panel-block is-justify-content-center has-text-weight-semibold">
                                Evaders
                        </div>

                            <div class="panel-block">
                                <div style="width: 100%">
                                    <div class="field">
                                        <label class="label has-text-weight-light">Speed</label>
                                        <div class="control">
                                            <input class="slider has-output is-fullwidth mt-0 mb-0" step="1" min="0" max="100" value="50" type="range" />
                                            <output >50</output>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="panel-block">
                                <div style="width: 100%">
                                    <div class="field">
                                        <label class="label has-text-weight-light">Turn Radius</label>
                                        <div class="control">
                                            <input class="slider has-output is-fullwidth mt-0 mb-0" step="1" min="0" max="100" value="50" type="range" />
                                            <output >50</output>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="panel-block">
                                <button class="button is-link is-outlined is-fullwidth">
                                    Reset to Defaults
                            </button>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default Home;
