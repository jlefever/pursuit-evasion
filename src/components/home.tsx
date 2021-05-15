import { FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

import RichList, { Entry } from './richList'
import { MutableForrest } from '../domain/adts'
import MenuIcon from './diagram/menuIcon';

function Home(props: any) {
    // const forrest = new MutableForrest<Entry>();

    const x = [
        {
            id: 0,
            text: "src",
            icon: "fas fa-folder has-text-info",
            tags: [{
                text: "MVP-12",
                class: "is-light is-warning"
            }]
        },
        {
            id: 1,
            text: "build",
            icon: "fas fa-folder has-text-info"
        },
        {
            id: 2,
            text: "README.md",
            icon: "far fa-file"
        }
    ]

    const y = [
        {
            id: 3,
            text: "sample.py",
            icon: "far fa-file"
        }
    ]

    const [list, setList] = useState(x);

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
                    <RichList entries={list} onClick={id => setList(y)} />
                    {/* <div class="panel-block">
                        <div class="control">
                        <nav class="breadcrumb is-small" aria-label="breadcrumbs">
                            <ul>
                                <li>
                                    <a href="#">
                                        <span class="icon is-small">
                                            <i class="fas fa-home" aria-hidden="true"></i>
                                        </span>
                                        <span>Bulma</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <span class="icon is-small">
                                            <i class="fas fa-book" aria-hidden="true"></i>
                                        </span>
                                        <span>Documentation</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <span class="icon is-small">
                                            <i class="fas fa-puzzle-piece" aria-hidden="true"></i>
                                        </span>
                                        <span>Components</span>
                                    </a>
                                </li>
                                <li class="is-active">
                                    <a href="#">
                                        <span class="icon is-small">
                                            <i class="fas fa-thumbs-up" aria-hidden="true"></i>
                                        </span>
                                        <span>Breadcrumb</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                        </div>
                    </div> */}
                </nav>
                <MenuIcon />
            </div>
        </div>
    );
};

export default Home;
