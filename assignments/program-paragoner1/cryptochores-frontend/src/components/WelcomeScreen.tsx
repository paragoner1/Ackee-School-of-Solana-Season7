'use client';

import { PublicKey } from '@solana/web3.js';

interface WelcomeScreenProps {
  onSelectUserType: (type: 'parent' | 'child') => void;
  onInitializeChildWallet: () => void;
  childWallet: PublicKey | null;
}

export default function WelcomeScreen({ 
  onSelectUserType, 
  onInitializeChildWallet, 
  childWallet 
}: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🧹 Welcome to CryptoChores!
          </h1>
          <p className="text-xl text-gray-600">
            The fun way to earn crypto by completing chores
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Parent Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Parent Mode</h2>
              <p className="text-gray-600 mb-6">
                Create chores, assign them to your kids, and rate their completion to pay them in crypto.
              </p>
              <button
                onClick={() => onSelectUserType('parent')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Enter Parent Mode
              </button>
            </div>
          </div>

          {/* Child Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="text-4xl mb-4">👶</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Child Mode</h2>
              <p className="text-gray-600 mb-6">
                View your assigned chores, submit completions, and earn crypto rewards.
              </p>
              
              {!childWallet ? (
                <div className="space-y-3">
                  <button
                    onClick={onInitializeChildWallet}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Initialize Child Wallet
                  </button>
                  <p className="text-sm text-gray-500">
                    First time? Create your crypto wallet to start earning!
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => onSelectUserType('child')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Enter Child Mode
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl mb-2">💰</div>
            <h3 className="font-semibold text-gray-800 mb-2">Earn Crypto</h3>
            <p className="text-sm text-gray-600">Get paid in SOL for completing chores</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">📈</div>
            <h3 className="font-semibold text-gray-800 mb-2">Track Progress</h3>
            <p className="text-sm text-gray-600">Monitor streaks and earnings</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-800 mb-2">Quality Rewards</h3>
            <p className="text-sm text-gray-600">Better work = higher payments</p>
          </div>
        </div>
      </div>
    </div>
  );
}
