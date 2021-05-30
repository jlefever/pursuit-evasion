import Vector from "../geometry/Vector";
import IParticle from "../motion/IParticle";
import ITerrian from "../terrian/ITerrian";
import IPhysics from "./IPhysics";

/**
 * A 100% complete and realistic physics simulation.
 */
export default class Physics implements IPhysics {
    private readonly _terrian: ITerrian;
    private readonly _particles: IParticle[];

    public constructor(terrian: ITerrian) {
        this._terrian = terrian;
        this._particles = new Array();
    }

    public addParticle(particle: IParticle) {
        this._particles.push(particle);
    }

    public update = () => {
        this._particles.forEach(p => {
            const desiredPos = p.position.add(p.velocity);

            if (this._terrian.isLegalPoint(desiredPos.x ,desiredPos.y)) {
                p.position = desiredPos;
            } else {
                p.velocity = Vector.zero();
            }
        });
    }
}