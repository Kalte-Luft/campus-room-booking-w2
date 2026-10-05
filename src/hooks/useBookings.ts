import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelBooking, createBooking, getMyBookings } from "../data";
import type { Booking, Room } from "../types";
import type { TimeRange } from "../utils/booking";
import { useUserId } from "./useSession";
export function useBookings() {
  const uid = useUserId();
  const result = useQuery({
    queryKey: ["bookings", uid],
    queryFn: () => getMyBookings(uid),
    refetchInterval: 15_000,
  });
  const { refetch } = result;
  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );
  return result;
}
export function useCreateBooking() {
  const uid = useUserId();
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      room,
      date,
      range,
    }: {
      room: Room;
      date: string;
      range: TimeRange;
    }) => createBooking(room, date, range.start, range.end, uid),
    onSettled: (_data, _error, variables) => {
      void client.invalidateQueries({
        queryKey: ["taken", variables.room.id, variables.date],
      });
      void client.invalidateQueries({ queryKey: ["bookings", uid] });
    },
  });
}
export function useCancelBooking() {
  const uid = useUserId();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (booking: Booking) => cancelBooking(booking, uid),
    onSuccess: (_, booking) => {
      void client.invalidateQueries({ queryKey: ["bookings", uid] });
      void client.invalidateQueries({
        queryKey: ["taken", booking.roomId, booking.date],
      });
    },
  });
}
