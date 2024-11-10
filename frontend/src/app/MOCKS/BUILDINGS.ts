import { id } from "@swimlane/ngx-datatable";
import { Building } from "../models/building";
import { Community } from "../models/community";

const mockCommunity: Community = {
    id: 1,
    name: 'Green Energy Community',
    admin: {
        id: 1,
        email: 'a@a.com'
    },
    stats: {
        communityId: 1,
        buildings: 5,
        apartments: 25,
        members: 100,
        energyProduction: 5000,
        energyConsumption: 4500
    }
}


export const BUILDINGS: Building[] = [
    {
        id: 1,
        community: mockCommunity,
        address: '123 Green Street',
        floors: 5,
        stats: {
            buildingId: 1,
            apartments: 5,
            members: 20,
            energyProduction: 1000,
            energyConsumption: 900
        }
    },
    {
        id: 2,
        community: mockCommunity,
        address: '456 Green Street',
        floors: 3,
        stats: {
            buildingId: 2,
            apartments: 7,
            members: 30,
            energyProduction: 1500,
            energyConsumption: 1300
        }
    },
    {
        id: 3,
        community: mockCommunity,
        address: '789 Green Street',
        floors: 7,
        stats: {
            buildingId: 3,
            apartments: 13,
            members: 50,
            energyProduction: 2500,
            energyConsumption: 3300
        }
    },
    {
        id: 4,
        community: mockCommunity,
        address: '101 Green Street',
        floors: 4,
        stats: {
            buildingId: 4,
            apartments: 10,
            members: 40,
            energyProduction: 2000,
            energyConsumption: 1800
        }
    },
    {
        id: 5,
        community: mockCommunity,
        address: '112 Green Street',
        floors: 6,
        stats: {
            buildingId: 5,
            apartments: 10,
            members: 40,
            energyProduction: 2000,
            energyConsumption: 2000
        }
    },
    {
        id: 6,
        community: mockCommunity,
        address: '113 Green Street',
        floors: 6,
        stats: {
            buildingId: 6,
            apartments: 10,
            members: 40,
            energyProduction: 2000,
            energyConsumption: 1800
        }
    },
    {
        id: 7,
        community: mockCommunity,
        address: '114 Green Street',
        floors: 6,
        stats: {
            buildingId: 7,
            apartments: 10,
            members: 40,
            energyProduction: 2000,
            energyConsumption: 1800
        }
    },
    {
        id: 8,
        community: mockCommunity,
        address: '115 Green Street',
        floors: 6,
        stats: {
            buildingId: 8,
            apartments: 10,
            members: 40,
            energyProduction: 2000,
            energyConsumption: 1800
        }
    },
    {
        id: 9,
        community: mockCommunity,
        address: '116 Green Street',
        floors: 6,
        stats: {
            buildingId: 9,
            apartments: 10,
            members: 40,
            energyProduction: 2000,
            energyConsumption: 1800
        }
    }
]