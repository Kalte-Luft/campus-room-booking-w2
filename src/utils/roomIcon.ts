import type { Ionicons } from "@expo/vector-icons";
import type { Room } from "../types";
export function roomIcon(kind: Room["kind"]): keyof typeof Ionicons.glyphMap {
  const icons = {
    "Phòng học": "library-outline",
    "Phòng lab": "flask-outline",
    "Phòng họp": "people-outline",
    "Phòng tự học": "book-outline",
    Studio: "videocam-outline",
  } as const;
  return icons[kind];
}
