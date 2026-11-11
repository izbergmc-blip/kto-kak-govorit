import animalsJson from '../../data/animals.json';
import type { Animal } from '../types';

// The JSON file is the single source of truth for animal labels and media paths.
export const animals = animalsJson satisfies Animal[];
