import { Community } from "./community";

export interface Building {
    id: number;
    community: Community;
    address: string;
    floors: number;
    energyCost: number;

    stats: BuildingStats;

}

export interface BuildingStats {
    buildingId: number;
    apartments: number;
    members: number;
    energyProduction: number;
    energyConsumption: number;
    energyClass: string;
}