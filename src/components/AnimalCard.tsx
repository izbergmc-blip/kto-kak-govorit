import { useState } from 'react';
import type { Animal } from '../types';
type Props = { animal: Animal; active: boolean; onSelect: (animal: Animal) => void };
export function AnimalCard({ animal, active, onSelect }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = `${import.meta.env.BASE_URL}${animal.image.replace(/^\//, '')}`;
  return <button className={`animal-card${active ? ' is-active' : ''}`} onClick={() => onSelect(animal)} type="button" aria-label={`${animal.name}. ${animal.soundText}`} aria-pressed={active}>
    <span className="animal-art">{imageFailed ? <span className="image-fallback" aria-hidden="true">🐾</span> : <img src={imageSrc} alt={animal.alt} loading="lazy" onError={() => setImageFailed(true)} />}</span>
    <span className="animal-name">{animal.name}</span>
    {active && <span className="animal-sound" aria-live="polite">{animal.soundText}</span>}
  </button>;
}
