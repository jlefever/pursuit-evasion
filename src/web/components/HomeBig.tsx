import { h, FunctionalComponent } from "preact";
import Game from "./Game";

const comp: FunctionalComponent = () => {
    return <div class="hero">
        <div class="hero-body">
            <Game />
        </div>
    </div>;
}

export default comp;
