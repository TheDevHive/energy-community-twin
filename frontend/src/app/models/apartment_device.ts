import { EnergyCurve } from './energy_curve';

export interface ApartmentDevice
{
    id: number;
    name: string;
    consumes_energy: boolean;
    energy_curve: EnergyCurve;
    apartment_id: number;
}