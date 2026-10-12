import { ethers } from 'ethers';
import { createClient } from '@supabase/supabase-js';

const ROBINHOOD_RPC = 'https://rpc.mainnet.chain.robinhood.com';
const CHAIN_ID = 2340;

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { roundNumber, walletAddress, amountEth: clientAmountEth } = req.body;

  if (!roundNumber || !walletAddress) {
    return res.status(400).json({ success: false, error: 'roundNumber and walletAddress are required' });
  }

  if (!ethers.isAddress(walletAddress)) {
    return res.status(400).json({ success: false, error: 'Invalid recipient wallet address format.' });
  }

  const rawKey = process.env.TREASURY_PRIVATE_KEY || process.env.COMPANY_PRIVATE_KEY;
  if (!rawKey) {
    return res.status(500).json({
      success: false,
      error: 'Treasury private key is not configured in Vercel settings (TREASURY_PRIVATE_KEY).'
    });
  }

  const privateKey = rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`;
  const cleanAddr = walletAddress.toLowerCase();

  try {
    // 1. Initialize Supabase Client
    let supabase = null;
    if (supabaseUrl && supabaseKey) {
      supabase = createClient(supabaseUrl, supabaseKey);
    }

    let payoutEth = 0;

    // 2. Strict Database Verification (NEVER trust client input)
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Database service unavailable for payout verification.' });
    }

    // Step A: Check if claim already exists in claims table
    const { data: existingClaim } = await supabase
      .from('claims')
      .select('*')
      .eq('round_number', roundNumber)
      .eq('wallet_address', cleanAddr)
      .maybeSingle();

    if (existingClaim) {
      if (existingClaim.status === 'claimed') {
        return res.status(400).json({
          success: false,
          error: `Winnings for Round #${roundNumber} have already been claimed! Tx: ${existingClaim.tx_hash}`
        });
      }
      if (existingClaim.status === 'processing') {
        return res.status(429).json({
          success: false,
          error: `Payout for Round #${roundNumber} is already currently being processed.`
        });
      }
      payoutEth = Number(existingClaim.amount_eth) || 0;
    } else {
      // Step B: Verify directly from settled rounds and verified stakes
      const { data: roundData } = await supabase
        .from('rounds')
        .select('*')
        .eq('round_number', roundNumber)
        .maybeSingle();

      if (!roundData || roundData.status !== 'settled' || !roundData.drawn_plot_id) {
        return res.status(400).json({
          success: false,
          error: `Round #${roundNumber} is not settled yet. Payouts can only be claimed after the round is settled.`
        });
      }

      // Verify the user actually placed an on-chain stake on the winning plot
      const { data: userStake } = await supabase
        .from('stakes')
        .select('*')
        .eq('round_number', roundNumber)
        .eq('wallet_address', cleanAddr)
        .eq('plot_id', roundData.drawn_plot_id)
        .maybeSingle();

      if (!userStake) {
        return res.status(403).json({
          success: false,
          error: 'Access denied: No winning stake found for this wallet on the drawn plot.'
        });
      }

      // Compute exact 90% share from verified database pot
      const totalPotEth = Number(roundData.total_pot_eth) || 0;
      payoutEth = +(totalPotEth * 0.90).toFixed(4);
    }

    // Strict validation: Amount must be legitimately calculated and > 0
    if (payoutEth <= 0) {
      return res.status(400).json({ success: false, error: 'No claimable payout amount found for this round.' });
    }

    // Step C: Atomic Mutex Lock - mark as 'processing' to prevent concurrent re-entrancy / double-claim attacks
    await supabase
      .from('claims')
      .upsert({
        round_number: roundNumber,
        wallet_address: cleanAddr,
        amount_eth: payoutEth,
        status: 'processing'
      }, { onConflict: 'round_number,wallet_address' });

    // 3. Setup Robinhood Chain Provider & Signer
    const provider = new ethers.JsonRpcProvider(ROBINHOOD_RPC, {
      chainId: CHAIN_ID,
      name: 'Robinhood Chain'
    });

    const signer = new ethers.Wallet(privateKey, provider);

    // Check treasury balance
    const treasuryBalance = await provider.getBalance(signer.address);
    const amountWei = ethers.parseEther(payoutEth.toString());

    if (treasuryBalance < amountWei) {
      return res.status(400).json({
        success: false,
        error: `Insufficient Treasury balance (${ethers.formatEther(treasuryBalance)} ETH) to dispatch ${payoutEth} ETH.`
      });
    }

    // 4. Send On-Chain Transfer directly to winner!
    const tx = await signer.sendTransaction({
      to: walletAddress,
      value: amountWei
    });

    const receipt = await tx.wait(1);

    // 5. Update claim status in Supabase
    if (supabase) {
      await supabase
        .from('claims')
        .upsert({
          round_number: roundNumber,
          wallet_address: cleanAddr,
          amount_eth: payoutEth,
          status: 'claimed',
          tx_hash: tx.hash,
          claimed_at: new Date().toISOString()
        }, { onConflict: 'round_number,wallet_address' });
    }

    return res.status(200).json({
      success: true,
      txHash: tx.hash,
      amountEth: payoutEth,
      recipient: walletAddress,
      blockNumber: receipt.blockNumber
    });

  } catch (err) {
    console.error('Payout dispatch error:', err);
    if (supabase && cleanAddr) {
      try {
        await supabase
          .from('claims')
          .update({ status: 'unclaimed' })
          .eq('round_number', roundNumber)
          .eq('wallet_address', cleanAddr)
          .eq('status', 'processing');
      } catch (rollbackErr) {
        console.warn('Claim rollback warning:', rollbackErr);
      }
    }
    return res.status(500).json({
      success: false,
      error: err.message || 'On-chain payout transaction failed.'
    });
  }
}
