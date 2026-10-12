use anchor_lang::prelude::*;

declare_id!("Relay111111111111111111111111111111111111111");

#[program]
pub mod priority_relay {
    use super::*;

    pub fn initialize_relay(
        ctx: Context<InitializeRelay>,
        max_priority_fee_micro_lamports: u64,
        max_slippage_bps: u16,
    ) -> Result<()> {
        require!(max_slippage_bps <= 1000, RelayError::InvalidMaxSlippage);

        let config = &mut ctx.accounts.relay_config;
        config.authority = ctx.accounts.authority.key();
        config.max_priority_fee = max_priority_fee_micro_lamports;
        config.max_slippage_bps = max_slippage_bps;
        config.total_relayed = 0;
        config.bump = ctx.bumps.relay_config;

        emit!(RelayInitializedEvent {
            authority: config.authority,
            max_priority_fee: max_priority_fee_micro_lamports,
            max_slippage_bps,
        });

        Ok(())
    }

    pub fn execute_guarded_relay(
        ctx: Context<ExecuteRelay>,
        expected_output_lamports: u64,
        actual_output_lamports: u64,
    ) -> Result<()> {
        let config = &mut ctx.accounts.relay_config;

        let min_required = (expected_output_lamports as u128)
            .saturating_mul(10000 - config.max_slippage_bps as u128)
            .checked_div(10000)
            .unwrap_or(0) as u64;

        require!(
            actual_output_lamports >= min_required,
            RelayError::SandwichDetectedExceedsSlippage
        );

        config.total_relayed = config.total_relayed.saturating_add(1);

        emit!(RelaySuccessEvent {
            user: ctx.accounts.user.key(),
            actual_output: actual_output_lamports,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeRelay<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + RelayConfig::LEN,
        seeds = [b"relay-config", authority.key().as_ref()],
        bump
    )]
    pub relay_config: Account<'info, RelayConfig>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecuteRelay<'info> {
    #[account(mut)]
    pub relay_config: Account<'info, RelayConfig>,
    pub user: Signer<'info>,
}

#[account]
pub struct RelayConfig {
    pub authority: Pubkey,
    pub max_priority_fee: u64,
    pub max_slippage_bps: u16,
    pub total_relayed: u64,
    pub bump: u8,
}

impl RelayConfig {
    pub const LEN: usize = 32 + 8 + 2 + 8 + 1;
}

#[event]
pub struct RelayInitializedEvent {
    pub authority: Pubkey,
    pub max_priority_fee: u64,
    pub max_slippage_bps: u16,
}

#[event]
pub struct RelaySuccessEvent {
    pub user: Pubkey,
    pub actual_output: u64,
}

#[error_code]
pub enum RelayError {
    #[msg("Max slippage basis points exceeds safe limit of 1000 bps (10%).")]
    InvalidMaxSlippage,
    #[msg("Sandwich attack or excessive slippage detected: actual output is below safety threshold.")]
    SandwichDetectedExceedsSlippage,
}
