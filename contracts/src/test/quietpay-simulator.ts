// QuietPay simulator - Apache-2.0
import {
  type CircuitContext,
  QueryContext,
  sampleContractAddress,
  createConstructorContext,
  CostModel,
} from "@midnight-ntwrk/compact-runtime";
import {
  Contract,
  type Ledger,
  ledger,
} from "../managed/quietpay/contract/index.js";
import { type QuietPayPrivateState, witnesses } from "../witnesses.js";
export class QuietPaySimulator {
  readonly contract: Contract<QuietPayPrivateState>;
  circuitContext: CircuitContext<QuietPayPrivateState>;
  constructor(privateState: QuietPayPrivateState) {
    this.contract = new Contract<QuietPayPrivateState>(witnesses);
    const {
      currentPrivateState,
      currentContractState,
      currentZswapLocalState,
    } = this.contract.initialState(
      createConstructorContext(privateState, "0".repeat(64)),
    );
    this.circuitContext = {
      currentPrivateState,
      currentZswapLocalState,
      costModel: CostModel.initialCostModel(),
      currentQueryContext: new QueryContext(
        currentContractState.data,
        sampleContractAddress(),
      ),
    };
  }
  public switchPrivateState(privateState: QuietPayPrivateState) {
    this.circuitContext.currentPrivateState = privateState;
  }
  public getLedger(): Ledger {
    return ledger(this.circuitContext.currentQueryContext.state);
  }
  public getPrivateState(): QuietPayPrivateState {
    return this.circuitContext.currentPrivateState;
  }
  public fund(amount: bigint): Ledger {
    this.circuitContext = this.contract.impureCircuits.fund(
      this.circuitContext,
      amount,
    ).context;
    return ledger(this.circuitContext.currentQueryContext.state);
  }
  public postRoot(root: Uint8Array): Ledger {
    this.circuitContext = this.contract.impureCircuits.postRoot(
      this.circuitContext,
      root,
    ).context;
    return ledger(this.circuitContext.currentQueryContext.state);
  }
  public claim(): Ledger {
    this.circuitContext = this.contract.impureCircuits.claim(
      this.circuitContext,
    ).context;
    return ledger(this.circuitContext.currentQueryContext.state);
  }
  public proveIncomeAbove(threshold: bigint): boolean {
    const { context, result } =
      this.contract.impureCircuits.proveIncomeAbove(
        this.circuitContext,
        threshold,
      );
    this.circuitContext = context;
    return result;
  }
  public nextRound(): Ledger {
    this.circuitContext = this.contract.impureCircuits.nextRound(
      this.circuitContext,
    ).context;
    return ledger(this.circuitContext.currentQueryContext.state);
  }
  public nullifier(): Uint8Array {
    return this.contract.circuits.deriveNullifier(this.circuitContext, {
      bytes: this.getPrivateState().employeeSecret,
    }).result;
  }
}
