import { FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router/match';

const Header: FunctionalComponent = () => {
    return (
        <nav class="navbar" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
            <a class="navbar-item" href="/">
                <img src="../../assets/bulma-logo.png" width="112" height="28" />
            </a>
            </div>
            <div class="navbar-menu">
                <div class="navbar-start">
                    <Link class="navbar-item is-tab" activeClassName="is-active" href="/">Home</Link>
                    <Link class="navbar-item is-tab" activeClassName="is-active" href="/other">Other</Link>
                </div>
            </div>
        </nav>
    );
};

export default Header;
