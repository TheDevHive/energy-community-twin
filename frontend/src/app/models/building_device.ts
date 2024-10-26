export interface BuildingDevice
{
    id: number;
    name: string;
    log_path: string;
    consumes_energy: boolean;
    energy_class: string;
    building_id: number;
}