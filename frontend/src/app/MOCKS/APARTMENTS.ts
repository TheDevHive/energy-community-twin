import { Apartment } from "../models/apartment";

export const APARTMENTS: Apartment[] = [
    {
        id: 1,
        residents: 1,
        squareFootage: 100,
        buildingId: 1,
        userId: 1,
        stats: {
            apartmentId: 1,
            energyProduction: 200,
            energyConsumption: 200,
            energyClass: "A"
        }
    },
    {
        id: 2,
        residents: 2,
        squareFootage: 200,
        buildingId: 1,
        userId: 2,
        stats: {
            apartmentId: 2,
            energyProduction: 200,
            energyConsumption: 300,
            energyClass: "B"
        }
    },
    {
        id: 3,
        residents: 3,
        squareFootage: 300,
        buildingId: 2,
        userId: 3,
        stats: {
            apartmentId: 3,
            energyProduction: 700,
            energyConsumption: 400,
            energyClass: "C"
        }
    },
    {
        id: 4,
        residents: 4,
        squareFootage: 400,
        buildingId: 2,
        userId: 4,
        stats: {
            apartmentId: 4,
            energyProduction: 400,
            energyConsumption: 500,
            energyClass: "D"
        }
    },
    {
        id: 5,
        residents: 5,
        squareFootage: 500,
        buildingId: 3,
        userId: 5,
        stats: {
            apartmentId: 5,
            energyProduction: 500,
            energyConsumption: 600,
            energyClass: "E"
        }
    },
    {
        id: 6,
        residents: 6,
        squareFootage: 600,
        buildingId: 3,
        userId: 6,
        stats: {
            apartmentId: 6,
            energyProduction: 600,
            energyConsumption: 700,
            energyClass: "F"
        }
    }
];