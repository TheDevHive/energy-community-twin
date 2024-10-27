import { Community } from "./community";

export interface Building
{
    id: number;
    community: Community;
    address: string;
    floors: number;
}