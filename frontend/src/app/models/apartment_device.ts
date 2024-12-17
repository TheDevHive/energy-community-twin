import { Apartment } from './apartment';
import { EnergyCurve } from './energy_curve';

export interface ApartmentDevice
{
    id: number;
    name: string;
    consumesEnergy: number;
    energy_curve: EnergyCurve;
    apartment: Apartment | null;
    lightSensitivity: number;
    windSensitivity: number;
    precipitationSensitivity: number;
    temperatureSensitivity: number;
}