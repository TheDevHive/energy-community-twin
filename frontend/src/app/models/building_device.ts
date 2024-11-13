import { EnergyCurve } from "./energy_curve";

export interface BuildingDevice
{
    id: number;
    name: string;
    consumes_energy: boolean;
    energy_curve: EnergyCurve;
    building_id: number;
}