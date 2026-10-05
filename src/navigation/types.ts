import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
export type TabParamList = { Explore: undefined; Bookings: undefined };
export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  RoomDetail: { roomId: string };
  BookingSuccess: {
    bookingId: string;
    roomName: string;
    date: string;
    start: number;
    end: number;
  };
};
export type ExploreProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Explore">,
  NativeStackScreenProps<RootStackParamList>
>;
export type RoomDetailProps = NativeStackScreenProps<
  RootStackParamList,
  "RoomDetail"
>;
export type SuccessProps = NativeStackScreenProps<
  RootStackParamList,
  "BookingSuccess"
>;
