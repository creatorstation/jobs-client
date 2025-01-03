import { create } from "zustand";

export type UserData = {
  name: string;
  email: string;
  phone?: string;
  cv?: FileList;
  europeSide?: string;
  semt?: string;
  linkedin?: string;
  mandatoryInternship?: boolean;
  hasInsurance?: boolean;
  workDays?: string[];
};

interface UserStore {
  userData: UserData | null;
  updateUserData: (userData: UserData) => void;
}

export const userStore = create<UserStore>((set) => ({
  userData: null,
  updateUserData: (userData) =>
    set((state) => ({ userData: { ...state.userData, ...userData } })),
}));
