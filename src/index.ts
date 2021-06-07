import "./web/style/index.css";
import "./web/style/fontawesome/fontawesome.min.css";
import "./web/style/bulma.min.css";
import "./web/style/bulma-slider.min.css";
import App from "./web/components/App";
import Terrain from "./pe/terrain/Terrain";
import GameDefaults from "./pe/game/GameDefaults";
import Victory from "./pe/game/Victory";

export default App;

window.addEventListener("load", _ => {
    const width = 1515;
    const numHCells = 40;
    const numVCells = 26;

    const terrain = new Terrain(numHCells, numVCells, width);
    const world = GameDefaults.createDefaultWorld(terrain);

    let status = Victory.IN_PROGRESS;

    while (status === Victory.IN_PROGRESS) {
        status = world.update();
        console.log(Victory[status]);
    }
});