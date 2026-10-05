export type TimeRange = { start: number; end: number };
export type Selection = {
  range: TimeRange | null;
  choosingEnd: boolean;
  message: string;
};
export function slotNumbers(start: number, end: number): number[] {
  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start < 16 ||
    end > 40 ||
    end <= start ||
    end - start > 8
  ) {
    throw new Error("Chọn từ 30 phút đến 4 giờ, trong khoảng 08:00–20:00.");
  }
  return Array.from({ length: end - start }, (_, index) => start + index);
}
export function isRangeFree(
  range: TimeRange,
  taken: readonly number[],
): boolean {
  try {
    return slotNumbers(range.start, range.end).every(
      (slot) => !taken.includes(slot),
    );
  } catch {
    return false;
  }
}
export function pickSlot(
  state: Selection,
  slot: number,
  taken: readonly number[],
  past: boolean,
): Selection {
  if (past || taken.includes(slot) || slot < 16 || slot > 39)
    return { ...state, message: "Ô giờ này không còn trống." };
  if (!state.range || !state.choosingEnd || slot < state.range.start) {
    return {
      range: { start: slot, end: slot + 1 },
      choosingEnd: true,
      message: "",
    };
  }
  const range = { start: state.range.start, end: slot + 1 };
  if (range.end - range.start > 8)
    return { ...state, message: "Mỗi lượt đặt tối đa 4 giờ." };
  if (!isRangeFree(range, taken))
    return { ...state, message: "Khoảng bạn chọn đi qua một ô đã được đặt." };
  return { range, choosingEnd: false, message: "" };
}
