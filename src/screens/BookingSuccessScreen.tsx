import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";
import type { SuccessProps } from "../navigation/types";
import { Celebration } from "../components/Celebration";
import { Button, enter, u } from "../components/Ui";
import { clock } from "../dates";
export function BookingSuccessScreen({ route, navigation }: SuccessProps) {
  const booking = route.params;
  const go = (screen: "Explore" | "Bookings") =>
    navigation.reset({
      index: 0,
      routes: [{ name: "Tabs", params: { screen } }],
    });
  return (
    <SafeAreaView style={u.page}>
      <ScrollView
        contentContainerStyle={[
          u.content,
          { flexGrow: 1, justifyContent: "center" },
        ]}
      >
        <Celebration />
        <Animated.View
          entering={enter.delay(150)}
          style={{ gap: 12, alignItems: "center" }}
        >
          <Text style={u.eyebrow}>SẴN SÀNG CHO BUỔI HỌC</Text>
          <Text style={u.title}>Đã giữ chỗ cho bạn!</Text>
          <Text style={u.centerText}>
            Lịch đặt đã được xác nhận. Hẹn bạn đúng giờ.
          </Text>
        </Animated.View>
        <Animated.View entering={enter.delay(260)} style={u.card}>
          <Text style={u.section}>{booking.roomName}</Text>
          <Text style={u.muted}>
            {booking.date} · {clock(booking.start)}–{clock(booking.end)}
          </Text>
          <Text selectable style={u.muted}>
            Mã đặt: {booking.bookingId.slice(0, 10).toUpperCase()}
          </Text>
        </Animated.View>
        <View style={{ gap: 10 }}>
          <Button title="Xem lịch của tôi" onPress={() => go("Bookings")} />
          <Button
            title="Khám phá thêm phòng"
            secondary
            onPress={() => go("Explore")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
