'use client';

import { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import idl from '../../cryptochores-latest.json';

const programID = new PublicKey('6bv7YDEGEoXFz94EESehuGNJHJAuoL4QZFzKAAczwNyQ');

export default function Home() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [userType, setUserType] = useState<'parent' | 'child' | null>(null);
  const [childAddress, setChildAddress] = useState('');
  const [choreTitle, setChoreTitle] = useState('');
  const [choreDescription, setChoreDescription] = useState('');
  const [choreAmount, setChoreAmount] = useState(0.01);
  const [rating, setRating] = useState(8);
  const [withdrawAmount, setWithdrawAmount] = useState(0.001);
  const [loading, setLoading] = useState(false);
  const [childWallet, setChildWallet] = useState<PublicKey | null>(null);
  const [createdChorePda, setCreatedChorePda] = useState<PublicKey | null>(null);

  console.log('Connection URL:', connection.rpcEndpoint);

  const getProvider = () => {
    if (!wallet) return null;
    return new AnchorProvider(connection, wallet as any, {});
  };

  const getProgram = () => {
    const provider = getProvider();
    if (!provider) return null;
    
    // Manual validation to ensure we're using the correct program ID
    const expectedProgramId = new PublicKey('6bv7YDEGEoXFz94EESehuGNJHJAuoL4QZFzKAAczwNyQ');
    if (!programID.equals(expectedProgramId)) {
      console.error('Program ID mismatch detected!');
      return null;
    }
    
    // Create program with explicit type casting to bypass validation
    const program = new (Program as any)(idl as any, programID, provider);
    
    console.log('Program created with ID:', programID.toString());
    return program;
  };

  const initializeChildWallet = async () => {
    if (!wallet.publicKey || !childAddress) {
      alert('Please enter child address');
      return;
    }

    setLoading(true);
    try {
      console.log('Program ID:', programID.toString());
      console.log('IDL address:', idl.address);
      console.log('Connection URL:', connection.rpcEndpoint);
      
      // First, let's check if the program exists on-chain
      try {
        const programInfo = await connection.getAccountInfo(programID);
        console.log('Program info:', programInfo);
        if (!programInfo) {
          throw new Error('Program not found on-chain');
        }
      } catch (error) {
        console.error('Error checking program:', error);
        alert('Error: Program not found on-chain. Please check deployment.');
        return;
      }

      const program = getProgram();
      if (!program) return;

      const childPubkey = new PublicKey(childAddress);
      
      // Find PDA for child wallet
      const [childWalletPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('child_wallet'), childPubkey.toBuffer()],
        programID
      );

      console.log('Child wallet PDA:', childWalletPda.toString());
      console.log('Program ID being used:', programID.toString());
      console.log('Program ID from program object:', program.programId.toString());

      // Check if child wallet already exists
      try {
        const childWalletAccount = await program.account.childWallet.fetch(childWalletPda);
        // If we get here, the account exists
        setChildWallet(childWalletPda);
        alert('✅ Child wallet already exists and is loaded!');
        return;
      } catch (fetchError) {
        // Account doesn't exist, proceed with initialization
        console.log('Child wallet does not exist, initializing...');
      }

      // Call the real blockchain transaction
      await program.methods
        .initializeChildWallet()
        .accounts({
          childWallet: childWalletPda,
          child: childPubkey,
          guardian: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      setChildWallet(childWalletPda);
      alert('✅ Child wallet initialized successfully on the blockchain!');
    } catch (error) {
      console.error('Error initializing child wallet:', error);
      alert('Error initializing child wallet: ' + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  const createChore = async () => {
    if (!wallet.publicKey || !childAddress || !choreTitle || !choreDescription) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const program = getProgram();
      if (!program) return;

      const childPubkey = new PublicKey(childAddress);
      const choreCounter = web3.Keypair.generate();
      
      // Find PDA for chore
      const [chorePda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('chore'),
          wallet.publicKey.toBuffer(),
          choreCounter.publicKey.toBuffer()
        ],
        programID
      );

      await program.methods
        .createChore(choreTitle, choreDescription, new BN(choreAmount * LAMPORTS_PER_SOL))
        .accounts({
          chore: chorePda,
          childWallet: childWallet!,
          assigner: wallet.publicKey,
          assignee: childPubkey,
          systemProgram: web3.SystemProgram.programId,
          choreCounter: choreCounter.publicKey,
        })
        .signers([choreCounter])
        .rpc();

      // Store the created chore PDA for later use
      setCreatedChorePda(chorePda);
      alert('Chore created successfully! Chore PDA: ' + chorePda.toString());
      setChoreTitle('');
      setChoreDescription('');
      setChoreAmount(0.01);
    } catch (error) {
      console.error('Error creating chore:', error);
      alert('Error creating chore: ' + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  const rateAndPayChore = async () => {
    if (!wallet.publicKey || rating < 1 || rating > 10) {
      alert('Please enter a valid rating (1-10)');
      return;
    }

    setLoading(true);
    try {
      const program = getProgram();
      if (!program) return;

      // Use the stored chore PDA from when the chore was created
      if (!createdChorePda) {
        alert('No chore found. Please create a chore first.');
        return;
      }

      await program.methods
        .rateAndPayChore(rating)
        .accounts({
          chore: createdChorePda,
          childWallet: childWallet!,
          guardian: wallet.publicKey,
          childActualWallet: new PublicKey(childAddress),
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      alert(`Chore rated and paid! Rating: ${rating}/10`);
    } catch (error) {
      console.error('Error rating chore:', error);
      alert('Error rating chore: ' + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  const withdrawEarnings = async () => {
    if (!wallet.publicKey || withdrawAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const program = getProgram();
      if (!program) return;

      await program.methods
        .withdrawEarnings(new BN(withdrawAmount * LAMPORTS_PER_SOL))
        .accounts({
          childWallet: childWallet!,
          child: wallet.publicKey,
          childActualWallet: new PublicKey(childAddress),
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      alert(`Withdrew ${withdrawAmount} SOL successfully!`);
      setWithdrawAmount(0.001);
    } catch (error) {
      console.error('Error withdrawing earnings:', error);
      alert('Error withdrawing earnings: ' + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  const completeChore = async () => {
    if (!wallet.publicKey || !createdChorePda || !childAddress) {
      alert('No chore found to complete. Please have a parent create a chore first.');
      return;
    }

    setLoading(true);
    try {
      const program = getProgram();
      if (!program) return;

      const childPubkey = new PublicKey(childAddress);
      
      console.log('Attempting to complete chore...');
      console.log('Chore PDA:', createdChorePda.toString());
      console.log('Current wallet:', wallet.publicKey.toString());
      console.log('Child address:', childAddress);
      console.log('Wallets match:', wallet.publicKey.equals(childPubkey));

      // Check if current wallet matches child address (demo mode)
      if (wallet.publicKey.equals(childPubkey)) {
        // Demo mode: same wallet for parent and child
        await program.methods
          .submitChoreCompletion()
          .accounts({
            chore: createdChorePda,
            assignee: wallet.publicKey,
          })
          .rpc();

        alert('Chore completed successfully! You can now rate and pay.');
      } else {
        // Different wallets - this won't work without child's signature
        alert('Error: Cannot complete chore because you need to sign with the child wallet (' + childAddress + '), but you are connected with ' + wallet.publicKey.toString() + '.\n\nFor demo purposes, click "Use My Wallet (Demo Mode)" when setting up the child address.');
      }
    } catch (error) {
      console.error('Error completing chore:', error);
      alert('Error completing chore: ' + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  if (!wallet.connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black mb-8">
            🧹 CryptoChores
          </h1>
          <p className="text-xl text-black mb-8">
            Earn crypto by completing chores! Connect your wallet to get started.
          </p>
          <WalletMultiButton className="!bg-green-600 hover:!bg-green-700 !rounded-lg !px-6 !py-3 !text-lg" />
        </div>
      </div>
    );
  }

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-black mb-6 text-center">
            Choose Your Role
          </h2>
          <div className="space-y-4">
            <button
              onClick={() => setUserType('parent')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              👨‍👩‍👧‍👦 I'm a Parent
            </button>
            <button
              onClick={() => setUserType('child')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              👶 I'm a Child
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-black">
                🧹 CryptoChores
              </h1>
              <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {userType === 'parent' ? 'Parent Mode' : 'Child Mode'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setUserType(null)}
                className="text-black hover:text-gray-800"
              >
                Switch Role
              </button>
              <WalletMultiButton className="!bg-green-600 hover:!bg-green-700 !rounded-lg" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userType === 'parent' ? (
          <div className="space-y-8">
            {/* Initialize Child Wallet */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-black mb-6">Initialize Child Wallet</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Child's Wallet Address
                  </label>
                  <input
                    type="text"
                    value={childAddress}
                    onChange={(e) => setChildAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter child's wallet address"
                  />
                  <div className="mt-2 space-y-2">
                    <button
                      onClick={() => setChildAddress(wallet.publicKey?.toString() || '')}
                      className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-gray-700"
                    >
                      Use My Wallet (Demo Mode)
                    </button>
                    <p className="text-xs text-gray-500">
                      For demo: Use your own wallet as both parent and child
                    </p>
                  </div>
                </div>
                <button
                  onClick={initializeChildWallet}
                  disabled={loading || !childAddress}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {loading ? 'Initializing...' : 'Initialize Child Wallet'}
                </button>
              </div>
            </div>

            {/* Create Chore */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-black mb-6">Create Chore</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Chore Title
                  </label>
                  <input
                    type="text"
                    value={choreTitle}
                    onChange={(e) => setChoreTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Clean Room"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Description
                  </label>
                  <textarea
                    value={choreDescription}
                    onChange={(e) => setChoreDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                    placeholder="Describe what needs to be done..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Payment Amount (SOL)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    value={choreAmount}
                    onChange={(e) => setChoreAmount(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button
                  onClick={createChore}
                  disabled={loading || !choreTitle || !choreDescription || !childAddress}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {loading ? 'Creating...' : 'Create Chore'}
                </button>
                {!childWallet && (
                  <p className="text-sm text-gray-600 mt-2">
                    💡 Tip: Initialize the child wallet first for better tracking, but you can create chores with just the child's address.
                  </p>
                )}
              </div>
            </div>

            {/* Mark Chore Complete */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-black mb-6">Mark Chore Complete</h2>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  After the child has completed the chore in real life, mark it as complete here.
                </p>
                <button
                  onClick={completeChore}
                  disabled={loading || !createdChorePda}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {loading ? 'Marking Complete...' : 'Mark Chore as Complete'}
                </button>
                {!createdChorePda && (
                  <p className="text-sm text-gray-600 mt-2">
                    💡 Create a chore first before marking it complete.
                  </p>
                )}
              </div>
            </div>

            {/* Rate and Pay Chore */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-black mb-6">Rate and Pay Chore</h2>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  After marking the chore complete, rate the child's work and send payment.
                </p>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Rating (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button
                  onClick={rateAndPayChore}
                  disabled={loading || !childWallet}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {loading ? 'Processing...' : 'Rate and Pay Chore'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Child Dashboard */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-black mb-6">Child Dashboard</h2>
              <div className="space-y-4">
                {/* Info about chore completion */}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-black mb-4">Chore Status</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      💡 <strong>Demo Mode Note:</strong> Since we're using a single wallet for testing, 
                      chore completion needs to be done by the parent in "Parent Mode" after you've 
                      actually completed the chore in real life.
                    </p>
                    <p className="text-blue-700 text-sm mt-2">
                      The parent will mark the chore as complete, then rate and pay you.
                    </p>
                  </div>
                </div>

                {/* Withdraw Section */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Withdraw Earnings</h3>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Withdraw Amount (SOL)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      min="0.001"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <button
                    onClick={withdrawEarnings}
                    disabled={loading || !childWallet}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors mt-4"
                  >
                    {loading ? 'Withdrawing...' : 'Withdraw Earnings'}
                  </button>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">How it works</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-700">
                <div>
                  <div className="font-semibold mb-2">1. Complete Chores</div>
                  <p>Finish the chores assigned by your parent</p>
                </div>
                <div>
                  <div className="font-semibold mb-2">2. Get Rated</div>
                  <p>Parent rates your work quality (1-10)</p>
                </div>
                <div>
                  <div className="font-semibold mb-2">3. Earn Crypto</div>
                  <p>Receive SOL based on your rating</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
