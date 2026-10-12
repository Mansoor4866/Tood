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

    // 2. Verify eligibility from database
    if (supabase) {
      // Check existing claim
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
        payoutEth = Number(existingClaim.amount_eth) || 0;
      } else {
        // Compute from round settlement and stakes
        const { data: roundData } = await supabase
          .from('rounds')
          .select('*')
          .eq('round_number', roundNumber)
          .maybeSingle();

        if (roundData && roundData.status === 'settled') {
          const { data: userStake } = await supabase
            .from('stakes')
            .select('*')
            .eq('round_number', roundNumber)
            .eq('wallet_address', cleanAddr)
            .eq('plot_id', roundData.drawn_plot_id)
            .maybeSingle();

          if (userStake) {
            const totalPotEth = Number(roundData.total_pot_eth) || 0;
            payoutEth = +(totalPotEth * 0.90).toFixed(4);
          }
        }
      }
    }

    // Fallback to client verified win amount if Supabase sync was pending
    if (payoutEth <= 0 && clientAmountEth && Number(clientAmountEth) > 0) {
      payoutEth = Number(clientAmountEth);
    }

    if (payoutEth <= 0) {
      return res.status(400).json({ success: false, error: 'No claimable payout amount found.' });
    }

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
    return res.status(500).json({
      success: false,
      error: err.message || 'On-chain payout transaction failed.'
    });
  }
}
