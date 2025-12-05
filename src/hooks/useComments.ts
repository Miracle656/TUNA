import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SuiClient } from '@mysten/sui.js/client';
import { CONTRACT_CONFIG, NETWORK_CONFIG } from '../config';

const suiClient = new SuiClient({ url: NETWORK_CONFIG.RPC_URL });

export interface Comment {
    id: string;
    blobId: string;
    author: string;
    text: string;
    timestamp: number;
    tipsReceived: number;
}

/**
 * Fetch comments for an article
 */
export function useArticleComments(blobId: string) {
    return useQuery({
        queryKey: ['comments', blobId],
        queryFn: async (): Promise<Comment[]> => {
            if (!blobId) return [];

            console.log(`[useArticleComments] Fetching comments for blobId: "${blobId}"`);

            // 1. Get the list of comment IDs from the registry
            const registry = await suiClient.getObject({
                id: CONTRACT_CONFIG.REGISTRY_ID,
                options: { showContent: true },
            });

            if (!registry.data?.content || registry.data.content.dataType !== 'moveObject') {
                console.error('[useArticleComments] Invalid registry object');
                return [];
            }

            const fields = registry.data.content.fields as any;

            // Log the raw engagement_map to see its structure
            console.log('[useArticleComments] Raw engagement_map:', fields.engagement_map);

            // Handle VecMap structure: it's a struct, so it has its own 'fields' property containing 'contents'
            const engagementMap = fields.engagement_map;
            const contents = engagementMap.fields?.contents || engagementMap.contents;

            if (!contents) {
                console.warn('[useArticleComments] ❌ Could not find "contents" in engagement_map');
                return [];
            }

            // DEBUG: Log all keys. Note: items inside contents are also structs with 'fields'
            const availableKeys = contents.map((item: any) => item.fields?.key || item.key);
            console.log('[useArticleComments] Available engagement keys:', availableKeys);

            // Find the engagement struct for this blobId
            const engagementEntry = contents.find((item: any) => {
                const key = item.fields?.key || item.key;
                return key === blobId;
            });

            if (!engagementEntry) {
                console.warn(`[useArticleComments] ❌ No engagement entry found for "${blobId}".`);
                return [];
            }

            console.log('[useArticleComments] ✅ Engagement entry found:', engagementEntry);

            // Access the value. The value is also a struct (ArticleEngagement), so it has 'fields'
            const value = engagementEntry.fields?.value || engagementEntry.value;
            const valueFields = value.fields || value;

            const commentIds = valueFields.comment_ids as string[];

            if (!commentIds || commentIds.length === 0) {
                console.log('[useArticleComments] No comment IDs found in engagement data');
                return [];
            }

            console.log(`[useArticleComments] Found ${commentIds.length} comment IDs:`, commentIds);

            // 2. Multi-get the comment objects
            const commentObjects = await suiClient.multiGetObjects({
                ids: commentIds,
                options: { showContent: true }
            });

            console.log('[useArticleComments] Fetched comment objects:', commentObjects);

            // 3. Parse the comment objects
            const parsedComments = commentObjects
                .map((obj) => {
                    if (!obj.data?.content || obj.data.content.dataType !== 'moveObject') {
                        console.warn('[useArticleComments] Invalid comment object:', obj);
                        return null;
                    }
                    const fields = obj.data.content.fields as any;

                    return {
                        id: obj.data.objectId,
                        blobId: fields.blob_id,
                        author: fields.author,
                        text: fields.preview_text,
                        timestamp: Number(fields.timestamp),
                        tipsReceived: Number(fields.tips_received || 0)
                    };
                })
                .filter((c): c is Comment => c !== null)
                .sort((a, b) => b.timestamp - a.timestamp);

            console.log('[useArticleComments] Parsed comments:', parsedComments);
            return parsedComments;
        },
        enabled: !!blobId,
        staleTime: 0,
        refetchOnWindowFocus: true
    });
}

/**
 * Post a new comment
 */
export function usePostComment() {
    const account = useCurrentAccount();
    const { mutate: signAndExecute } = useSignAndExecuteTransaction();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ blobId, text }: { blobId: string, text: string }) => {
            if (!account) throw new Error("Wallet not connected");

            const tx = new Transaction();

            tx.moveCall({
                target: `${CONTRACT_CONFIG.PACKAGE_ID}::news_registry::post_comment`,
                arguments: [
                    tx.object(CONTRACT_CONFIG.REGISTRY_ID),
                    tx.pure.string(blobId),
                    tx.pure.string(text)
                ],
            });

            return new Promise((resolve, reject) => {
                signAndExecute(
                    { transaction: tx },
                    {
                        onSuccess: (result) => {
                            console.log('Transaction success:', result);
                            // Wait a bit for indexing
                            setTimeout(() => resolve(result), 2000);
                        },
                        onError: (error) => {
                            console.error('Transaction failed:', error);
                            reject(error);
                        },
                    }
                );
            });
        },
        onSuccess: (_, variables) => {
            console.log('Invalidating queries for:', variables.blobId);
            queryClient.invalidateQueries({ queryKey: ['comments', variables.blobId] });
            queryClient.invalidateQueries({ queryKey: ['article', variables.blobId] });
        }
    });
}
