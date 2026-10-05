import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import { useBookings, useCancelBooking } from "../hooks/useBookings";
import type { Booking } from "../types";
import { clock, isPast } from "../dates";
import { errorMessage } from "../utils/errors";
import { C } from "../theme";
import { Chip, StateView, enter, exit, layout, u } from "../components/Ui";
import { MotionPress } from "../components/MotionPress";
import { LoadingCards } from "../components/LoadingCards";
export function BookingsScreen() {
  const query = useBookings();
  const cancel = useCancelBooking();
  const [past, setPast] = useState(false);
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((v) => v + 1), 30_000);
    return () => clearInterval(id);
  }, []);
  const data = (query.data ?? [])
    .filter((b) => isPast(b.date, b.end) === past)
    .sort((a, b) => {
      const order = a.date.localeCompare(b.date) || a.start - b.start;
      return past ? -order : order;
    });
  const confirmCancel = (booking: Booking) =>
    Alert.alert(
      "Hủy lịch đặt?",
      `${booking.roomName}\n${booking.date} · ${clock(booking.start)}–${clock(booking.end)}`,
      [
        { text: "Giữ lịch", style: "cancel" },
        {
          text: "Hủy lịch",
          style: "destructive",
          onPress: () =>
            cancel.mutate(booking, {
              onError: (error) =>
                Alert.alert("Chưa hủy được lịch", errorMessage(error)),
            }),
        },
      ],
    );
  return (
    <SafeAreaView edges={["top"]} style={u.page}>
      <Animated.View entering={enter} style={s.header}>
        <Text style={u.eyebrow}>LỊCH CỦA TÔI</Text>
        <Text style={u.title}>Hẹn bạn ở campus.</Text>
        <Text style={[u.muted, { marginTop: 8 }]}>
          Mọi kế hoạch học tập, trong một nơi.
        </Text>
      </Animated.View>
      <View style={s.tabs}>
        <Chip
          label="Sắp tới / đang diễn ra"
          active={!past}
          onPress={() => setPast(false)}
        />
        <Chip label="Đã qua" active={past} onPress={() => setPast(true)} />
      </View>
      <Animated.FlatList
        data={data}
        keyExtractor={(b) => b.id}
        itemLayoutAnimation={layout}
        contentContainerStyle={s.list}
        refreshing={query.isRefetching}
        onRefresh={() => void query.refetch()}
        removeClippedSubviews={false}
        renderItem={({ item }) => (
          <Animated.View entering={enter} exiting={exit} style={s.ticket}>
            <View style={s.stripe} />
            <View style={u.between}>
              <Text style={s.room}>{item.roomName}</Text>
              <Text style={s.badge}>{past ? "Đã qua" : "Đã xác nhận"}</Text>
            </View>
            <View style={s.date}>
              <Ionicons name="calendar-outline" size={19} color={C.blue} />
              <Text style={s.dateText}>{item.date}</Text>
            </View>
            <View style={u.between}>
              <Text style={s.time}>
                {clock(item.start)} <Text style={u.muted}>→</Text>{" "}
                {clock(item.end)}
              </Text>
              <Text style={u.muted}>{(item.end - item.start) / 2} giờ</Text>
            </View>
            {!past && (
              <MotionPress
                disabled={cancel.isPending}
                onPress={() => confirmCancel(item)}
                style={s.cancel}
              >
                <Ionicons name="close-circle-outline" size={18} color={C.red} />
                <Text style={s.cancelText}>
                  {cancel.isPending && cancel.variables?.id === item.id
                    ? "Đang hủy..."
                    : "Hủy lịch đặt"}
                </Text>
              </MotionPress>
            )}
          </Animated.View>
        )}
        ListEmptyComponent={
          query.isPending ? (
            <LoadingCards />
          ) : query.isError ? (
            <StateView
              icon="cloud-offline-outline"
              title="Chưa tải được lịch"
              detail={errorMessage(query.error)}
              action="Thử lại"
              onAction={() => void query.refetch()}
            />
          ) : (
            <StateView
              icon="calendar-outline"
              title={past ? "Chưa có lịch đã qua" : "Chưa có lịch sắp tới"}
              detail="Lịch đặt thành công sẽ được lưu tại đây. Chuyển sang Tìm phòng để đặt lịch."
            />
          )
        }
      />
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  header: { padding: 22, paddingTop: 25 },
  tabs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    paddingHorizontal: 22,
    paddingBottom: 20,
  },
  list: { paddingHorizontal: 22, paddingBottom: 24 },
  ticket: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    padding: 21,
    borderRadius: 20,
    gap: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  stripe: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: C.blue,
  },
  room: { fontSize: 18, color: C.navy, fontWeight: "800", flex: 1 },
  badge: {
    color: C.green,
    backgroundColor: "#E6F6EF",
    fontWeight: "700",
    fontSize: 10,
    padding: 7,
    borderRadius: 8,
  },
  date: { flexDirection: "row", alignItems: "center", gap: 8 },
  dateText: { color: C.muted, fontSize: 14 },
  time: { color: C.navy, fontWeight: "800", fontSize: 24 },
  cancel: {
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    paddingVertical: 6,
  },
  cancelText: { color: C.red, fontSize: 13, fontWeight: "700" },
});
