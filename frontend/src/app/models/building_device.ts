import { EnergyCurve } from "./energy_curve";

import { Building } from "./building";

export interface BuildingDevice
{
    id: number;
    name: string;
    consumesEnergy: number;
    energy_curve: EnergyCurve;
    building: Building | null;
    light_sensitivity: number;
    wind_sensitivity: number;
    precipitation_sensitivity: number;
    temperature_sensitivity: number;
}