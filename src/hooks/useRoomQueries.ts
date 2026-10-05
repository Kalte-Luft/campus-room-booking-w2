import { useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { getRooms, getTaken, seedMoreRooms, seedRooms } from "../data";
export function useRooms() {
  const result = useQuery({ queryKey: ["rooms"], queryFn: getRooms });
  const { refetch } = result;
  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );
  return result;
}
export function useAvailability(roomId: string, date: string) {
  const client = useQueryClient();
  const result = useQuery({
    queryKey: ["taken", roomId, date],
    queryFn: () => getTaken(roomId, date),
    refetchInterval: 15_000,
  });
  // Snapshot updates go straight into Query's cache, not Zustand or duplicated component state.
  useEffect(
    () =>
      onSnapshot(
        collection(db, "slots", `${roomId}_${date}`, "items"),
        (snapshot) => {
          client.setQueryData(
            ["taken", roomId, date],
            snapshot.docs.map((item) => Number(item.id)),
          );
        },
        () => {
          void client.invalidateQueries({ queryKey: ["taken", roomId, date] });
        },
      ),
    [client, roomId, date],
  );
  const { refetch } = result;
  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );
  return result;
}
export function useSeedRooms() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await seedRooms();
      await seedMoreRooms();
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["rooms"] }),
  });
}
