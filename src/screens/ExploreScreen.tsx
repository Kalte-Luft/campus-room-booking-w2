import { useCallback, useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import { useRooms, useSeedRooms } from "../hooks/useRoomQueries";
import { useFilters } from "../store";
import { filterCount, filterRooms } from "../utils/filterRooms";
import { errorMessage } from "../utils/errors";
import type { ExploreProps } from "../navigation/types";
import type { Room } from "../types";
import { C } from "../theme";
import moreRooms from "../more-rooms.json";
import { RoomCard } from "../components/RoomCard";
import { FilterSheet } from "../components/FilterSheet";
import { MotionPress } from "../components/MotionPress";
import { LoadingCards } from "../components/LoadingCards";
import { StateView, enter, layout, u } from "../components/Ui";
const EMPTY_ROOMS: Room[] = [];
export function ExploreScreen({ navigation }: ExploreProps) {
  const query = useRooms();
  const seed = useSeedRooms();
  const data = query.data ?? EMPTY_ROOMS;
  const filters = useFilters((s) => s.filters);
  const setSearch = useFilters((s) => s.setSearch);
  const clear = useFilters((s) => s.clear);
  const [open, setOpen] = useState(false);
  const rooms = useMemo(() => filterRooms(data, filters), [data, filters]);
  const count = filterCount(filters);
  const needsSamples =
    !query.isPending &&
    !query.isError &&
    moreRooms.some((r) => !data.some((d) => d.id === r.id));
  const onOpen = useCallback(
    (roomId: string) => navigation.navigate("RoomDetail", { roomId }),
    [navigation],
  );
  const renderItem = useCallback(
    ({ item, index }: { item: Room; index: number }) => (
      <RoomCard room={item} index={index} onOpen={onOpen} />
    ),
    [onOpen],
  );
  const seedData = () =>
    seed.mutate(undefined, {
      onError: (e) => Alert.alert("Không thể tạo phòng", errorMessage(e)),
    });
  return (
    <SafeAreaView edges={["top"]} style={u.page}>
      <Animated.View entering={enter} style={s.header}>
        <View style={u.between}>
          <View>
            <Text style={u.eyebrow}>CAMPUS SPACE</Text>
            <Text style={u.title}>Học tốt hơn,{"\n"}cùng một không gian.</Text>
          </View>
        </View>
        <Text style={[u.muted, { marginTop: 9 }]}>
          Tìm nơi dành cho ý tưởng tiếp theo của bạn.
        </Text>
      </Animated.View>
      <View style={s.search}>
        <Ionicons name="search" size={21} color={C.muted} />
        <TextInput
          value={filters.search}
          onChangeText={setSearch}
          placeholder="Tên phòng, tòa nhà, tiện ích..."
          placeholderTextColor={C.muted}
          style={s.input}
          autoCorrect={false}
          accessibilityLabel="Tìm phòng"
        />
        {filters.search.length > 0 && (
          <MotionPress
            onPress={() => setSearch("")}
            accessibilityLabel="Xóa từ khóa"
          >
            <Ionicons name="close-circle" size={20} color={C.muted} />
          </MotionPress>
        )}
      </View>
      <View style={s.toolbar}>
        <MotionPress onPress={() => setOpen(true)} style={s.filter}>
          <Ionicons name="options-outline" size={20} color={C.blue} />
          <Text style={s.filterText}>Bộ lọc{count ? ` · ${count}` : ""}</Text>
        </MotionPress>
        <Text style={u.muted}>{rooms.length} không gian</Text>
        {(count > 0 || filters.search.length > 0) && (
          <MotionPress onPress={clear} style={s.clear}>
            <Text style={s.filterText}>Xóa lọc</Text>
          </MotionPress>
        )}
      </View>
      <Animated.FlatList
        data={rooms}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        itemLayoutAnimation={layout}
        contentContainerStyle={s.list}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={7}
        removeClippedSubviews={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        refreshing={query.isRefetching}
        onRefresh={() => void query.refetch()}
        ListHeaderComponent={
          needsSamples && data.length > 0 ? (
            <MotionPress
              disabled={seed.isPending}
              onPress={seedData}
              style={s.seed}
            >
              <Ionicons name="add-circle-outline" size={20} color={C.blue} />
              <Text style={s.seedText}>
                {seed.isPending
                  ? "Đang tạo phòng..."
                  : "Bổ sung bộ 15 phòng mẫu"}
              </Text>
            </MotionPress>
          ) : null
        }
        ListEmptyComponent={
          query.isPending ? (
            <LoadingCards />
          ) : query.isError ? (
            <StateView
              icon="cloud-offline-outline"
              title="Chưa tải được phòng"
              detail={errorMessage(query.error)}
              action="Thử lại"
              onAction={() => void query.refetch()}
            />
          ) : !data.length ? (
            <StateView
              icon="library-outline"
              title="Bắt đầu với 15 phòng mẫu"
              detail="Tạo dữ liệu một lần để khám phá phòng học, lab, studio và phòng họp."
              action={seed.isPending ? "Đang tạo..." : "Tạo phòng mẫu"}
              onAction={() => {
                if (!seed.isPending) seedData();
              }}
            />
          ) : (
            <StateView
              title="Chưa có phòng phù hợp"
              detail="Thử bỏ bớt một tiêu chí hoặc đổi từ khóa."
              action="Xóa bộ lọc"
              onAction={clear}
            />
          )
        }
      />
      {open && (
        <FilterSheet open={open} close={() => setOpen(false)} rooms={data} />
      )}
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  header: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 18 },
  brand: {
    width: 54,
    height: 54,
    borderRadius: 19,
    backgroundColor: "#E6EDF9",
    alignItems: "center",
    justifyContent: "center",
  },
  search: {
    marginHorizontal: 22,
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
    borderRadius: 17,
    paddingHorizontal: 16,
  },
  input: { flex: 1, fontSize: 14, color: C.navy, paddingVertical: 14 },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 22,
    paddingVertical: 15,
    gap: 13,
  },
  filter: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    backgroundColor: C.light,
    paddingHorizontal: 14,
    minHeight: 44,
    borderRadius: 12,
  },
  filterText: { color: C.blue, fontSize: 13, fontWeight: "800" },
  clear: { marginLeft: "auto", paddingVertical: 10 },
  list: { paddingHorizontal: 22, paddingBottom: 24 },
  seed: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 13,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: C.light,
  },
  seedText: { color: C.blue, fontSize: 13, flexShrink: 1 },
});
