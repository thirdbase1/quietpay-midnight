// QuietPay contract tests - Apache-2.0
import { QuietPaySimulator } from "./quietpay-simulator.js";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { describe, it, expect } from "vitest";
import { randomBytes } from "./utils.js";
import { type QuietPayPrivateState } from "../witnesses.js";
setNetworkId("undeployed");
const makeState = (adminSecret: Uint8Array, employeeSecret: Uint8Array, claimAmount: bigint): QuietPayPrivateState => ({
  adminSecret,
  employeeSecret,
  claimAmount,
});
const fundedRound = (admin: Uint8Array, amount: bigint, root: Uint8Array): QuietPaySimulator => {
  const sim = new QuietPaySimulator(makeState(admin, randomBytes(32), 0n));
  sim.fund(amount);
  sim.postRoot(root);
  return sim;
};
describe("QuietPay smart contract", () => {
  it("generates initial ledger state deterministically", () => {
    const secret = randomBytes(32);
    const sim0 = new QuietPaySimulator(makeState(secret, randomBytes(32), 0n));
    const sim1 = new QuietPaySimulator(makeState(secret, randomBytes(32), 0n));
    expect(sim0.getLedger()).toEqual(sim1.getLedger());
  });
  it("starts unfunded and unfinalized", () => {
    const sim = new QuietPaySimulator(makeState(randomBytes(32), randomBytes(32), 0n));
    const ledger = sim.getLedger();
    expect(ledger._totalFunded).toEqual(0n);
    expect(ledger._totalClaimed).toEqual(0n);
    expect(ledger._isFinalized).toEqual(false);
  });
  it("rejects claims before the round is finalized", () => {
    const admin = randomBytes(32);
    const sim = new QuietPaySimulator(makeState(admin, randomBytes(32), 100n));
    sim.fund(1000n);
    expect(() => sim.claim()).toThrow();
  });
  it("lets an employee claim once and records the nullifier", () => {
    const admin = randomBytes(32);
    const employee = randomBytes(32);
    const sim = fundedRound(admin, 10000n, randomBytes(32));
    sim.switchPrivateState(makeState(admin, employee, 2500n));
    sim.claim();
    const ledger = sim.getLedger();
    expect(ledger._totalClaimed).toEqual(2500n);
    expect(sim.getLedger()._isFinalized).toEqual(true);
  });
  it("rejects a double claim with the same nullifier", () => {
    const admin = randomBytes(32);
    const employee = randomBytes(32);
    const sim = fundedRound(admin, 10000n, randomBytes(32));
    sim.switchPrivateState(makeState(admin, employee, 2500n));
    sim.claim();
    expect(() => sim.claim()).toThrow();
  });
  it("rejects claims that exceed the funded total", () => {
    const admin = randomBytes(32);
    const sim = fundedRound(admin, 1000n, randomBytes(32));
    sim.switchPrivateState(makeState(admin, randomBytes(32), 5000n));
    expect(() => sim.claim()).toThrow();
    expect(sim.getLedger()._totalClaimed).toEqual(0n);
  });
  it("proves income above a threshold without revealing the amount", () => {
    const admin = randomBytes(32);
    const sim = fundedRound(admin, 10000n, randomBytes(32));
    sim.switchPrivateState(makeState(admin, randomBytes(32), 5000n));
    expect(sim.proveIncomeAbove(3000n)).toEqual(true);
    expect(() => sim.proveIncomeAbove(9000n)).toThrow();
  });
  it("rejects admin actions from non-admin callers", () => {
    const sim = new QuietPaySimulator(makeState(randomBytes(32), randomBytes(32), 0n));
    sim.switchPrivateState(makeState(randomBytes(32), randomBytes(32), 0n));
    expect(() => sim.fund(100n)).toThrow();
    expect(() => sim.postRoot(randomBytes(32))).toThrow();
  });
  it("opens a fresh round with nextRound", () => {
    const admin = randomBytes(32);
    const sim = fundedRound(admin, 10000n, randomBytes(32));
    sim.switchPrivateState(makeState(admin, randomBytes(32), 0n));
    sim.nextRound();
    expect(sim.getLedger()._isFinalized).toEqual(false);
  });
});
