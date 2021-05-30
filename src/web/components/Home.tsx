import { h, FunctionalComponent } from "preact";
import Game from "./Game";

const comp: FunctionalComponent = () => {
    return <div class="section">
        <div class="container is-widescreen">
            <h1 class="title">Pursuit Evasion</h1>
            <div class="content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate
                sapien. Condimentum id venenatis a condimentum vitae sapien pellentesque
                habitant morbi. Non odio euismod lacinia at quis risus sed vulputate.</p>
            </div>
            <Game />
        </div>
    </div>;
}

export default comp;
