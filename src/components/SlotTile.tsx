import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { MotionPress } from "./MotionPress";
import { clock } from "../dates";
import { C } from "../theme";
export function SlotTile({
  slot,
  selected,
  unavailable,
  disabled,
  onPress,
}: {
  slot: number;
  selected: boolean;
  unavailable: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <MotionPress
      onPress={onPress}
      disabled={disabled || unavailable}
      accessibilityLabel={`${clock(slot)}, ${unavailable ? "không khả dụng" : selected ? "đang chọn" : "còn trống"}`}
      accessibilityState={{ disabled: disabled || unavailable, selected }}
      style={[s.tile, unavailable && s.unavailable]}
    >
      {selected && (
        <Animated.View
          entering={FadeIn.duration(160)}
          exiting={FadeOut.duration(120)}
          style={[StyleSheet.absoluteFill, s.fill]}
        />
      )}
      <Text
        allowFontScaling={false}
        style={[
          s.time,
          unavailable && s.muted,
          selected && !unavailable && s.white,
        ]}
      >
        {clock(slot)}
      </Text>
      <View style={s.meta}>
        {unavailable ? (
          <Ionicons name="lock-closed-outline" size={10} color={C.muted} />
        ) : (
          <Text style={[s.small, selected && s.white]}>
            {selected ? "Đã chọn" : "30 phút"}
          </Text>
        )}
      </View>
    </MotionPress>
  );
}
const s = StyleSheet.create({
  tile: {
    width: "23%",
    flexGrow: 1,
    minWidth: 64,
    overflow: "hidden",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 67,
    paddingVertical: 10,
    gap: 4,
  },
  fill: { backgroundColor: C.blue },
  time: { fontSize: 14, color: C.navy, fontWeight: "800" },
  small: { fontSize: 9, color: C.muted },
  meta: { height: 13 },
  unavailable: { backgroundColor: "#E8EDF3" },
  muted: { color: "#8A99AC" },
  white: { color: C.white },
});
