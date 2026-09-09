// QuietPay witnesses - Apache-2.0
import { Ledger } from "./managed/quietpay/contract/index.js";
import { WitnessContext } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
export type QuietPayPrivateState = {
  readonly adminSecret: Uint8Array;
  readonly employeeSecret: Uint8Array;
  readonly claimAmount: bigint;
};
export const createQuietPayPrivateState = (secret: Uint8Array): QuietPayPrivateState => ({
  adminSecret: secret,
  employeeSecret: secret,
  claimAmount: 0n,
});
export const witnesses = {
  getAdminSecret: ({ privateState }: WitnessContext<Ledger, QuietPayPrivateState>): [QuietPayPrivateState, { bytes: Uint8Array }] => [privateState, { bytes: privateState.adminSecret }],
  getEmployeeSecret: ({ privateState }: WitnessContext<Ledger, QuietPayPrivateState>): [QuietPayPrivateState, { bytes: Uint8Array }] => [privateState, { bytes: privateState.employeeSecret }],
  getClaimAmount: ({ privateState }: WitnessContext<Ledger, QuietPayPrivateState>): [QuietPayPrivateState, { amount: bigint }] => [privateState, { amount: privateState.claimAmount }],
};
