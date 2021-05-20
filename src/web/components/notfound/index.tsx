import { FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router/match';

const NotFound: FunctionalComponent = () => {
    return (
        <div class="section">
            <div class="container is-max-desktop">
                <h1 class="title">Error 404</h1>
                <p class="subtitle">That page doesn&apos;t exist.</p>
                <Link href="/">Back to Home</Link>
            </div>
        </div>
    );
};

export default NotFound;
