import { create } from "zustand";
import { dayKey } from "./dates";
import type { RoomFilters } from "./utils/filterRooms";
import { defaultFilters } from "./utils/filterRooms";

type ClientState = {
  filters: RoomFilters;
  date: string;
  setSearch: (search: string) => void;
  applyFilters: (filters: RoomFilters) => void;
  clear: () => void;
  setDate: (date: string) => void;
};
// Only client choices live here. Firestore data lives in TanStack Query.
export const useFilters = create<ClientState>((set) => ({
  filters: defaultFilters(),
  date: dayKey(new Date()),
  setSearch: (search) =>
    set((state) => ({ filters: { ...state.filters, search } })),
  applyFilters: (filters) => set({ filters }),
  clear: () => set({ filters: defaultFilters() }),
  setDate: (date) => set({ date }),
}));
