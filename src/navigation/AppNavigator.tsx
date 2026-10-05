import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { C } from "../theme";
import type { RootStackParamList, TabParamList } from "./types";
import { ExploreScreen } from "../screens/ExploreScreen";
import { BookingsScreen } from "../screens/BookingsScreen";
import { RoomDetailScreen } from "../screens/RoomDetailScreen";
import { BookingSuccessScreen } from "../screens/BookingSuccessScreen";
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabParamList>();
function TabIcon({
  name,
  focused,
  color,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  color: string;
}) {
  const scale = useSharedValue(focused ? 1 : 0.9);
  useEffect(() => {
    scale.value = withSpring(focused ? 1.12 : 0.9, { damping: 12 });
  }, [focused, scale]);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Animated.View style={style}>
      <Ionicons name={name} color={color} size={23} />
    </Animated.View>
  );
}
function TabNavigator() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: C.blue,
        tabBarInactiveTintColor: C.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
        tabBarItemStyle: { paddingVertical: 5 },
        tabBarStyle: { backgroundColor: C.white, borderTopColor: C.border },
        tabBarIcon: ({ focused, color }) => (
          <TabIcon
            name={
              route.name === "Explore" ? "search-outline" : "calendar-outline"
            }
            focused={focused}
            color={color}
          />
        ),
      })}
    >
      <Tabs.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ title: "Tìm phòng" }}
      />
      <Tabs.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{ title: "Lịch của tôi" }}
      />
    </Tabs.Navigator>
  );
}
export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: C.navy,
          headerStyle: { backgroundColor: C.bg },
          headerShadowVisible: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RoomDetail"
          component={RoomDetailScreen}
          options={{ title: "Chi tiết không gian" }}
        />
        <Stack.Screen
          name="BookingSuccess"
          component={BookingSuccessScreen}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animation: "fade_from_bottom",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
