import { Building } from "./building";

export interface Apartment
{
    id: number;
    residents: number;
    squareFootage: number;
    building: Building;
    userId: number;

    stats: ApartmentStats;
}

export interface ApartmentStats
{
    apartmentId: number;
    energyProduction: number;
    energyConsumption: number;
    energyClass: string;
}