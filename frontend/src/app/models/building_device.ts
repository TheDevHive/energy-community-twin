import { EnergyCurve } from "./energy_curve";

import { Building } from "./building";

export interface BuildingDevice
{
    id: number;
    name: string;
    consumesEnergy: boolean;
    energy_curve: EnergyCurve;
    building: Building | null;
}