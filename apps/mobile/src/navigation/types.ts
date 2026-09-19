import type { Material } from '../types/material';

export type RootStackParamList = {
  Materials: undefined;
  MaterialForm: { material?: Material } | undefined;
};
