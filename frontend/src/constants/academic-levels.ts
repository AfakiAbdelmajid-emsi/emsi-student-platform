import { AcademicLevel } from '@/types/profile';

export const ACADEMIC_LEVELS: {
  value: AcademicLevel;
  label: string;
}[] = [
  { value: 'CP1', label: '1ère Année Préparatoire (CP1)' },
  { value: 'CP2', label: '2ème Année Préparatoire (CP2)' },
  { value: 'GI1', label: '1ère Année Ingénieur (GI1)' },
  { value: 'GI2', label: '2ème Année Ingénieur (GI2)' },
  { value: 'GI3', label: '3ème Année Ingénieur (GI3)' }
];