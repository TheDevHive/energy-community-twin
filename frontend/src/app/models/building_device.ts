import { EnergyCurve } from "./energy_curve";

import { Building } from "./building";

export interface BuildingDevice
{
    id: number;
    name: string;
    consumesEnergy: number;
    energy_curve: EnergyCurve;
    building: Building | null;
    lightSensitivity: number;
    windSensitivity: number;
    precipitationSensitivity: number;
    temperatureSensitivity: number;
}