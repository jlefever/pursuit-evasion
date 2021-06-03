import IChronoPoint from "../chrono/IChronoPoint";
import Team from "./Team";

export default interface ITeamChronoPoint extends IChronoPoint {
    team: Team;
}