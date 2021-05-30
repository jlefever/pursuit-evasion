import IAgent from "../IAgent";
import IPoint from "../IPoint";
import IRenderer from "./IRenderer";
import IRenderingContext from "./IRenderingContext";

const AGENT_DISPLAY_RADIUS = 15;
const AGENT_STROKE_WIDTH = 3;
const AGENT_STROKE_COLOR = "black";
const AGENT_ARROW_LENGTH = 8;

export default abstract class AgentRenderer implements IRenderer {
    private readonly _agent: IAgent;

    public constructor(agent: IAgent) {
        this._agent = agent;
    }
    
    public render = (ctx: IRenderingContext, alpha: number) => {
        let pos = this._agent.vehicle.position;
        let vel = this._agent.vehicle.velocity;
        let heading = this._agent.vehicle.heading;

        // Interpolate the agent's position based on their current velocity.
        pos = pos.add(vel.scale(alpha));

        ctx.lineWidth = AGENT_STROKE_WIDTH;
        ctx.strokeStyle = AGENT_STROKE_COLOR;
        ctx.fillStyle = this.getColor();

        // Draw circle for the agents position
        drawCircle(ctx, pos, AGENT_DISPLAY_RADIUS);

        // Draw arrow for the agent facing direction
        drawArrow(ctx, pos, heading, AGENT_DISPLAY_RADIUS, AGENT_ARROW_LENGTH);
    }

    protected abstract getColor():  string;
}

const drawCircle = (ctx: IRenderingContext, pos: IPoint, radius: number) => {
    ctx.ellipse(pos.x, pos.y, radius, radius, 0, 0, 2 * Math.PI);
}

const drawArrow = (ctx: IRenderingContext, pos: IPoint, dir: number, radius: number, length: number) => {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.translate(pos.x, pos.y);
    ctx.rotate(dir);
    ctx.translate(radius, 0);
    ctx.rotate(Math.PI / 4);
    ctx.moveTo(-length, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(0, length);
    ctx.stroke();
    ctx.restore();
}