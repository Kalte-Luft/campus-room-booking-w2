import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import Animated, {
  FadeInDown,
  FadeOut,
  LinearTransition,
  ReduceMotion,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { C } from "../theme";
import { MotionPress } from "./MotionPress";
export const enter = FadeInDown.duration(320).reduceMotion(ReduceMotion.System);
export const exit = FadeOut.duration(160).reduceMotion(ReduceMotion.System);
export const layout = LinearTransition.duration(240).reduceMotion(
  ReduceMotion.System,
);
export function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  secondary = false,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  secondary?: boolean;
}) {
  return (
    <MotionPress
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        u.button,
        secondary && u.secondary,
        (disabled || loading) && u.disabled,
      ]}
    >
      {loading && <ActivityIndicator color={secondary ? C.blue : C.white} />}
      <Text style={[u.buttonText, secondary && { color: C.blue }]}>
        {title}
      </Text>
    </MotionPress>
  );
}
export function Chip({
  label,
  active,
  onPress,
  disabled = false,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  const progress = useSharedValue(active ? 1 : 0);
  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 180 });
  }, [active, progress]);
  const style = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [C.white, C.blue],
    ),
    borderColor: interpolateColor(progress.value, [0, 1], [C.border, C.blue]),
  }));
  return (
    <Animated.View style={[u.chip, style]}>
      <MotionPress
        disabled={disabled}
        accessibilityState={{ selected: active, disabled }}
        style={u.chipTouch}
        onPress={onPress}
      >
        <Text
          allowFontScaling={false}
          style={[u.chipText, active && { color: C.white }]}
        >
          {label}
        </Text>
      </MotionPress>
    </Animated.View>
  );
}
export function StateView({
  title,
  detail,
  icon = "search-outline",
  action,
  onAction,
}: {
  title: string;
  detail: string;
  icon?: keyof typeof Ionicons.glyphMap;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <Animated.View entering={enter} style={u.state}>
      <View style={u.stateIcon}>
        <Ionicons name={icon} size={34} color={C.blue} />
      </View>
      <Text style={u.section}>{title}</Text>
      <Text style={u.centerText}>{detail}</Text>
      {action && onAction && (
        <Button title={action} onPress={onAction} secondary />
      )}
    </Animated.View>
  );
}
export const u = StyleSheet.create({
  page: { flex: 1, backgroundColor: C.bg },
  content: { padding: 22, gap: 20 },
  eyebrow: {
    color: C.blue,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: { color: C.navy, fontSize: 29, lineHeight: 36, fontWeight: "800" },
  section: { color: C.navy, fontSize: 18, fontWeight: "800" },
  muted: { color: C.muted, fontSize: 14, lineHeight: 21 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  between: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  button: {
    minHeight: 52,
    backgroundColor: C.blue,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: C.white,
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },
  secondary: { backgroundColor: C.light },
  disabled: { opacity: 0.45 },
  chip: { borderWidth: 1, borderRadius: 12, alignSelf: "flex-start" },
  chipTouch: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  chipText: {
    color: C.navy,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
    includeFontPadding: false,
  },
  card: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 22,
    backgroundColor: C.white,
    padding: 20,
    gap: 12,
  },
  state: {
    paddingVertical: 44,
    paddingHorizontal: 26,
    gap: 15,
    alignItems: "center",
  },
  stateIcon: {
    width: 76,
    height: 76,
    backgroundColor: C.light,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  centerText: {
    color: C.muted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
  error: { color: C.red, fontSize: 13, lineHeight: 20 },
});
