#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("8TrNSwnTD286pbEYbGBEWq917DJuGTibzRVqCriBRpWg");

#[program]
pub mod solana_dapp_counter_frontend {
    use super::*;

  pub fn close(_ctx: Context<CloseSolanaDappCounterFrontend>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.solana_dapp_counter_frontend.count = ctx.accounts.solana_dapp_counter_frontend.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.solana_dapp_counter_frontend.count = ctx.accounts.solana_dapp_counter_frontend.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeSolanaDappCounterFrontend>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.solana_dapp_counter_frontend.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeSolanaDappCounterFrontend<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + SolanaDappCounterFrontend::INIT_SPACE,
  payer = payer
  )]
  pub solana_dapp_counter_frontend: Account<'info, SolanaDappCounterFrontend>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseSolanaDappCounterFrontend<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub solana_dapp_counter_frontend: Account<'info, SolanaDappCounterFrontend>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub solana_dapp_counter_frontend: Account<'info, SolanaDappCounterFrontend>,
}

#[account]
#[derive(InitSpace)]
pub struct SolanaDappCounterFrontend {
  count: u8,
}
