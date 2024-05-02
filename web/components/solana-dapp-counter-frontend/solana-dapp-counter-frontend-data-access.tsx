'use client';

import {
  SolanaDappCounterFrontendIDL,
  getSolanaDappCounterFrontendProgramId,
} from '@solana-dapp-counter-frontend/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useSolanaDappCounterFrontendProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getSolanaDappCounterFrontendProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = new Program(
    SolanaDappCounterFrontendIDL,
    programId,
    provider
  );

  const accounts = useQuery({
    queryKey: ['solana-dapp-counter-frontend', 'all', { cluster }],
    queryFn: () => program.account.solanaDappCounterFrontend.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ['solana-dapp-counter-frontend', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({ solanaDappCounterFrontend: keypair.publicKey })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useSolanaDappCounterFrontendProgramAccount({
  account,
}: {
  account: PublicKey;
}) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useSolanaDappCounterFrontendProgram();

  const accountQuery = useQuery({
    queryKey: ['solana-dapp-counter-frontend', 'fetch', { cluster, account }],
    queryFn: () => program.account.solanaDappCounterFrontend.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: [
      'solana-dapp-counter-frontend',
      'close',
      { cluster, account },
    ],
    mutationFn: () =>
      program.methods
        .close()
        .accounts({ solanaDappCounterFrontend: account })
        .rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrementMutation = useMutation({
    mutationKey: [
      'solana-dapp-counter-frontend',
      'decrement',
      { cluster, account },
    ],
    mutationFn: () =>
      program.methods
        .decrement()
        .accounts({ solanaDappCounterFrontend: account })
        .rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const incrementMutation = useMutation({
    mutationKey: [
      'solana-dapp-counter-frontend',
      'increment',
      { cluster, account },
    ],
    mutationFn: () =>
      program.methods
        .increment()
        .accounts({ solanaDappCounterFrontend: account })
        .rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const setMutation = useMutation({
    mutationKey: ['solana-dapp-counter-frontend', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods
        .set(value)
        .accounts({ solanaDappCounterFrontend: account })
        .rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  };
}
