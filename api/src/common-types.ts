// QuietPay common types - Apache-2.0
import { type MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import { type FoundContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { QuietPayPrivateState, Contract, Witnesses } from '../../contracts/src/index';
export const quietpayPrivateStateKey = 'quietpayPrivateState';
export type PrivateStateId = typeof quietpayPrivateStateKey;
export type PrivateStates = {
  readonly quietpayPrivateState: QuietPayPrivateState;
};
export type QuietPayContract = Contract<QuietPayPrivateState, Witnesses<QuietPayPrivateState>>;
export type QuietPayCircuitKeys = Exclude<keyof QuietPayContract['impureCircuits'], number | symbol>;
export type QuietPayProviders = MidnightProviders<QuietPayCircuitKeys, PrivateStateId, QuietPayPrivateState>;
export type DeployedQuietPayContract = FoundContract<QuietPayContract>;
export type QuietPayDerivedState = {
  readonly totalFunded: bigint;
  readonly totalClaimed: bigint;
  readonly payrollRoot: Uint8Array;
  readonly isFinalized: boolean;
  readonly isAdmin: boolean;
};
