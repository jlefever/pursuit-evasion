import IAgent from "./IAgent";
import IAgentPerspective from "./IAgentPerspective";
import IDrivableVehicle from "../motion/IDrivableVehicle";
import Vector from "../geometry/Vector";

enum Input {
    NONE  = 0,
    UP    = 2,
    DOWN  = 4,
    LEFT  = 8,
    RIGHT = 16,
}

export default class KeyboardInputAgent implements IAgent {
    private _input = Input.NONE;

    constructor() {
        document.addEventListener("keydown", e => {
            if (e.key === "w") this._input |= Input.UP;
            if (e.key === "s") this._input |= Input.DOWN;
            if (e.key === "a") this._input |= Input.LEFT;
            if (e.key === "d") this._input |= Input.RIGHT;
        });

        document.addEventListener("keyup", e => {
            if (e.key === "w") this._input &= ~Input.UP;
            if (e.key === "s") this._input &= ~Input.DOWN;
            if (e.key === "a") this._input &= ~Input.LEFT;
            if (e.key === "d") this._input &= ~Input.RIGHT;
        });

        // TODO: These event listeners need to unbound at some point.
    }

    public act = (me: IDrivableVehicle, perspective: IAgentPerspective) => {
        let offset = Vector.zero();

        if ((this._input & Input.UP)    === Input.UP)    offset = offset.add(Vector.car(0, -1));
        if ((this._input & Input.DOWN)  === Input.DOWN)  offset = offset.add(Vector.car(0, +1));
        if ((this._input & Input.LEFT)  === Input.LEFT)  offset = offset.add(Vector.car(-1, 0));
        if ((this._input & Input.RIGHT) === Input.RIGHT) offset = offset.add(Vector.car(+1, 0));

        if (offset.isZero) {
            me.break();
            return;
        }

        me.steerTo(me.position.lookAt(me.position.add(offset)).angle);
        me.gas();
    }
}
