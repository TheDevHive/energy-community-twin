import { Admin } from "./admin";

export interface Community
{
    id: number;
    name: string;
    admin: Admin;
}