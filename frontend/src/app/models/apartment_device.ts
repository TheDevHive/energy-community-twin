export interface ApartmentDevice
{
    id: number;
    name: string;
    log_path: string;
    consumes_energy: boolean;
    energy_class: string;
    apartment_id: number;
}