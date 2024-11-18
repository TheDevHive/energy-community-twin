import { Admin } from "./admin";

export interface Community
{
    id: number;
    name: string;
    admin: Admin;

    stats: CommunityStats;
}

export interface CommunityStats
{
    communityId: number;
    buildings: number;
    apartments: number;
    members: number;
    energyProduction: number;
    energyConsumption: number;
}