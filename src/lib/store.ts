import { create } from 'zustand';

interface AppState {
  // UI States
  isMobileMenuOpen: boolean;
  isSoundEnabled: boolean;
  
  // Actions
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleSound: () => void;
}

export const useStore = create<AppState>((set) => ({
  // Initial Values
  isMobileMenuOpen: false,
  isSoundEnabled: true, // Default to true for that "Cyber" feel

  // Functions to update state
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),
}));