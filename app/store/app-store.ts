import { create } from 'zustand';

export type AppData = {
  step?: number;
  oauthLoading?: boolean;
};

interface AppStore {
  appData: AppData;
  updateAppData: (appData: AppData) => void;
}

export const appStore = create<AppStore>((set) => ({
  appData: { step: 0, oauthLoading: false },
  updateAppData: (appData) => set((state) => ({ appData: { ...state.appData, ...appData } })),
}));
