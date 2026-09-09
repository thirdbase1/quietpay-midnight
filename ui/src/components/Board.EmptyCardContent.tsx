// QuietPay empty vault card - Apache-2.0
import React, { useState } from 'react';
import { type ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import { CardActions, CardContent, IconButton, Tooltip, Typography } from '@mui/material';
import VaultAddIcon from '@mui/icons-material/PostAddOutlined';
import CreateVaultIcon from '@mui/icons-material/AddCircleOutlined';
import JoinVaultIcon from '@mui/icons-material/AddLinkOutlined';
import { TextPromptDialog } from './TextPromptDialog';
export interface EmptyCardContentProps {
  onCreateBoardCallback: () => void;
  onJoinBoardCallback: (contractAddress: ContractAddress) => void;
}
export const EmptyCardContent: React.FC<Readonly<EmptyCardContentProps>> = ({
  onCreateBoardCallback,
  onJoinBoardCallback,
}) => {
  const [textPromptOpen, setTextPromptOpen] = useState(false);
  return (
    <React.Fragment>
      <CardContent>
        <Typography align="center" variant="h1" color="text.secondary">
          <VaultAddIcon fontSize="large" />
        </Typography>
        <Typography data-testid="board-posted-message" align="center" variant="body2" color="text.secondary">
          Deploy a new payroll vault, or join one by address...
        </Typography>
      </CardContent>
      <CardActions disableSpacing sx={{ justifyContent: 'center' }}>
        <Tooltip title="Deploy a new vault">
          <IconButton data-testid="board-deploy-btn" onClick={onCreateBoardCallback}>
            <CreateVaultIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Join a vault by address">
          <IconButton
            data-testid="board-join-btn"
            onClick={() => {
              setTextPromptOpen(true);
            }}
          >
            <JoinVaultIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
      <TextPromptDialog
        prompt="Enter contract address"
        isOpen={textPromptOpen}
        onCancel={() => {
          setTextPromptOpen(false);
        }}
        onSubmit={(text) => {
          setTextPromptOpen(false);
          onJoinBoardCallback(text);
        }}
      />
    </React.Fragment>
  );
};
