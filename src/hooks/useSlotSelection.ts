import { useEffect, useState } from "react";
import { isPast } from "../dates";
import { isRangeFree, pickSlot, type Selection } from "../utils/booking";
export function useSlotSelection(date: string, taken: readonly number[]) {
  const [stored, setState] = useState<Selection & { date: string }>({
    date,
    range: null,
    choosingEnd: false,
    message: "",
  });
  const state: Selection =
    stored.date === date
      ? stored
      : { range: null, choosingEnd: false, message: "" };
  // Refresh time while the picker is open, including across an hour boundary.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((v) => v + 1), 15_000);
    return () => clearInterval(id);
  }, []);
  const valid =
    state.range !== null &&
    !isPast(date, state.range.start) &&
    isRangeFree(state.range, taken);
  return {
    ...state,
    valid,
    select: (slot: number) =>
      setState({ ...pickSlot(state, slot, taken, isPast(date, slot)), date }),
  };
}
