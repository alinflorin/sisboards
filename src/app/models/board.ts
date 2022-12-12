import { Sound } from './sound';

export interface Board {
    id?: string;
    name: string;
    email: string;
    backgroundUrl?: string;
    sounds: Sound[];
}