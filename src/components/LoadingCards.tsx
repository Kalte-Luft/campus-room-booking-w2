import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { C } from "../theme";
export function LoadingCards() {
  const opacity = useSharedValue(0.55);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!reduce)
      opacity.value = withRepeat(withTiming(1, { duration: 750 }), -1, true);
    return () => cancelAnimation(opacity);
  }, [opacity, reduce]);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View accessibilityLabel="Đang tải danh sách phòng" style={style}>
      {[0, 1, 2].map((id) => (
        <View key={id} style={s.card}>
          <View style={s.art} />
          <View style={s.body}>
            <View style={s.line} />
            <View style={[s.line, { width: "52%" }]} />
          </View>
        </View>
      ))}
    </Animated.View>
  );
}
const s = StyleSheet.create({
  card: {
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: C.white,
    marginBottom: 16,
  },
  art: { height: 137, backgroundColor: "#DDE5EF" },
  body: { padding: 20, gap: 12 },
  line: {
    height: 16,
    width: "75%",
    borderRadius: 8,
    backgroundColor: "#DDE5EF",
  },
});
