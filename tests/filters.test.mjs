import test from "node:test";
import assert from "node:assert/strict";
import {
  defaultFilters,
  filterCount,
  filterRooms,
} from "../src/utils/filterRooms.ts";
const rooms = [
  {
    id: "a",
    name: "Phòng học A",
    kind: "Phòng học",
    building: "Tòa A",
    floor: 1,
    capacity: 12,
    amenities: ["Máy chiếu", "Wi-Fi"],
    color: "#fff",
    description: "",
  },
  {
    id: "b",
    name: "Studio B",
    kind: "Studio",
    building: "Tòa B",
    floor: 2,
    capacity: 6,
    amenities: ["Máy quay", "Wi-Fi"],
    color: "#fff",
    description: "",
  },
];
test("default filters return all rooms", () =>
  assert.equal(filterRooms(rooms, defaultFilters()).length, 2));
test("Vietnamese search also accepts keywords without diacritics", () => {
  assert.equal(
    filterRooms(rooms, { ...defaultFilters(), search: "phong hoc" })[0].id,
    "a",
  );
});
test("all selected amenities must be present", () => {
  const result = filterRooms(rooms, {
    ...defaultFilters(),
    amenities: ["Máy chiếu", "Wi-Fi"],
  });
  assert.deepEqual(
    result.map((r) => r.id),
    ["a"],
  );
});
test("type, building, floor, capacity and amenities combine with AND", () => {
  const f = {
    ...defaultFilters(),
    kind: "Studio",
    building: "Tòa B",
    floor: 2,
    minCapacity: 6,
    amenities: ["Máy quay"],
  };
  assert.equal(filterRooms(rooms, f).length, 1);
  assert.equal(filterCount(f), 5);
  assert.equal(filterRooms(rooms, { ...f, minCapacity: 8 }).length, 0);
});
