export interface Apartment
{
    id: number;
    residents: number;
    squareFootage: number;
    buildingId: number;
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