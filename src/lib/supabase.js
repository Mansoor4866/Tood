import { createClient } from '@supabase/supabase-js';
import { INITIAL_SALOON_CHATS, INITIAL_HISTORY, INITIAL_LEADERBOARD } from '../data/mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if valid credentials exist
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Sync or register a user's wallet profile in database
 */
export async function syncUserProfile(walletAddress) {
  if (!walletAddress) return null;
  if (!isSupabaseConfigured || !supabase) {
    return { wallet_address: walletAddress };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        wallet_address: walletAddress.toLowerCase(),
        last_active: new Date().toISOString()
      }, { onConflict: 'wallet_address' })
      .select()
      .single();

    if (error) console.warn('Supabase profile sync note:', error.message);
    return data;
  } catch (err) {
    console.warn('Supabase sync error:', err);
    return null;
  }
}

/**
 * Fetch recent saloon messages
 */
export async function fetchSaloonMessages() {
  if (!isSupabaseConfigured || !supabase) {
    return INITIAL_SALOON_CHATS;
  }

  try {
    const { data, error } = await supabase
      .from('saloon_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(50);

    if (error || !data || data.length === 0) {
      return INITIAL_SALOON_CHATS;
    }

    return data.map(msg => ({
      id: msg.id,
      user: msg.wallet_address.length > 12 
        ? `${msg.wallet_address.slice(0, 6)}...${msg.wallet_address.slice(-4)}`
        : msg.wallet_address,
      text: msg.text,
      time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      avatar: msg.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${msg.wallet_address}`
    }));
  } catch (err) {
    console.warn('Supabase chat fetch error:', err);
    return INITIAL_SALOON_CHATS;
  }
}

/**
 * Send a message to the saloon chat
 */
export async function sendSaloonMessage(walletAddress, text, avatar) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      id: Date.now(),
      user: walletAddress.length > 12 
        ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
        : walletAddress,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${walletAddress}`
    };
  }

  try {
    const { data, error } = await supabase
      .from('saloon_messages')
      .insert({
        wallet_address: walletAddress,
        text,
        avatar_url: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${walletAddress}`
      })
      .select()
      .single();

    if (error) {
      console.warn('Supabase post chat error:', error.message);
      return null;
    }

    return {
      id: data.id,
      user: data.wallet_address.length > 12 
        ? `${data.wallet_address.slice(0, 6)}...${data.wallet_address.slice(-4)}`
        : data.wallet_address,
      text: data.text,
      time: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      avatar: data.avatar_url
    };
  } catch (err) {
    console.warn('Supabase send chat error:', err);
    return null;
  }
}

/**
 * Subscribe to realtime saloon messages
 */
export function subscribeToSaloon(onNewMessage) {
  if (!isSupabaseConfigured || !supabase) return () => {};

  const channel = supabase
    .channel('saloon-realtime')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'saloon_messages' },
      (payload) => {
        const msg = payload.new;
        onNewMessage({
          id: msg.id,
          user: msg.wallet_address.length > 12 
            ? `${msg.wallet_address.slice(0, 6)}...${msg.wallet_address.slice(-4)}`
            : msg.wallet_address,
          text: msg.text,
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          avatar: msg.avatar_url
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Save user stake activity to Supabase
 */
export async function recordStakeActivity({ roundNumber, walletAddress, plotId, cell, tokenSymbol, ethAmount, usdgAmount }) {
  if (!isSupabaseConfigured || !supabase || !walletAddress) return;

  try {
    // 1. Ensure user profile exists
    await syncUserProfile(walletAddress);

    // 2. Ensure round entry exists
    await supabase
      .from('rounds')
      .upsert({
        round_number: roundNumber,
        status: 'betting'
      }, { onConflict: 'round_number' });

    // 3. Insert stake
    const { error } = await supabase
      .from('stakes')
      .insert({
        round_number: roundNumber,
        wallet_address: walletAddress.toLowerCase(),
        plot_id: plotId,
        cell,
        token_symbol: tokenSymbol,
        eth_amount: ethAmount || 0,
        usdg_amount: usdgAmount || 0
      });

    if (error) console.warn('Supabase stake record error:', error.message);
  } catch (err) {
    console.warn('Supabase record stake error:', err);
  }
}

/**
 * Fetch round history from Supabase
 */
export async function fetchRoundsLog() {
  if (!isSupabaseConfigured || !supabase) {
    return INITIAL_HISTORY;
  }

  try {
    const { data, error } = await supabase
      .from('rounds')
      .select('*')
      .order('round_number', { ascending: false })
      .limit(20);

    if (error || !data || data.length === 0) {
      return INITIAL_HISTORY;
    }

    return data.map(r => ({
      round: r.round_number,
      block: r.block_number || 1984200,
      cell: r.drawn_cell || '—',
      token: r.winning_token || '—',
      crew: r.winning_crew || '—',
      potEth: Number(r.total_pot_eth) || 0,
      potUsdg: Number(r.total_pot_usdg) || 0,
      winnerCount: r.winner_count || 0,
      time: r.settled_at ? new Date(r.settled_at).toLocaleTimeString() : 'Settled',
      txHash: r.tx_hash || '0x451b...d751',
      refunded: r.refunded || false
    }));
  } catch (err) {
    console.warn('Supabase rounds fetch error:', err);
    return INITIAL_HISTORY;
  }
}

/**
 * Save round settlement
 */
export async function recordRoundSettlement(roundData) {
  if (!isSupabaseConfigured || !supabase) return;

  try {
    const { error } = await supabase
      .from('rounds')
      .upsert({
        round_number: roundData.round,
        status: 'settled',
        drawn_plot_id: roundData.drawnPlotId,
        drawn_cell: roundData.cell,
        winning_token: roundData.symbol,
        winning_crew: roundData.name,
        total_pot_eth: roundData.potEth,
        total_pot_usdg: roundData.potUsdg,
        winner_count: roundData.winnerCount,
        block_number: roundData.block,
        tx_hash: roundData.txHash,
        refunded: roundData.refunded || false,
        settled_at: new Date().toISOString()
      }, { onConflict: 'round_number' });

    if (error) console.warn('Supabase round settlement save error:', error.message);
  } catch (err) {
    console.warn('Supabase record round error:', err);
  }
}
