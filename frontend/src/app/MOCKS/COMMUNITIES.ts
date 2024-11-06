import { Community } from '../models/community';

export const COMMUNITIES: Community[] = [
  {
    id: 1,
    name: 'Green Energy Community',
    admin: {
      id: 1,
      email: 'alice.johnson@example.com'
    },
    stats: {
      buildings: 5,
      apartments: 25,
      members: 100,
      energyProduction: 5000, // kWh
      energyConsumption: 4500 // kWh
    }
  },
  {
    id: 2,
    name: 'Solar Village Network',
    admin: {
      id: 2,
      email: 'bob.smith@example.com'
    },
    stats: {
      buildings: 3,
      apartments: 12,
      members: 50,
      energyProduction: 2000, // kWh
      energyConsumption: 1500 // kWh
    }
  },
  {
    id: 3,
    name: 'Urban Smart Grid',
    admin: {
      id: 3,
      email: 'charlie.brown@example.com'
    },
    stats: {
      buildings: 7,
      apartments: 35,
      members: 150,
      energyProduction: 8000, // kWh
      energyConsumption: 7500 // kWh
    }
  },
  {
    id: 4,
    name: 'Sustainable Housing District',
    admin: {
      id: 4,
      email: 'david.lee@example.com'
    },
    stats: {
      buildings: 4,
      apartments: 18,
      members: 80,
      energyProduction: 3500, // kWh
      energyConsumption: 3000 // kWh
    }
  },
  {
    id: 5,
    name: 'Eco Green Estates',
    admin: {
      id: 5,
      email: 'eve.white@example.com'
    },
    stats: {
      buildings: 6,
      apartments: 30,
      members: 120,
      energyProduction: 6000, // kWh
      energyConsumption: 5500 // kWh
    }
  },
  {
    id: 6,
    name: 'Renewable Energy Community',
    admin: {
      id: 6,
      email: 'h@h.com'
    },
    stats: {
      buildings: 2,
      apartments: 10,
      members: 40,
      energyProduction: 1000, // kWh
      energyConsumption: 800 // kWh
    }
  }
];
