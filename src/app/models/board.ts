import { Sound } from './sound';

export interface Board {
    id?: string;
    email: string;
    backgroundUrl?: string;
    sounds: Sound[];
}