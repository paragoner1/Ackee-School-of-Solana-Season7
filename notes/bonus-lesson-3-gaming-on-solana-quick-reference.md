# Bonus Lesson 3: Gaming on Solana Quick Reference

## Gaming Concepts
- NFTs in games.

## 🎯 Gaming Architecture Overview

### **Project Structure**
```
gaming-dapp/
├── programs/
│   ├── game-core/           # Main game logic
│   ├── nft-mint/           # NFT creation and management
│   └── player-progress/    # Player state management
├── client/
│   ├── game-ui/            # Game interface
│   └── wallet-integration/ # Player wallet connection
└── assets/
    ├── game-assets/        # Game graphics and data
    └── metadata/          # NFT metadata
```

## 🔧 Development Commands

### **Backend (Anchor)**
```bash
# Setup gaming program
pnpm run setup

# Build game program
pnpm anchor-build

# Start local validator
pnpm anchor-localnet

# Run game tests
pnpm anchor-test

# Deploy to devnet
pnpm anchor deploy --provider.cluster devnet
```

### **Frontend (Game UI)**
```bash
# Install dependencies
pnpm install

# Start game development server
pnpm dev

# Build for production
pnpm build
```

## 🎮 Player Account Management

### **Player Account Structure**
```rust
#[account]
pub struct PlayerAccount {
    pub player: Pubkey,           // Player's wallet address
    pub level: u8,               // Player level
    pub experience: u64,         // Experience points
    pub inventory: Vec<Pubkey>,  // Owned NFT addresses
    pub last_login: i64,         // Last login timestamp
    pub achievements: Vec<u8>,   // Unlocked achievements
    pub equipped_items: Vec<Pubkey>, // Currently equipped items
}
```

### **Initialize Player**
```rust
#[derive(Accounts)]
pub struct InitializePlayer<'info> {
    #[account(
        init,
        payer = player,
        space = 8 + PlayerAccount::INIT_SPACE,
        seeds = [b"player", player.key().as_ref()],
        bump
    )]
    pub player_account: Account<'info, PlayerAccount>,
    
    #[account(mut)]
    pub player: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn initialize_player(ctx: Context<InitializePlayer>) -> Result<()> {
    let player_account = &mut ctx.accounts.player_account;
    
    player_account.player = ctx.accounts.player.key();
    player_account.level = 1;
    player_account.experience = 0;
    player_account.last_login = Clock::get()?.unix_timestamp;
    
    Ok(())
}
```

## 🎨 Game NFT Creation

### **Game NFT Structure**
```rust
#[account]
pub struct GameNFT {
    pub mint: Pubkey,            // NFT mint address
    pub owner: Pubkey,           // Current owner
    pub game_id: u64,           // Associated game
    pub item_type: u8,          // Item category (weapon, armor, etc.)
    pub rarity: u8,             // Item rarity level (1-5)
    pub stats: Vec<u8>,         // Item statistics
    pub metadata_uri: String,   // Metadata location
    pub is_equipped: bool,      // Currently equipped
}
```

### **Mint Game Item**
```rust
#[derive(Accounts)]
pub struct MintGameItem<'info> {
    #[account(
        init,
        payer = player,
        space = 8 + GameNFT::INIT_SPACE,
        seeds = [b"game_nft", mint.key().as_ref()],
        bump
    )]
    pub game_nft: Account<'info, GameNFT>,
    
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub player: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn mint_game_item(
    ctx: Context<MintGameItem>,
    item_type: u8,
    rarity: u8,
    stats: Vec<u8>,
    metadata_uri: String
) -> Result<()> {
    let game_nft = &mut ctx.accounts.game_nft;
    
    game_nft.mint = ctx.accounts.mint.key();
    game_nft.owner = ctx.accounts.player.key();
    game_nft.item_type = item_type;
    game_nft.rarity = rarity;
    game_nft.stats = stats;
    game_nft.metadata_uri = metadata_uri;
    game_nft.is_equipped = false;
    
    Ok(())
}
```

## 🎯 Game Mechanics

### **Start Game**
```rust
#[derive(Accounts)]
pub struct StartGame<'info> {
    #[account(mut)]
    pub player_account: Account<'info, PlayerAccount>,
    
    pub player: Signer<'info>,
}

pub fn start_game(ctx: Context<StartGame>) -> Result<()> {
    let player_account = &mut ctx.accounts.player_account;
    
    // Initialize player state
    player_account.level = 1;
    player_account.experience = 0;
    player_account.last_login = Clock::get()?.unix_timestamp;
    
    Ok(())
}
```

### **Complete Quest**
```rust
#[derive(Accounts)]
pub struct CompleteQuest<'info> {
    #[account(mut)]
    pub player_account: Account<'info, PlayerAccount>,
    
    pub player: Signer<'info>,
}

pub fn complete_quest(
    ctx: Context<CompleteQuest>,
    quest_id: u64,
    reward_experience: u64
) -> Result<()> {
    let player_account = &mut ctx.accounts.player_account;
    
    // Award experience
    player_account.experience += reward_experience;
    
    // Level up logic
    let new_level = calculate_level(player_account.experience);
    if new_level > player_account.level {
        player_account.level = new_level;
        // Emit level up event
        emit!(LevelUp {
            player: player_account.player,
            new_level: new_level,
        });
    }
    
    // Emit quest completion event
    emit!(QuestCompleted {
        player: player_account.player,
        quest_id: quest_id,
        experience_gained: reward_experience,
        new_level: player_account.level,
    });
    
    Ok(())
}
```

### **Equip Item**
```rust
#[derive(Accounts)]
pub struct EquipItem<'info> {
    #[account(mut)]
    pub player_account: Account<'info, PlayerAccount>,
    
    #[account(mut)]
    pub game_nft: Account<'info, GameNFT>,
    
    pub player: Signer<'info>,
}

pub fn equip_item(ctx: Context<EquipItem>) -> Result<()> {
    let player_account = &mut ctx.accounts.player_account;
    let game_nft = &mut ctx.accounts.game_nft;
    
    // Verify ownership
    require!(game_nft.owner == player_account.player, GameError::NotOwner);
    
    // Toggle equipped status
    game_nft.is_equipped = !game_nft.is_equipped;
    
    if game_nft.is_equipped {
        player_account.equipped_items.push(game_nft.mint);
    } else {
        // Remove from equipped items
        player_account.equipped_items.retain(|&x| x != game_nft.mint);
    }
    
    Ok(())
}
```

## 🎲 Random Number Generation

### **Generate Random Item**
```rust
pub fn generate_random_item(player: Pubkey, seed: u64) -> u8 {
    let clock = Clock::get().unwrap();
    let hash = hash(&[
        player.as_ref(),
        &clock.unix_timestamp.to_le_bytes(),
        &seed.to_le_bytes(),
    ]);
    
    // Use hash to determine item rarity (1-5)
    ((hash[0] % 5) + 1) as u8
}

pub fn generate_item_stats(rarity: u8) -> Vec<u8> {
    let clock = Clock::get().unwrap();
    let hash = hash(&[
        &clock.unix_timestamp.to_le_bytes(),
        &rarity.to_le_bytes(),
    ]);
    
    // Generate stats based on rarity
    let base_stat = (rarity as u8) * 10;
    vec![
        base_stat + (hash[0] % 10),
        base_stat + (hash[1] % 10),
        base_stat + (hash[2] % 10),
    ]
}
```

## 📊 Game Events

### **Event Definitions**
```rust
#[event]
pub struct QuestCompleted {
    pub player: Pubkey,
    pub quest_id: u64,
    pub experience_gained: u64,
    pub new_level: u8,
}

#[event]
pub struct LevelUp {
    pub player: Pubkey,
    pub new_level: u8,
}

#[event]
pub struct ItemMinted {
    pub player: Pubkey,
    pub item_id: u64,
    pub rarity: u8,
    pub mint_address: Pubkey,
}

#[event]
pub struct ItemEquipped {
    pub player: Pubkey,
    pub item_mint: Pubkey,
    pub equipped: bool,
}
```

## 🎨 Frontend Integration

### **Game State Management**
```typescript
// Game state hook
const useGameState = () => {
    const { publicKey } = useWallet();
    const [playerData, setPlayerData] = useState(null);
    const [gameState, setGameState] = useState(null);
    
    // Fetch player data
    const fetchPlayerData = async () => {
        if (!publicKey) return;
        
        try {
            const playerAccount = await program.account.playerAccount.fetch(
                findPlayerAccount(publicKey)
            );
            setPlayerData(playerAccount);
        } catch (error) {
            console.error('Error fetching player data:', error);
        }
    };
    
    // Fetch game state
    const fetchGameState = async () => {
        try {
            const gameStateAccount = await program.account.gameState.fetch(
                findGameStateAccount()
            );
            setGameState(gameStateAccount);
        } catch (error) {
            console.error('Error fetching game state:', error);
        }
    };
    
    return { playerData, gameState, fetchPlayerData, fetchGameState };
};
```

### **Mint Game Item**
```typescript
// Mint game item function
const mintGameItem = async (itemType: number, rarity: number) => {
    if (!publicKey) return;
    
    const mint = Keypair.generate();
    const stats = generateItemStats(rarity);
    const metadataUri = generateMetadataUri(itemType, rarity);
    
    try {
        const tx = await program.methods
            .mintGameItem(itemType, rarity, stats, metadataUri)
            .accounts({
                gameNft: findGameNFTAccount(mint.publicKey),
                mint: mint.publicKey,
                player: publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
            })
            .signers([mint])
            .rpc();
            
        console.log('Game item minted:', mint.publicKey.toString());
        return mint.publicKey;
    } catch (error) {
        console.error('Error minting game item:', error);
        throw error;
    }
};
```

### **Complete Quest**
```typescript
// Complete quest function
const completeQuest = async (questId: number, rewardExperience: number) => {
    if (!publicKey) return;
    
    try {
        const tx = await program.methods
            .completeQuest(questId, rewardExperience)
            .accounts({
                playerAccount: findPlayerAccount(publicKey),
                player: publicKey,
            })
            .rpc();
            
        console.log('Quest completed:', tx);
        // Refresh player data
        fetchPlayerData();
    } catch (error) {
        console.error('Error completing quest:', error);
        throw error;
    }
};
```

### **Equip Item**
```typescript
// Equip/unequip item function
const equipItem = async (itemMint: PublicKey) => {
    if (!publicKey) return;
    
    try {
        const tx = await program.methods
            .equipItem()
            .accounts({
                playerAccount: findPlayerAccount(publicKey),
                gameNft: findGameNFTAccount(itemMint),
                player: publicKey,
            })
            .rpc();
            
        console.log('Item equipped/unequipped:', tx);
        // Refresh player data
        fetchPlayerData();
    } catch (error) {
        console.error('Error equipping item:', error);
        throw error;
    }
};
```

## 🎯 Real-time Updates

### **Event Listeners**
```typescript
// Listen for game events
useEffect(() => {
    if (!publicKey) return;
    
    const subscriptions = [];
    
    // Quest completion events
    const questSubscription = program.addEventListener(
        'QuestCompleted',
        (event) => {
            if (event.player.equals(publicKey)) {
                console.log('Quest completed:', event);
                fetchPlayerData();
            }
        }
    );
    
    // Level up events
    const levelUpSubscription = program.addEventListener(
        'LevelUp',
        (event) => {
            if (event.player.equals(publicKey)) {
                console.log('Level up:', event);
                fetchPlayerData();
            }
        }
    );
    
    // Item minted events
    const itemMintedSubscription = program.addEventListener(
        'ItemMinted',
        (event) => {
            if (event.player.equals(publicKey)) {
                console.log('Item minted:', event);
                fetchPlayerData();
            }
        }
    );
    
    subscriptions.push(questSubscription, levelUpSubscription, itemMintedSubscription);
    
    return () => {
        subscriptions.forEach(sub => sub.remove());
    };
}, [publicKey]);
```

## 🎮 Game UI Components

### **Player Stats Component**
```typescript
const PlayerStats = ({ playerData }) => {
    if (!playerData) return <div>Loading player data...</div>;
    
    return (
        <div className="player-stats">
            <h3>Player Stats</h3>
            <div className="stats-grid">
                <div className="stat">
                    <label>Level:</label>
                    <span>{playerData.level}</span>
                </div>
                <div className="stat">
                    <label>Experience:</label>
                    <span>{playerData.experience}</span>
                </div>
                <div className="stat">
                    <label>Items Owned:</label>
                    <span>{playerData.inventory.length}</span>
                </div>
                <div className="stat">
                    <label>Equipped Items:</label>
                    <span>{playerData.equippedItems.length}</span>
                </div>
            </div>
        </div>
    );
};
```

### **Inventory Component**
```typescript
const Inventory = ({ playerData, onEquipItem }) => {
    const [inventory, setInventory] = useState([]);
    
    useEffect(() => {
        if (playerData?.inventory) {
            // Fetch inventory items
            fetchInventoryItems(playerData.inventory).then(setInventory);
        }
    }, [playerData]);
    
    return (
        <div className="inventory">
            <h3>Inventory</h3>
            <div className="inventory-grid">
                {inventory.map((item) => (
                    <div key={item.mint} className="inventory-item">
                        <img src={item.metadata.image} alt={item.metadata.name} />
                        <div className="item-info">
                            <h4>{item.metadata.name}</h4>
                            <p>Rarity: {item.rarity}</p>
                            <p>Type: {item.itemType}</p>
                        </div>
                        <button 
                            onClick={() => onEquipItem(item.mint)}
                            className={item.isEquipped ? 'equipped' : ''}
                        >
                            {item.isEquipped ? 'Unequip' : 'Equip'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
```

## 🚨 Error Handling

### **Game Error Types**
```rust
#[error_code]
pub enum GameError {
    #[msg("Player not found")]
    PlayerNotFound,
    #[msg("Not enough experience")]
    NotEnoughExperience,
    #[msg("Item not owned by player")]
    NotOwner,
    #[msg("Invalid item type")]
    InvalidItemType,
    #[msg("Quest not available")]
    QuestNotAvailable,
    #[msg("Player level too low")]
    LevelTooLow,
}
```

### **Frontend Error Handling**
```typescript
// Error handling wrapper
const handleGameAction = async (action: () => Promise<any>) => {
    try {
        const result = await action();
        return { success: true, data: result };
    } catch (error) {
        console.error('Game action failed:', error);
        
        // Parse Anchor errors
        if (error.error?.errorCode) {
            const errorCode = error.error.errorCode;
            const errorMessage = getErrorMessage(errorCode);
            return { success: false, error: errorMessage };
        }
        
        return { success: false, error: 'Unknown error occurred' };
    }
};

// Error message mapping
const getErrorMessage = (errorCode: string) => {
    const errorMessages = {
        'PlayerNotFound': 'Player account not found. Please start the game first.',
        'NotEnoughExperience': 'Not enough experience to complete this action.',
        'NotOwner': 'You do not own this item.',
        'InvalidItemType': 'Invalid item type specified.',
        'QuestNotAvailable': 'This quest is not available.',
        'LevelTooLow': 'Your level is too low for this action.',
    };
    
    return errorMessages[errorCode] || 'An error occurred';
};
```

## 💡 Best Practices

### **Game Development**
- **Start simple** - Begin with basic mechanics
- **Test thoroughly** - Comprehensive testing on devnet
- **Optimize transactions** - Minimize gas costs
- **Handle errors gracefully** - User-friendly error messages
- **Document everything** - Clear documentation for players

### **User Experience**
- **Fast loading** - Quick game initialization
- **Clear feedback** - Visual transaction status
- **Intuitive controls** - Easy-to-use interface
- **Progressive disclosure** - Show features gradually
- **Mobile-friendly** - Responsive design

### **Security**
- **Validate inputs** - Check all user inputs
- **Verify ownership** - Confirm asset ownership
- **Rate limiting** - Prevent spam and abuse
- **Access control** - Proper permission checks
- **Audit regularly** - Security reviews

## 🔗 Resources
- [Solana Gaming Documentation](https://docs.solana.com/developing/gaming)
- [Metaplex NFT Standards](https://docs.metaplex.com/)
- [Anchor Gaming Examples](https://github.com/coral-xyz/anchor/tree/master/examples)
- [Solana Game Development Guide](https://docs.solana.com/developing/gaming)
- [Gaming on Solana Blog](https://solana.com/ecosystem/gaming)
