import { create } from "zustand";
/**
 * Represents the minimal details of a school to persist across the app.
 */
export interface SchoolDetails {
  schoolId: string;
  schoolCode: string;
  name: string;
  schoolImage: string;
}

interface SchoolState {
  schoolDetails: SchoolDetails | null;
  setSchoolDetails: (details: SchoolDetails) => void;
  clearSchoolDetails: () => void;
}

/**
 * Zustand store for persisting validated school details across the app.
 */
export const useSchoolStore = create<SchoolState>((set) => ({
  schoolDetails: null,
  setSchoolDetails: (details) => set({ schoolDetails: details }),
  clearSchoolDetails: () => set({ schoolDetails: null }),
}));
