import { BuildingDevice } from "../models/building_device";

export const B_DEVICES: BuildingDevice[] = [
    {
        id: 1,
        name: "Device 1",
        energy: 100,
        energyClass: "A",
        building: null
    },
    {
        id: 2,
        name: "Device 2",
        energy: 0,
        energyClass: "B",
        building: null
    },
    {
        id: 3,
        name: "Device 3",
        energy: -100,
        energyClass: "C",
        building: null
    }
];