// Contract configuration
export const CONTRACT_CONFIG = {
    PACKAGE_ID: import.meta.env.VITE_PACKAGE_ID || '0xadf0a6ce11dd75d3d44930ab5bf55781801dea2bfead056eb0bb59c1aa1e9e66',
    REGISTRY_ID: import.meta.env.VITE_REGISTRY_ID || '0x68c01d2c08923d5257a5a9959d7c9250c4053dbe4641e229ccff2f35e6a3bb6d',
    ADMIN_CAP_ID: import.meta.env.VITE_ADMIN_CAP_ID || '0x18d48d74bfddffbe3dc75025136722380f374baec942df2e0aef76cad1061496',
    MODULE_NAME: 'news_registry',
} as const;

// Network configuration
export const NETWORK_CONFIG = {
    NETWORK: (import.meta.env.VITE_SUI_NETWORK || 'testnet') as 'testnet' | 'mainnet' | 'devnet',
    RPC_URL: import.meta.env.VITE_SUI_RPC_URL || 'https://fullnode.testnet.sui.io:443',
} as const;

// Walrus configuration
export const WALRUS_CONFIG = {
    PUBLISHER_URL: import.meta.env.VITE_WALRUS_PUBLISHER_URL || 'https://publisher.walrus-testnet.walrus.space/v1/store',
    AGGREGATOR_URL: import.meta.env.VITE_WALRUS_AGGREGATOR_URL || 'https://aggregator.walrus-testnet.walrus.space/v1',
} as const;

// Categories
export const CATEGORIES = [
    'DeFi',
    'Gaming',
    'NFT',
    'Dev',
    'Governance',
    'General',
] as const;

export type Category = typeof CATEGORIES[number];

// Comment types
export const COMMENT_TYPES = {
    TEXT: 'text',
    TEXT_LONG: 'text_long',
    MEDIA: 'media',
} as const;

export type CommentType = typeof COMMENT_TYPES[keyof typeof COMMENT_TYPES];

// Constants
export const CONSTANTS = {
    SHORT_COMMENT_THRESHOLD: 280,
    MIN_TIP_AMOUNT: 1_000_000, // 0.001 SUI in MIST
    MAX_PREVIEW_LENGTH: 280,
} as const;
