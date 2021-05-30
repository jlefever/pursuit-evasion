import IRenderingContext from "./IRenderingContext";

export default interface IRenderer {
    readonly render: (ctx: IRenderingContext, alpha: number) => void;
}