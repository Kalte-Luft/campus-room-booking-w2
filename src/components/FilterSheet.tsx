import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { useFilters } from "../store";
import type { Room } from "../types";
import {
  defaultFilters,
  filterRooms,
  type RoomFilters,
} from "../utils/filterRooms";
import { BottomSheet } from "./BottomSheet";
import { Button, Chip, u } from "./Ui";
const kinds: RoomFilters["kind"][] = [
  "Tất cả",
  "Phòng học",
  "Phòng lab",
  "Phòng họp",
  "Phòng tự học",
  "Studio",
];
export function FilterSheet({
  open,
  close,
  rooms,
}: {
  open: boolean;
  close: () => void;
  rooms: Room[];
}) {
  const filters = useFilters((s) => s.filters);
  const apply = useFilters((s) => s.applyFilters);
  const [draft, setDraft] = useState(filters);
  const buildings = useMemo(
    () => ["Tất cả", ...new Set(rooms.map((r) => r.building))].sort(),
    [rooms],
  );
  const floors = useMemo(
    () => [...new Set(rooms.map((r) => r.floor))].sort((a, b) => a - b),
    [rooms],
  );
  const amenities = useMemo(
    () => [...new Set(rooms.flatMap((r) => r.amenities))].sort(),
    [rooms],
  );
  const count = filterRooms(rooms, draft).length;
  return (
    <BottomSheet
      visible={open}
      onClose={close}
      title="Không gian của bạn"
      footer={(dismiss) => (
        <View style={u.row}>
          <Button
            title="Đặt lại"
            secondary
            onPress={() =>
              setDraft({ ...defaultFilters(), search: filters.search })
            }
          />
          <View style={{ flex: 1 }}>
            <Button
              title={`Xem ${count} phòng`}
              onPress={() => {
                apply(draft);
                dismiss();
              }}
            />
          </View>
        </View>
      )}
    >
      <Text style={u.muted}>
        Kết hợp nhiều tiêu chí để tìm đúng nơi bạn cần.
      </Text>
      <Group title="Loại không gian">
        {kinds.map((kind) => (
          <Chip
            key={kind}
            label={kind}
            active={draft.kind === kind}
            onPress={() => setDraft({ ...draft, kind })}
          />
        ))}
      </Group>
      <Group title="Tòa nhà">
        {buildings.map((building) => (
          <Chip
            key={building}
            label={building}
            active={draft.building === building}
            onPress={() => setDraft({ ...draft, building })}
          />
        ))}
      </Group>
      <Group title="Tầng">
        <Chip
          label="Tất cả"
          active={draft.floor === null}
          onPress={() => setDraft({ ...draft, floor: null })}
        />
        {floors.map((floor) => (
          <Chip
            key={floor}
            label={`Tầng ${floor}`}
            active={draft.floor === floor}
            onPress={() => setDraft({ ...draft, floor })}
          />
        ))}
      </Group>
      <Group title="Sức chứa tối thiểu">
        {[0, 4, 8, 12, 20, 30].map((minCapacity) => (
          <Chip
            key={minCapacity}
            label={minCapacity ? `${minCapacity}+ chỗ` : "Bất kỳ"}
            active={draft.minCapacity === minCapacity}
            onPress={() => setDraft({ ...draft, minCapacity })}
          />
        ))}
      </Group>
      <Group title="Tiện ích · chọn nhiều">
        {amenities.map((item) => (
          <Chip
            key={item}
            label={item}
            active={draft.amenities.includes(item)}
            onPress={() =>
              setDraft({
                ...draft,
                amenities: draft.amenities.includes(item)
                  ? draft.amenities.filter((a) => a !== item)
                  : [...draft.amenities, item],
              })
            }
          />
        ))}
      </Group>
    </BottomSheet>
  );
}
function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: 12 }}>
      <Text style={u.section}>{title}</Text>
      <View style={u.wrap}>{children}</View>
    </View>
  );
}
