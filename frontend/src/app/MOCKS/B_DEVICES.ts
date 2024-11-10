import { BuildingDevice } from "../models/building_device";

export const B_DEVICES: BuildingDevice[] = [
    {
        id: 1,
        name: "Device 1",
        energy: 100,
        energyClass: "A",
        buildingId: 1
    },
    {
        id: 2,
        name: "Device 2",
        energy: 0,
        energyClass: "B",
        buildingId: 1
    },
    {
        id: 3,
        name: "Device 3",
        energy: -100,
        energyClass: "C",
        buildingId: 2
    }
];