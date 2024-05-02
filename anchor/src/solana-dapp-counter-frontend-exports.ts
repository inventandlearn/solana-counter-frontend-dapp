// Here we export some useful types and functions for interacting with the Anchor program.
import { Cluster, PublicKey } from '@solana/web3.js';
import type { SolanaDappCounterFrontend } from '../target/types/solana_dapp_counter_frontend';
import { IDL as SolanaDappCounterFrontendIDL } from '../target/types/solana_dapp_counter_frontend';

// Re-export the generated IDL and type
export { SolanaDappCounterFrontend, SolanaDappCounterFrontendIDL };

// After updating your program ID (e.g. after running `anchor keys sync`) update the value below.
export const SOLANA_DAPP_COUNTER_FRONTEND_PROGRAM_ID = new PublicKey(
  '8TrNSwnTD286pbEYbGBEWq917DJuGTibzRVqCriBRpWg'
);

// This is a helper function to get the program ID for the SolanaDappCounterFrontend program depending on the cluster.
export function getSolanaDappCounterFrontendProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return SOLANA_DAPP_COUNTER_FRONTEND_PROGRAM_ID;
  }
}
