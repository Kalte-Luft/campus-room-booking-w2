import { useRef } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
} from "react-native-reanimated";
import type { RoomDetailProps } from "../navigation/types";
import { useRooms, useAvailability } from "../hooks/useRoomQueries";
import { useCreateBooking } from "../hooks/useBookings";
import { useSlotSelection } from "../hooks/useSlotSelection";
import { useFilters } from "../store";
import { allSlots, clock, days, isPast } from "../dates";
import { C } from "../theme";
import { roomIcon } from "../utils/roomIcon";
import { errorMessage } from "../utils/errors";
import { Button, Chip, StateView, enter, layout, u } from "../components/Ui";
import { SlotTile } from "../components/SlotTile";
import { MotionPress } from "../components/MotionPress";
const EMPTY_SLOTS: number[] = [];
export function RoomDetailScreen({ route, navigation }: RoomDetailProps) {
  const rooms = useRooms();
  const room = rooms.data?.find((r) => r.id === route.params.roomId);
  const date = useFilters((s) => s.date);
  const setDate = useFilters((s) => s.setDate);
  const availability = useAvailability(route.params.roomId, date);
  const taken = availability.data ?? EMPTY_SLOTS;
  const selection = useSlotSelection(date, taken);
  const mutation = useCreateBooking();
  const submitting = useRef(false);
  const scroll = useSharedValue(0);
  const reduced = useReducedMotion();
  const onScroll = useAnimatedScrollHandler((event) => {
    scroll.value = event.contentOffset.y;
  });
  const heroMotion = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: reduced
          ? 0
          : interpolate(scroll.value, [0, 210], [0, 35], Extrapolation.CLAMP),
      },
      {
        scale: reduced
          ? 1
          : interpolate(
              scroll.value,
              [-100, 0, 210],
              [1.14, 1, 0.92],
              Extrapolation.CLAMP,
            ),
      },
    ],
  }));
  const book = async () => {
    if (!room || !selection.range || !selection.valid || submitting.current)
      return;
    const range = selection.range;
    submitting.current = true;
    try {
      const bookingId = await mutation.mutateAsync({ room, date, range });
      navigation.replace("BookingSuccess", {
        bookingId,
        roomName: room.name,
        date,
        ...range,
      });
    } catch (error) {
      Alert.alert("Chưa đặt được phòng", errorMessage(error));
    } finally {
      submitting.current = false;
    }
  };
  if (rooms.isPending)
    return (
      <View style={[u.page, s.loading]}>
        <ActivityIndicator color={C.blue} />
      </View>
    );
  if (!room)
    return (
      <View style={u.page}>
        <StateView
          title="Không tìm thấy phòng"
          detail={
            rooms.isError
              ? errorMessage(rooms.error)
              : "Phòng này có thể đã bị xóa."
          }
          action="Tải lại"
          onAction={() => void rooms.refetch()}
        />
      </View>
    );
  return (
    <SafeAreaView edges={["bottom"]} style={u.page}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={s.content}
      >
        <View style={[s.hero, { backgroundColor: room.color }]}>
          <Animated.View style={[s.heroContent, heroMotion]}>
            <View style={s.ring} />
            <Ionicons name={roomIcon(room.kind)} size={78} color={C.navy} />
            <Text style={s.heroLabel}>{room.kind.toUpperCase()}</Text>
          </Animated.View>
        </View>
        <Animated.View entering={enter} style={{ gap: 9 }}>
          <Text style={u.title}>{room.name}</Text>
          <Text style={u.muted}>
            {room.building} · Tầng {room.floor} · {room.capacity} chỗ
          </Text>
          <Text style={u.muted}>{room.description}</Text>
        </Animated.View>
        <View style={u.wrap}>
          {room.amenities.map((item) => (
            <View key={item} style={s.amenity}>
              <Ionicons name="checkmark-circle" color={C.green} size={15} />
              <Text style={s.amenityText}>{item}</Text>
            </View>
          ))}
        </View>
        <View style={{ gap: 12 }}>
          <Text style={u.section}>01 / Chọn ngày</Text>
          <View style={u.wrap}>
            {days().map((d) => (
              <Chip
                key={d.key}
                label={`${d.label} · ${d.number}`}
                active={d.key === date}
                disabled={mutation.isPending}
                onPress={() => setDate(d.key)}
              />
            ))}
          </View>
        </View>
        <View style={{ gap: 12 }}>
          <View style={u.between}>
            <Text style={u.section}>02 / Chọn giờ</Text>
            <MotionPress
              onPress={() => void availability.refetch()}
              accessibilityLabel="Tải lại lịch trống"
            >
              <Ionicons name="refresh" size={21} color={C.blue} />
            </MotionPress>
          </View>
          <Text style={u.muted}>
            Chạm ô đầu, rồi ô cuối. Một ô là 30 phút; tối đa 4 giờ mỗi lượt.
          </Text>
          {availability.isPending ? (
            <ActivityIndicator color={C.blue} />
          ) : availability.isError ? (
            <Text style={u.error}>{errorMessage(availability.error)}</Text>
          ) : null}
          <View style={s.grid}>
            {allSlots.map((slot) => (
              <SlotTile
                key={slot}
                slot={slot}
                selected={
                  !!selection.range &&
                  slot >= selection.range.start &&
                  slot < selection.range.end
                }
                unavailable={taken.includes(slot) || isPast(date, slot)}
                disabled={
                  availability.isPending ||
                  availability.isError ||
                  mutation.isPending
                }
                onPress={() => selection.select(slot)}
              />
            ))}
          </View>
          <Text style={s.legend}>
            Xanh: đang chọn · Trắng: còn trống · Xám: không khả dụng
          </Text>
          {selection.message ? (
            <Text accessibilityLiveRegion="polite" style={u.error}>
              {selection.message}
            </Text>
          ) : null}
          {selection.range && !selection.valid && (
            <Text style={u.error}>
              Khung giờ đã thay đổi hoặc vừa qua. Hãy chọn lại.
            </Text>
          )}
        </View>
      </Animated.ScrollView>
      <Animated.View layout={layout} style={s.bottom}>
        <View style={u.between}>
          <Text style={s.summary}>
            {selection.range
              ? `${clock(selection.range.start)} – ${clock(selection.range.end)}`
              : "Chưa chọn khung giờ"}
          </Text>
          <Text style={u.muted}>
            {selection.range
              ? `${(selection.range.end - selection.range.start) / 2} giờ`
              : "08:00 – 20:00"}
          </Text>
        </View>
        <Button
          title="Xác nhận đặt phòng"
          onPress={() => void book()}
          loading={mutation.isPending}
          disabled={
            !selection.valid || availability.isPending || availability.isError
          }
        />
      </Animated.View>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  loading: { justifyContent: "center", alignItems: "center" },
  content: { padding: 22, gap: 24, paddingBottom: 32 },
  hero: { height: 195, borderRadius: 26, overflow: "hidden" },
  heroContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 13,
  },
  ring: {
    position: "absolute",
    width: 235,
    height: 235,
    borderRadius: 120,
    borderColor: "#FFFFFFAA",
    borderWidth: 1,
  },
  heroLabel: {
    fontWeight: "800",
    fontSize: 11,
    color: C.navy,
    letterSpacing: 2,
  },
  amenity: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    backgroundColor: C.white,
    padding: 9,
    borderRadius: 10,
  },
  amenityText: { color: C.navy, fontSize: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  legend: { color: C.muted, fontSize: 11, lineHeight: 18 },
  bottom: {
    borderTopWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
    padding: 18,
    gap: 12,
  },
  summary: { color: C.navy, fontSize: 16, fontWeight: "800" },
});
