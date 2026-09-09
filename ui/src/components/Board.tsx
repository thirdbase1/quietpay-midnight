// QuietPay payroll card - Apache-2.0
import React, { useCallback, useEffect, useState } from "react";
import { type ContractAddress } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import { Backdrop, CircularProgress, Card, CardActions, CardContent, CardHeader, IconButton, Skeleton, Typography, TextField, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import CopyIcon from "@mui/icons-material/ContentPasteOutlined";
import StopIcon from "@mui/icons-material/HighlightOffOutlined";
import { toHex } from "@midnight-ntwrk/midnight-js-utils";
import { type QuietPayDerivedState, type DeployedQuietPayAPI } from "../../../api/src/index";
import { useDeployedBoardContext } from "../hooks";
import { type BoardDeployment } from "../contexts";
import { type Observable } from "rxjs";
import { EmptyCardContent } from "./Board.EmptyCardContent";
export interface BoardProps {
  boardDeployment$?: Observable<BoardDeployment>;
}
export const Board: React.FC<Readonly<BoardProps>> = ({ boardDeployment$ }) => {
  const boardApiProvider = useDeployedBoardContext();
  const [boardDeployment, setBoardDeployment] = useState<BoardDeployment>();
  const [deployedBoardAPI, setDeployedBoardAPI] = useState<DeployedQuietPayAPI>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [infoMessage, setInfoMessage] = useState<string>();
  const [boardState, setBoardState] = useState<QuietPayDerivedState>();
  const [amountPrompt, setAmountPrompt] = useState<string>("");
  const [rootPrompt, setRootPrompt] = useState<string>("");
  const [thresholdPrompt, setThresholdPrompt] = useState<string>("");
  const [isWorking, setIsWorking] = useState(!!boardDeployment$);
  const onCreateBoard = useCallback(() => boardApiProvider.resolve(), [boardApiProvider]);
  const onJoinBoard = useCallback((contractAddress: ContractAddress) => boardApiProvider.resolve(contractAddress), [boardApiProvider]);
  const runCircuit = useCallback(async (label: string, fn: () => Promise<void>) => {
    try {
      if (deployedBoardAPI) {
        setIsWorking(true);
        setInfoMessage(undefined);
        setErrorMessage(undefined);
        await fn();
        setInfoMessage(label + " submitted");
      }
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsWorking(false);
    }
  }, [deployedBoardAPI]);
  const onFund = useCallback(() => runCircuit("Funding", () => deployedBoardAPI!.fund(BigInt(amountPrompt))), [runCircuit, deployedBoardAPI, amountPrompt]);
  const onPostRoot = useCallback(() => runCircuit("Payroll root posted", () => deployedBoardAPI!.postRoot(Buffer.from(rootPrompt, "hex"))), [runCircuit, deployedBoardAPI, rootPrompt]);
  const onClaim = useCallback(() => runCircuit("Claim", () => deployedBoardAPI!.claim()), [runCircuit, deployedBoardAPI]);
  const onNextRound = useCallback(() => runCircuit("Next round opened", () => deployedBoardAPI!.nextRound()), [runCircuit, deployedBoardAPI]);
  const onProve = useCallback(async () => {
    try {
      if (deployedBoardAPI) {
        setIsWorking(true);
        setInfoMessage(undefined);
        setErrorMessage(undefined);
        const ok = await deployedBoardAPI.proveIncomeAbove(BigInt(thresholdPrompt));
        setInfoMessage("Income proof result: " + ok);
      }
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsWorking(false);
    }
  }, [deployedBoardAPI, thresholdPrompt]);
  const onCopyContractAddress = useCallback(async () => {
    if (deployedBoardAPI) {
      await navigator.clipboard.writeText(deployedBoardAPI.deployedContractAddress);
    }
  }, [deployedBoardAPI]);
  useEffect(() => {
    if (!boardDeployment$) {
      return;
    }
    const subscription = boardDeployment$.subscribe(setBoardDeployment);
    return () => {
      subscription.unsubscribe();
    };
  }, [boardDeployment$]);
  useEffect(() => {
    if (!boardDeployment) {
      return;
    }
    if (boardDeployment.status === "in-progress") {
      return;
    }
    setIsWorking(false);
    if (boardDeployment.status === "failed") {
      setErrorMessage(boardDeployment.error.message.length ? boardDeployment.error.message : "Encountered an unexpected error.");
      return;
    }
    setDeployedBoardAPI(boardDeployment.api);
    const subscription = boardDeployment.api.state$.subscribe(setBoardState);
    return () => {
      subscription.unsubscribe();
    };
  }, [boardDeployment, setIsWorking, setErrorMessage, setDeployedBoardAPI]);
  return (
    <Card sx={{ position: "relative", width: 340, minWidth: 340 }} color="primary">
      {!boardDeployment$ && (<EmptyCardContent onCreateBoardCallback={onCreateBoard} onJoinBoardCallback={onJoinBoard} />)}
      {boardDeployment$ && (<React.Fragment>
        <Backdrop sx={{ position: "absolute", color: "#fff", zIndex: 10 }} open={isWorking}>
          <CircularProgress data-testid="board-working-indicator" />
        </Backdrop>
        <Backdrop sx={{ position: "absolute", color: "#ff0000", zIndex: 10 }} open={!!errorMessage}>
          <StopIcon fontSize="large" />
          <Typography component="div" data-testid="board-error-message">{errorMessage}</Typography>
        </Backdrop>
        <CardHeader avatar={boardState ? (boardState.isFinalized ? (<LockIcon data-testid="post-locked-icon" />) : (<LockOpenIcon data-testid="post-unlocked-icon" />)) : (<Skeleton variant="circular" width={20} height={20} />)} titleTypographyProps={{ color: "primary" }} title={toShortFormatContractAddress(deployedBoardAPI?.deployedContractAddress) ?? "Loading..."} action={deployedBoardAPI?.deployedContractAddress ? (<IconButton title="Copy contract address" onClick={onCopyContractAddress}><CopyIcon fontSize="small" /></IconButton>) : (<Skeleton variant="circular" width={20} height={20} />)} />
        <CardContent>
          {boardState ? (<React.Fragment>
            <Typography color="primary" sx={{ fontVariantNumeric: "tabular-nums" }}>Total funded: {boardState.totalFunded.toString()}</Typography>
            <Typography color="primary" sx={{ fontVariantNumeric: "tabular-nums" }}>Total claimed: {boardState.totalClaimed.toString()}</Typography>
            <Typography color="primary">Root: {toHex(boardState.payrollRoot).slice(0, 24)}...</Typography>
            <Typography color="primary">Finalized: {boardState.isFinalized ? "yes" : "no"}</Typography>
            <Typography color="primary">Role: {boardState.isAdmin ? "admin" : "employee"}</Typography>
            {infoMessage && (<Typography color="secondary">{infoMessage}</Typography>)}
            <TextField data-testid="fund-amount" variant="outlined" fullWidth size="small" placeholder="Fund amount" value={amountPrompt} onChange={(e) => setAmountPrompt(e.target.value)} />
            <TextField data-testid="payroll-root" variant="outlined" fullWidth size="small" placeholder="Payroll root hex" value={rootPrompt} onChange={(e) => setRootPrompt(e.target.value)} />
            <TextField data-testid="income-threshold" variant="outlined" fullWidth size="small" placeholder="Income threshold" value={thresholdPrompt} onChange={(e) => setThresholdPrompt(e.target.value)} />
          </React.Fragment>) : (<Skeleton variant="rectangular" width={300} height={200} />)}
        </CardContent>
        <CardActions>
          {deployedBoardAPI ? (<React.Fragment>
            <Button variant="contained" color="primary" data-testid="fund-btn" onClick={onFund}>Fund</Button>
            <Button variant="outlined" data-testid="post-root-btn" onClick={onPostRoot}>Post root</Button>
            <Button variant="contained" color="secondary" data-testid="claim-btn" onClick={onClaim}>Claim</Button>
            <Button variant="outlined" data-testid="prove-btn" onClick={onProve}>Prove</Button>
            <Button variant="outlined" data-testid="next-round-btn" onClick={onNextRound}>Next</Button>
          </React.Fragment>) : (<Skeleton variant="rectangular" width={80} height={20} />)}
        </CardActions>
      </React.Fragment>)}
    </Card>
  );
};
const toShortFormatContractAddress = (contractAddress: ContractAddress | undefined): React.ReactElement | undefined => (contractAddress ? (<span data-testid="board-address">0x{contractAddress?.replace(/^[A-Fa-f0-9]{6}([A-Fa-f0-9]{8}).*([A-Fa-f0-9]{8})$/g, "$1...$2")}</span>) : undefined);
