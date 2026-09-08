// QuietPay witnesses - Apache-2.0
import { WitnessContext } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import type { Ledger } from "./managed/quietpay/contract/index.js";
export type QuietPayPrivateState = { adminSecret: Uint8Array; employeeSecret: Uint8Array; claimAmount: bigint };
export const createQPState = (a: Uint8Array, e: Uint8Array, c: bigint) => ({ adminSecret: a, employeeSecret: e, claimAmount: c });
export const witnesses = {
getAdminSecret: (ctx: any) => [ctx.privateState, { bytes: ctx.privateState.adminSecret }],
getEmployeeSecret: (ctx: any) => [ctx.privateState, { bytes: ctx.privateState.employeeSecret }],
getClaimAmount: (ctx: any) => [ctx.privateState, { amount: ctx.privateState.claimAmount }],
};
