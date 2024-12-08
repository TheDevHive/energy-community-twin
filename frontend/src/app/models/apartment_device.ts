import { Apartment } from './apartment';
import { EnergyCurve } from './energy_curve';

export interface ApartmentDevice
{
    id: number;
    name: string;
    consumesEnergy: number;
    energy_curve: EnergyCurve;
    apartment: Apartment | null;
    light_sensitivity: number;
    wind_sensitivity: number;
    precipitation_sensitivity: number;
    temperature_sensitivity: number;
}