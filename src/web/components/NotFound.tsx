import { FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router/match';

const NotFound: FunctionalComponent = () => {
    return <div class="section">
        <div class="container is-widescreen">
            <h1 class="title">404</h1>
            {/* <p class="subtitle">That page doesn&apos;t exist.</p> */}
            <div class="content">
                We can't find the requested page.
                {/* <Link href="/">Back to Home</Link> */}
            </div>
        </div>
    </div>;
};

export default NotFound;
