import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { C } from "../theme";
export function Celebration() {
  const scale = useSharedValue(0.4);
  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 145 });
  }, [scale]);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <View style={s.stage}>
      {Array.from({ length: 12 }, (_, i) => (
        <Particle key={i} index={i} />
      ))}
      <Animated.View style={[s.outer, style]}>
        <View style={s.inner}>
          <Ionicons name="checkmark" size={60} color={C.white} />
        </View>
      </Animated.View>
    </View>
  );
}
function Particle({ index }: { index: number }) {
  const progress = useSharedValue(0);
  const angle = (index * Math.PI) / 6;
  useEffect(() => {
    progress.value = withDelay(
      100 + index * 12,
      withTiming(1, { duration: 800 }),
    );
  }, [progress, index]);
  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [
      { translateX: Math.cos(angle) * 112 * progress.value },
      { translateY: Math.sin(angle) * 112 * progress.value },
      { rotate: `${progress.value * 180}deg` },
      { scale: 1 - progress.value * 0.5 },
    ],
  }));
  return (
    <Animated.View
      style={[
        s.particle,
        { backgroundColor: index % 2 ? C.blue : C.green },
        style,
      ]}
    />
  );
}
const s = StyleSheet.create({
  stage: { height: 240, alignItems: "center", justifyContent: "center" },
  outer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#E3F3ED",
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: C.green,
    alignItems: "center",
    justifyContent: "center",
  },
  particle: { position: "absolute", width: 8, height: 13, borderRadius: 3 },
});
