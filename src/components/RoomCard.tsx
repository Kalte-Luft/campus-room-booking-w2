import { memo, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import type { Room } from "../types";
import { C } from "../theme";
import { roomIcon } from "../utils/roomIcon";
import { MotionPress } from "./MotionPress";
import { enter, u } from "./Ui";
export const RoomCard = memo(function RoomCard({
  room,
  index,
  onOpen,
}: {
  room: Room;
  index: number;
  onOpen: (id: string) => void;
}) {
  const entrance = useMemo(() => enter.delay(Math.min(index, 5) * 45), [index]);
  return (
    <Animated.View entering={entrance} style={styles.outer}>
      <MotionPress
        onPress={() => onOpen(room.id)}
        accessibilityLabel={`${room.name}, ${room.capacity} chỗ. Xem lịch trống.`}
        style={styles.card}
      >
        <View style={[styles.art, { backgroundColor: room.color }]}>
          <View style={styles.orbit} />
          <View style={styles.orbitSmall} />
          <Ionicons name={roomIcon(room.kind)} size={51} color={C.navy} />
          <Text style={styles.tag}>{room.kind}</Text>
          <Text style={styles.location}>
            {room.building.toUpperCase()} /{" "}
            {String(room.floor).padStart(2, "0")}
          </Text>
        </View>
        <View style={styles.body}>
          <View style={u.between}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{room.name}</Text>
              <Text style={u.muted}>
                {room.building} · Tầng {room.floor} · {room.capacity} chỗ
              </Text>
            </View>
            <Ionicons
              name="arrow-up-right-box-outline"
              size={27}
              color={C.blue}
            />
          </View>
          <View style={u.wrap}>
            {room.amenities.slice(0, 3).map((item) => (
              <Text key={item} style={styles.amenity}>
                {item}
              </Text>
            ))}
            {room.amenities.length > 3 && (
              <Text style={styles.amenity}>+{room.amenities.length - 3}</Text>
            )}
          </View>
        </View>
      </MotionPress>
    </Animated.View>
  );
});
const styles = StyleSheet.create({
  outer: { marginBottom: 16 },
  card: {
    backgroundColor: C.white,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.border,
  },
  art: {
    height: 137,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  orbit: {
    position: "absolute",
    height: 240,
    width: 240,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: "#FFFFFFAA",
    right: -62,
    top: -104,
  },
  orbitSmall: {
    position: "absolute",
    height: 130,
    width: 130,
    borderRadius: 65,
    backgroundColor: "#FFFFFF44",
    left: -42,
    bottom: -80,
  },
  tag: {
    position: "absolute",
    right: 14,
    top: 14,
    color: C.navy,
    backgroundColor: "#FFFFFFDD",
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 9,
  },
  location: {
    position: "absolute",
    bottom: 12,
    left: 16,
    color: "#172B4D88",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  body: { padding: 18, gap: 12 },
  title: { color: C.navy, fontSize: 20, fontWeight: "800", marginBottom: 3 },
  amenity: {
    color: C.muted,
    fontSize: 11,
    backgroundColor: C.bg,
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
});
