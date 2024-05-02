import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { SolanaDappCounterFrontend } from '../target/types/solana_dapp_counter_frontend';

describe('solana-dapp-counter-frontend', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace
    .SolanaDappCounterFrontend as Program<SolanaDappCounterFrontend>;

  const solanaDappCounterFrontendKeypair = Keypair.generate();

  it('Initialize SolanaDappCounterFrontend', async () => {
    await program.methods
      .initialize()
      .accounts({
        solanaDappCounterFrontend: solanaDappCounterFrontendKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([solanaDappCounterFrontendKeypair])
      .rpc();

    const currentCount = await program.account.solanaDappCounterFrontend.fetch(
      solanaDappCounterFrontendKeypair.publicKey
    );

    expect(currentCount.count).toEqual(0);
  });

  it('Increment SolanaDappCounterFrontend', async () => {
    await program.methods
      .increment()
      .accounts({
        solanaDappCounterFrontend: solanaDappCounterFrontendKeypair.publicKey,
      })
      .rpc();

    const currentCount = await program.account.solanaDappCounterFrontend.fetch(
      solanaDappCounterFrontendKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Increment SolanaDappCounterFrontend Again', async () => {
    await program.methods
      .increment()
      .accounts({
        solanaDappCounterFrontend: solanaDappCounterFrontendKeypair.publicKey,
      })
      .rpc();

    const currentCount = await program.account.solanaDappCounterFrontend.fetch(
      solanaDappCounterFrontendKeypair.publicKey
    );

    expect(currentCount.count).toEqual(2);
  });

  it('Decrement SolanaDappCounterFrontend', async () => {
    await program.methods
      .decrement()
      .accounts({
        solanaDappCounterFrontend: solanaDappCounterFrontendKeypair.publicKey,
      })
      .rpc();

    const currentCount = await program.account.solanaDappCounterFrontend.fetch(
      solanaDappCounterFrontendKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Set solanaDappCounterFrontend value', async () => {
    await program.methods
      .set(42)
      .accounts({
        solanaDappCounterFrontend: solanaDappCounterFrontendKeypair.publicKey,
      })
      .rpc();

    const currentCount = await program.account.solanaDappCounterFrontend.fetch(
      solanaDappCounterFrontendKeypair.publicKey
    );

    expect(currentCount.count).toEqual(42);
  });

  it('Set close the solanaDappCounterFrontend account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        solanaDappCounterFrontend: solanaDappCounterFrontendKeypair.publicKey,
      })
      .rpc();

    // The account should no longer exist, returning null.
    const userAccount =
      await program.account.solanaDappCounterFrontend.fetchNullable(
        solanaDappCounterFrontendKeypair.publicKey
      );
    expect(userAccount).toBeNull();
  });
});
