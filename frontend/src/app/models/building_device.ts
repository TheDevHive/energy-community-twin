import { Building } from "./building";

export interface BuildingDevice
{
    id: number;
    name: string;
    energy: number;
    energyClass: string;
    building: Building | null;
}