// Contract configuration
export const CONTRACT_CONFIG = {
    PACKAGE_ID: import.meta.env.VITE_PACKAGE_ID || '0xc19c25a9e42f77c2466a1df42d99a160a65a8800711eef447bb8da441df33c9e',
    REGISTRY_ID: import.meta.env.VITE_REGISTRY_ID || '0x65fa3ee1fa53af68c36dd47b525392dfb844726af980f758c1b6dc353a30e962',
    ADMIN_CAP_ID: import.meta.env.VITE_ADMIN_CAP_ID || '0x87c090e5a60dd505d3ef7634e6f32ced2134640f56b329946ab920a3a9299f6e',
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
