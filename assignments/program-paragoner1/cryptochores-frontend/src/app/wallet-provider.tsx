'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter, CoinbaseWalletAdapter, LedgerWalletAdapter, TorusWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

export function WalletProvider({ children }: { children: React.ReactNode }) {
	// The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
	const network = WalletAdapterNetwork.Devnet;

	// You can also provide a custom RPC endpoint
	const endpoint = useMemo(() => clusterApiUrl(network), [network]);

	// @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading
	// Only the wallets you configure here will be compiled into your application, and only the dependencies
	// of wallets that your users connect to will be loaded
	const wallets = useMemo(
		() => [
			new PhantomWalletAdapter(),
			new SolflareWalletAdapter(),
			new CoinbaseWalletAdapter(),
			new LedgerWalletAdapter(),
			new TorusWalletAdapter(),
		],
		[]
	);

	return (
		<ConnectionProvider endpoint={endpoint}>
			<SolanaWalletProvider wallets={wallets} autoConnect>
				<WalletModalProvider>
					{children}
				</WalletModalProvider>
			</SolanaWalletProvider>
		</ConnectionProvider>
	);
}
