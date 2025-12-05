import { WALRUS_CONFIG } from '../config';
import type { WalrusArticleContent, WalrusCommentContent } from '../types';

// Multiple Walrus publisher endpoints for fallback
const WALRUS_PUBLISHERS = [
    'https://walrus-testnet-publisher.nodes.guru/v1/blobs',
    'https://walrus-testnet-publisher.stakely.io/v1/blobs',
    'https://publisher.walrus-testnet.walrus.space/v1/blobs',
    'https://walrus-testnet-publisher.everstake.one/v1/blobs',
    'https://walrus-testnet-publisher.chainbase.online/v1/blobs',
    'https://publisher.testnet.walrus.atalma.io/v1/blobs',
];

const WALRUS_AGGREGATORS = [
    'https://walrus-testnet-aggregator.nodes.guru/v1/blobs',
    'https://walrus-testnet-aggregator.stakely.io/v1/blobs',
    'https://aggregator.walrus-testnet.walrus.space/v1/blobs',
    'https://walrus-testnet-aggregator.everstake.one/v1/blobs',
    'https://walrus-testnet-aggregator.chainbase.online/v1/blobs',
    'https://aggregator.testnet.walrus.atalma.io/v1/blobs',
];

/**
 * Upload content to Walrus with fallback publishers
 * @param content - The content to upload (will be JSON stringified)
 * @returns The blob ID
 */
export async function uploadToWalrus(content: WalrusArticleContent | WalrusCommentContent): Promise<string> {
    const body = JSON.stringify(content);
    const errors: Array<{ publisher: string; error: any }> = [];

    // Try each publisher endpoint
    for (const publisherBase of WALRUS_PUBLISHERS) {
        try {
            // Some publishers require epochs param
            const publisherUrl = `${publisherBase}?epochs=30`;

            const response = await fetch(publisherUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body,
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Upload failed: ${response.status} ${text}`);
            }

            const data = await response.json();

            // Walrus returns different formats
            const blobId =
                data.newlyCreated?.blobObject?.blobId ||
                data.alreadyCertified?.blobId ||
                data.blobObject?.blobId;

            if (!blobId) {
                console.error('Walrus response:', data);
                throw new Error('Could not retrieve Blob ID from Walrus');
            }

            return blobId;
        } catch (error) {
            console.warn(`Failed to upload to ${publisherBase}:`, error);
            errors.push({ publisher: publisherBase, error });
            // Continue to next publisher
        }
    }

    // If all publishers failed
    throw new Error(`Walrus upload failed on all ${WALRUS_PUBLISHERS.length} publishers`);
}

/**
 * Fetch content from Walrus with fallback aggregators
 * @param blobId - The blob ID to fetch
 * @returns The content
 */
export async function fetchFromWalrus<T = any>(blobId: string): Promise<T> {
    // Validate blob ID format to prevent 400 errors
    // Walrus blob IDs are typically base64url encoded and 32 bytes (approx 43-44 chars)
    // We'll just check if it's too short or contains spaces/invalid chars
    if (!blobId || blobId.length < 30 || blobId === 'blob_id' || blobId.includes(' ')) {
        console.warn(`Skipping invalid blob ID: ${blobId}`);
        throw new Error(`Invalid blob ID: ${blobId}`);
    }

    const errors: Array<{ aggregator: string; error: any }> = [];

    // All aggregators share the same path structure
    // Try each aggregator endpoint
    for (const aggregatorBase of WALRUS_AGGREGATORS) {
        try {
            const aggregatorUrl = `${aggregatorBase}/${blobId}`;
            const response = await fetch(aggregatorUrl);

            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            // console.warn(`Failed to fetch from ${aggregatorBase}:`, error);
            errors.push({ aggregator: aggregatorBase, error });
            // Continue to next aggregator
        }
    }

    // If all aggregators failed
    // console.error(`All Walrus aggregators failed for blob ${blobId}`, errors);
    throw new Error(`Walrus fetch failed: Could not retrieve blob ${blobId}`);
}

/**
 * Upload an image file to Walrus
 * @param file - The image file
 * @returns The blob ID
 */
export async function uploadImageToWalrus(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const errors: Array<{ publisher: string; error: any }> = [];

    // Try each publisher endpoint
    for (const publisherBase of WALRUS_PUBLISHERS) {
        try {
            const publisherUrl = `${publisherBase}?epochs=30`;

            const response = await fetch(publisherUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type,
                },
                body: arrayBuffer,
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Upload failed: ${response.status} ${text}`);
            }

            const data = await response.json();

            const blobId =
                data.newlyCreated?.blobObject?.blobId ||
                data.alreadyCertified?.blobId ||
                data.blobObject?.blobId;

            if (!blobId) {
                throw new Error('Could not retrieve Blob ID from Walrus');
            }

            return blobId;
        } catch (error) {
            errors.push({ publisher: publisherBase, error });
        }
    }

    throw new Error(`Walrus image upload failed on all publishers`);
}

/**
 * Get the public URL for a Walrus blob (uses the first working aggregator as default)
 * @param blobId - The blob ID
 * @returns The public URL
 */
export function getWalrusUrl(blobId: string): string {
    // Default to a reliable aggregator
    return `${WALRUS_AGGREGATORS[2]}/${blobId}`;
}
