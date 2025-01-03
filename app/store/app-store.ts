import { create } from "zustand";

export type AppData = {
  step: number;
};

interface AppStore {
  appData: AppData;
    updateAppData: (appData: AppData) => void;
}


export const appStore = create<AppStore>((set) => ({
  appData: { step: 0 },
  updateAppData: (appData) =>
    set((state) => ({ appData: { ...state.appData, ...appData } })),
}));