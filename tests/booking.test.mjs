import test from "node:test";
import assert from "node:assert/strict";
import { isRangeFree, pickSlot, slotNumbers } from "../src/utils/booking.ts";
const empty = () => ({ range: null, choosingEnd: false, message: "" });
test("a single tap permits exactly 30 minutes, including the last slot of the day", () => {
  const result = pickSlot(empty(), 39, [], false);
  assert.deepEqual(result.range, { start: 39, end: 40 });
  assert.deepEqual(slotNumbers(39, 40), [39]);
});
test("end slot is inclusive in the UI, exclusive in storage", () => {
  const first = pickSlot(empty(), 16, [], false);
  const result = pickSlot(first, 17, [], false);
  assert.deepEqual(result.range, { start: 16, end: 18 });
  assert.deepEqual(slotNumbers(16, 18), [16, 17]);
});
test("cannot select a range crossing an occupied middle slot", () => {
  const first = pickSlot(empty(), 16, [17], false);
  const result = pickSlot(first, 18, [17], false);
  assert.ok(result.message);
  assert.deepEqual(result.range, first.range);
});
test("exactly four hours is accepted; longer, fractional and out-of-hours ranges fail", () => {
  assert.equal(slotNumbers(16, 24).length, 8);
  for (const [a, b] of [
    [16, 25],
    [15, 17],
    [39, 41],
    [18, 18],
    [16.5, 18],
    [16, 18.5],
  ]) {
    assert.throws(() => slotNumbers(a, b));
  }
});
test("past and occupied starts are rejected", () => {
  assert.equal(pickSlot(empty(), 16, [], true).range, null);
  assert.equal(pickSlot(empty(), 16, [16], false).range, null);
});
test("adjacent bookings do not overlap; partial overlap is blocked", () => {
  assert.equal(isRangeFree({ start: 18, end: 20 }, [16, 17]), true);
  assert.equal(isRangeFree({ start: 17, end: 20 }, [16, 17]), false);
});
test("a new server lock invalidates a previously free selection", () => {
  const range = { start: 20, end: 22 };
  assert.equal(isRangeFree(range, []), true);
  assert.equal(isRangeFree(range, [21]), false);
});
test("tapping an earlier slot restarts the selection", () => {
  const first = pickSlot(empty(), 20, [], false);
  assert.deepEqual(pickSlot(first, 18, [], false).range, {
    start: 18,
    end: 19,
  });
});
