import type { Room } from "../types";
export type RoomFilters = {
  search: string;
  kind: "Tất cả" | Room["kind"];
  building: string;
  floor: number | null;
  minCapacity: number;
  amenities: string[];
};
export const defaultFilters = (): RoomFilters => ({
  search: "",
  kind: "Tất cả",
  building: "Tất cả",
  floor: null,
  minCapacity: 0,
  amenities: [],
});
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
export const filterRooms = (rooms: Room[], filters: RoomFilters) =>
  rooms.filter(
    (room) =>
      normalize(
        `${room.name} ${room.building} ${room.kind} ${room.amenities.join(" ")}`,
      ).includes(normalize(filters.search.trim())) &&
      (filters.kind === "Tất cả" || room.kind === filters.kind) &&
      (filters.building === "Tất cả" || room.building === filters.building) &&
      (filters.floor === null || room.floor === filters.floor) &&
      room.capacity >= filters.minCapacity &&
      filters.amenities.every((item) => room.amenities.includes(item)),
  );
export const filterCount = (f: RoomFilters) =>
  Number(f.kind !== "Tất cả") +
  Number(f.building !== "Tất cả") +
  Number(f.floor !== null) +
  Number(f.minCapacity > 0) +
  f.amenities.length;
