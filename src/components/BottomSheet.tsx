import type { ReactNode } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { C } from "../theme";
import { u } from "./Ui";
export function BottomSheet({
  visible,
  onClose,
  title,
  children,
  footer,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer: (dismiss: () => void) => ReactNode;
}) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const y = useSharedValue(height);
  const dismiss = () => {
    y.set(
      withTiming(height, { duration: 230 }, (finished) => {
        if (finished) runOnJS(onClose)();
      }),
    );
  };
  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(y.value, [0, height], [1, 0], "clamp"),
  }));
  // Only the handle owns the pan; the form ScrollView keeps its native scrolling.
  const pan = Gesture.Pan()
    .onUpdate((event) => {
      y.set(Math.max(0, event.translationY));
    })
    .onEnd((event) => {
      if (event.translationY > 110 || event.velocityY > 800) runOnJS(dismiss)();
      else y.set(withSpring(0, { damping: 24, stiffness: 250 }));
    });
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onShow={() => y.set(withSpring(0, { damping: 28, stiffness: 240 }))}
      onRequestClose={dismiss}
      statusBarTranslucent
    >
      <GestureHandlerRootView style={styles.root}>
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.shade, backdropStyle]}
        >
          <Pressable
            accessibilityLabel="Đóng bộ lọc"
            onPress={dismiss}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.panel,
            {
              height: height - insets.top - 34,
              paddingBottom: Math.max(insets.bottom, 14),
            },
            panelStyle,
          ]}
        >
          <GestureDetector gesture={pan}>
            <Animated.View style={styles.handleArea}>
              <View style={styles.handle} />
            </Animated.View>
          </GestureDetector>
          <View style={styles.heading}>
            <Text style={u.title}>{title}</Text>
            <Pressable onPress={dismiss} accessibilityLabel="Đóng" hitSlop={12}>
              <Ionicons name="close-circle" color={C.muted} size={30} />
            </Pressable>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}
          >
            {children}
          </ScrollView>
          <View style={styles.footer}>{footer(dismiss)}</View>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  shade: { backgroundColor: "#10213E99" },
  panel: {
    backgroundColor: C.bg,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  handleArea: { alignItems: "center", paddingTop: 13, paddingBottom: 18 },
  handle: { width: 44, height: 5, borderRadius: 3, backgroundColor: "#CBD5E1" },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  content: { paddingHorizontal: 24, paddingBottom: 30, gap: 25 },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 14,
    borderTopWidth: 1,
    borderColor: C.border,
  },
});
