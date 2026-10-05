import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
type Props = Omit<PressableProps, "style"> & { style?: StyleProp<ViewStyle> };
export function MotionPress({
  style,
  onPressIn,
  onPressOut,
  disabled,
  ...props
}: Props) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <AnimatedPressable
      {...props}
      disabled={disabled}
      accessibilityRole={props.accessibilityRole ?? "button"}
      style={[style, animated]}
      onPressIn={(event) => {
        scale.set(withSpring(0.965, { damping: 18, stiffness: 300 }));
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.set(withSpring(1, { damping: 14, stiffness: 280 }));
        onPressOut?.(event);
      }}
    />
  );
}
