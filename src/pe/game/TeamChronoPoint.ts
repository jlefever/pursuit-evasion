import ISquare from "../geometry/ISquare";
import Team from "./Team";
import ITeamChronoPoint from "./ITeamChronoPoint";

export default class TeamChronoPoint implements ITeamChronoPoint {
    public static readonly DEFAULT_TTR = Number.POSITIVE_INFINITY;
    public static readonly DEFAULT_TEAM = Team.NEITHER;

    public readonly i: number;
    public readonly j: number;
    public readonly bounds: ISquare;
    private _ttr: number = TeamChronoPoint.DEFAULT_TTR;
    private _team: Team = TeamChronoPoint.DEFAULT_TEAM;

    private constructor(i: number, j: number, bounds: ISquare) {
        this.i = i;
        this.j = j;
        this.bounds = bounds;
    }

    public get ttr() {
        return this._ttr;
    }

    public set ttr(value: number) {
        this._ttr = value;
    }

    public get team(): Team {
        return this._team;
    }

    public set team(value: Team) {
        this._team = value;
    }

    public static create = (i: number, j: number, bounds: ISquare) => {
        return new TeamChronoPoint(i, j, bounds);
    }

    public reset = () => {
        this._ttr = TeamChronoPoint.DEFAULT_TTR;
        this._team = TeamChronoPoint.DEFAULT_TEAM;
    }
}