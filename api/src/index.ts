// QuietPay API - Apache-2.0
import * as QuietPay from '../../contracts/src/managed/quietpay/contract/index.js';
import { type ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import { type Logger } from 'pino';
import {
  type QuietPayDerivedState,
  type QuietPayContract,
  type QuietPayProviders,
  type DeployedQuietPayContract,
  quietpayPrivateStateKey,
} from './common-types.js';
import { CompiledQuietPayContractContract } from '../../contracts/src/index';
import * as utils from './utils/index.js';
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { combineLatest, map, tap, from, type Observable } from 'rxjs';
import { toHex } from '@midnight-ntwrk/midnight-js-utils';
import { QuietPayPrivateState, createQuietPayPrivateState } from '../../contracts/src/witnesses.js';
export interface DeployedQuietPayAPI {
  readonly deployedContractAddress: ContractAddress;
  readonly state$: Observable<QuietPayDerivedState>;
  fund: (amount: bigint) => Promise<void>;
  postRoot: (root: Uint8Array) => Promise<void>;
  claim: () => Promise<void>;
  proveIncomeAbove: (threshold: bigint) => Promise<boolean>;
  nextRound: () => Promise<void>;
}
export class QuietPayAPI implements DeployedQuietPayAPI {
  private constructor(
    public readonly deployedContract: DeployedQuietPayContract,
    providers: QuietPayProviders,
    private readonly logger?: Logger,
  ) {
    this.deployedContractAddress = deployedContract.deployTxData.public.contractAddress;
    providers.privateStateProvider.setContractAddress(this.deployedContractAddress);
    this.state$ = combineLatest(
      [
        providers.publicDataProvider.contractStateObservable(this.deployedContractAddress, { type: 'latest' }).pipe(
          map((contractState) => QuietPay.ledger(contractState.data)),
          tap((ledgerState) =>
            logger?.trace({
              ledgerStateChanged: {
                totalFunded: ledgerState._totalFunded.toString(),
                totalClaimed: ledgerState._totalClaimed.toString(), isFinalized: ledgerState._isFinalized,
              },
            }),
          ),
        ),
        from(providers.privateStateProvider.get(quietpayPrivateStateKey) as Promise<QuietPayPrivateState>),
      ],
      (ledgerState, privateState) => {
        const derivedAdmin = QuietPay.pureCircuits.deriveAdminPublicKey({ bytes: privateState.adminSecret });
        return {
          totalFunded: ledgerState._totalFunded,
          totalClaimed: ledgerState._totalClaimed,
          payrollRoot: ledgerState._payrollRoot,
          isFinalized: ledgerState._isFinalized,
          isAdmin: toHex(ledgerState._admin.bytes) === toHex(derivedAdmin.bytes),
        };
      },
    );
  }
  readonly deployedContractAddress: ContractAddress;
  readonly state$: Observable<QuietPayDerivedState>;
  async fund(amount: bigint): Promise<void> {
    this.logger?.info('fundingVault');
    const txData = await this.deployedContract.callTx.fund(amount);
    this.logger?.trace({
      transactionAdded: {
        circuit: 'fund',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }
  async postRoot(root: Uint8Array): Promise<void> {
    this.logger?.info('postingPayrollRoot');
    const txData = await this.deployedContract.callTx.postRoot(root);
    this.logger?.trace({
      transactionAdded: {
        circuit: 'postRoot',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }
  async claim(): Promise<void> {
    this.logger?.info('claimingPay');
    const txData = await this.deployedContract.callTx.claim();
    this.logger?.trace({
      transactionAdded: {
        circuit: 'claim',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }
  async proveIncomeAbove(threshold: bigint): Promise<boolean> {
    this.logger?.info('provingIncomeAbove');
    const result = await this.deployedContract.callTx.proveIncomeAbove(threshold);
    return result.private.result;
  }
  async nextRound(): Promise<void> {
    this.logger?.info('openingNextRound');
    const txData = await this.deployedContract.callTx.nextRound();
    this.logger?.trace({
      transactionAdded: {
        circuit: 'nextRound',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }
  static async deploy(providers: QuietPayProviders, logger?: Logger): Promise<QuietPayAPI> {
    logger?.info('deployContract');
    const deployedQuietPayContract = await deployContract(providers, {
      compiledContract: CompiledQuietPayContractContract,
      privateStateId: quietpayPrivateStateKey,
      initialPrivateState: createQuietPayPrivateState(utils.randomBytes(32)),
    });
    logger?.trace({ contractDeployed: { finalizedDeployTxData: deployedQuietPayContract.deployTxData.public } });
    return new QuietPayAPI(deployedQuietPayContract, providers, logger);
  }
  static async join(
    providers: QuietPayProviders,
    contractAddress: ContractAddress,
    logger?: Logger,
  ): Promise<QuietPayAPI> {
    logger?.info({ joinContract: { contractAddress } });
    const deployedQuietPayContract = await findDeployedContract<QuietPayContract>(providers, {
      contractAddress,
      compiledContract: CompiledQuietPayContractContract,
      privateStateId: quietpayPrivateStateKey,
      initialPrivateState: await QuietPayAPI.getPrivateState(providers, contractAddress),
    });
    logger?.trace({ contractJoined: { finalizedDeployTxData: deployedQuietPayContract.deployTxData.public } });
    return new QuietPayAPI(deployedQuietPayContract, providers, logger);
  }
  private static async getPrivateState(
    providers: QuietPayProviders,
    contractAddress: ContractAddress,
  ): Promise<QuietPayPrivateState> {
    providers.privateStateProvider.setContractAddress(contractAddress);
    const existingPrivateState = await providers.privateStateProvider.get(quietpayPrivateStateKey);
    return existingPrivateState ?? createQuietPayPrivateState(utils.randomBytes(32));
  }
}
export * as utils from './utils/index.js';
export * from './common-types.js';
