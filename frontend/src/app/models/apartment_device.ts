import { Apartment } from './apartment';
import { EnergyCurve } from './energy_curve';

export interface ApartmentDevice
{
    id: number;
    name: string;
    consumesEnergy: boolean;
    energy_curve: EnergyCurve;
    apartment: Apartment | null;
}