import React from 'react';
import { ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-[#e5e7eb] bg-white py-12 mt-16">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#f0f0f0]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#0d0e11] flex items-center justify-center text-white font-bold">
              <span className="text-[#f243ac]">T</span>
            </div>
            <span className="display text-[20px] font-bold text-[#0d0e11]">Tood</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 mono text-[13px] text-[#0d0e1180] font-medium">
            <a
              href="https://robinhoodchain.blockscout.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#f243ac] flex items-center gap-1 transition-colors"
            >
              <span>Blockscout</span>
              <ExternalLink size={11} />
            </a>

            <a
              href="https://rpc.mainnet.chain.robinhood.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#f243ac] flex items-center gap-1 transition-colors"
            >
              <span>Robinhood RPC</span>
              <ExternalLink size={11} />
            </a>

            <a
              href="https://x.com/tood_game"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#f243ac] flex items-center gap-1 transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>@tood_game</span>
            </a>
          </div>
        </div>

        {/* Bottom text */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 text-[13px] text-[#0d0e1180]">
          <div>
            Sixteen plots on Robinhood Chain · Season 1
          </div>
          <div>
            Tood is a game of chance · stake only what you can afford to lose
          </div>
        </div>

      </div>
    </footer>
  );
};
