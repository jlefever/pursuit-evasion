import IPoint from "../geometry/IPoint";
import IVehicle from "../motion/IVehicle";
import IRenderer from "./IRenderer";
import IRenderingContext from "./IRenderingContext";

const VEHICLE_DISPLAY_RADIUS = 15;
const VEHICLE_STROKE_WIDTH = 3;
const VEHICLE_STROKE_COLOR = "black";
const VEHICLE_ARROW_RADIUS = 28;
const VEHICLE_ARROW_LENGTH = 8;

export default abstract class VehicleRenderer implements IRenderer {
    private readonly _vehicle: IVehicle;

    public constructor(vehicle: IVehicle) {
        this._vehicle = vehicle;
    }
    
    public render = (ctx: IRenderingContext, alpha: number) => {
        let { position, velocity, heading} = this._vehicle;

        // Interpolate the vehicle's position based on the current velocity.
        position = position.add(velocity.scale(alpha));

        ctx.lineWidth = VEHICLE_STROKE_WIDTH;
        ctx.strokeStyle = VEHICLE_STROKE_COLOR;
        ctx.fillStyle = this.getColor();

        // Draw circle for the agents position
        drawCircle(ctx, position, VEHICLE_DISPLAY_RADIUS);

        // Draw arrow for the agent facing direction
        drawArrow(ctx, position, heading, VEHICLE_ARROW_RADIUS, VEHICLE_ARROW_LENGTH);
    }

    protected abstract getColor():  string;
}

const drawCircle = (ctx: IRenderingContext, pos: IPoint, radius: number) => {
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y, radius, radius, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

const drawArrow = (ctx: IRenderingContext, pos: IPoint, dir: number, radius: number, length: number) => {
    ctx.save();
    ctx.beginPath();
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