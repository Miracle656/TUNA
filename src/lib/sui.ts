import { Transaction } from '@mysten/sui/transactions';
import { CONTRACT_CONFIG, CONSTANTS } from '../config';

/**
 * Create a transaction to tip an article
 * @param blobId - The article blob ID
 * @param amount - The tip amount in MIST
 * @returns Transaction
 */
export function createTipArticleTransaction(blobId: string, amount: number): Transaction {
    const tx = new Transaction();

    // Split coins for the tip
    const [tipCoin] = tx.splitCoins(tx.gas, [amount]);

    tx.moveCall({
        target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::tip_article`,
        arguments: [
            tx.object(CONTRACT_CONFIG.REGISTRY_ID),
            tx.pure.string(blobId),
            tipCoin,
        ],
    });

    return tx;
}

/**
 * Create a transaction to post a short comment
 * @param blobId - The article blob ID
 * @param commentText - The comment text (≤280 chars)
 * @returns Transaction
 */
export function createPostCommentTransaction(blobId: string, commentText: string): Transaction {
    const tx = new Transaction();

    tx.moveCall({
        target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::post_comment`,
        arguments: [
            tx.object(CONTRACT_CONFIG.REGISTRY_ID),
            tx.pure.string(blobId),
            tx.pure.string(commentText),
        ],
    });

    return tx;
}

/**
 * Create a transaction to post a long comment or comment with media
 * @param blobId - The article blob ID
 * @param previewText - The preview text (≤280 chars)
 * @param contentBlobId - The Walrus blob ID containing full content
 * @param commentType - 'text_long' or 'media'
 * @returns Transaction
 */
export function createPostCommentWithBlobTransaction(
    blobId: string,
    previewText: string,
    contentBlobId: string,
    commentType: 'text_long' | 'media'
): Transaction {
    const tx = new Transaction();

    tx.moveCall({
        target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::post_comment_with_blob`,
        arguments: [
            tx.object(CONTRACT_CONFIG.REGISTRY_ID),
            tx.pure.string(blobId),
            tx.pure.string(previewText),
            tx.pure.string(contentBlobId),
            tx.pure.string(commentType),
        ],
    });

    return tx;
}

/**
 * Create a transaction to tip a comment
 * @param commentId - The comment object ID
 * @param amount - The tip amount in MIST
 * @returns Transaction
 */
export function createTipCommentTransaction(commentId: string, amount: number): Transaction {
    const tx = new Transaction();

    // Split coins for the tip
    const [tipCoin] = tx.splitCoins(tx.gas, [amount]);

    tx.moveCall({
        target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::tip_comment`,
        arguments: [
            tx.object(commentId),
            tipCoin,
        ],
    });

    return tx;
}

/**
 * Create a transaction to withdraw tips from a comment
 * @param commentId - The comment object ID
 * @returns Transaction
 */
export function createWithdrawCommentTipsTransaction(commentId: string): Transaction {
    const tx = new Transaction();

    tx.moveCall({
        target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::withdraw_comment_tips`,
        arguments: [
            tx.object(commentId),
        ],
    });

    return tx;
}

/**
 * Validate tip amount
 * @param amount - Amount in MIST
 * @returns true if valid
 */
export function isValidTipAmount(amount: number): boolean {
    return amount >= CONSTANTS.MIN_TIP_AMOUNT;
}

/**
 * Convert SUI to MIST
 * @param sui - Amount in SUI
 * @returns Amount in MIST
 */
export function suiToMist(sui: number): number {
    return Math.floor(sui * 1_000_000_000);
}

/**
 * Convert MIST to SUI
 * @param mist - Amount in MIST
 * @returns Amount in SUI
 */
export function mistToSui(mist: number): number {
    return mist / 1_000_000_000;
}

/**
 * Format SUI amount for display
 * @param mist - Amount in MIST
 * @returns Formatted string
 */
export function formatSui(mist: number): string {
    const sui = mistToSui(mist);
    if (sui < 0.001) return '< 0.001 SUI';
    if (sui < 1) return `${sui.toFixed(3)} SUI`;
    return `${sui.toFixed(2)} SUI`;
}
