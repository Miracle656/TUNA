import { useQuery } from '@tanstack/react-query';
import { SuiClient } from '@mysten/sui.js/client';
import { CONTRACT_CONFIG, NETWORK_CONFIG } from '../config';
import { fetchFromWalrus } from '../lib/walrus';
import type { NewsArticle, ArticleEngagement, WalrusArticleContent } from '../types';

const suiClient = new SuiClient({ url: NETWORK_CONFIG.RPC_URL });

/**
 * Fetch latest news articles from the registry
 */
export function useLatestNews(limit: number = 100) {
    return useQuery({
        queryKey: ['latestNews', limit],
        queryFn: async (): Promise<NewsArticle[]> => {
            // Get the registry object
            const registry = await suiClient.getObject({
                id: CONTRACT_CONFIG.REGISTRY_ID,
                options: { showContent: true },
            });

            if (!registry.data?.content || registry.data.content.dataType !== 'moveObject') {
                throw new Error('Invalid registry object');
            }

            const fields = registry.data.content.fields as any;
            const latestBlobs = fields.latest_blobs as string[];

            // Take only the requested number of articles (NEWEST FIRST)
            // Slice from the end (-limit) to get the latest, then reverse to show newest first
            const blobsToFetch = latestBlobs.slice(-limit).reverse();

            // Fetch metadata and engagement for each article
            const articles = await Promise.all(
                blobsToFetch.map(async (blobId) => {
                    try {
                        // Fetch full content from Walrus
                        const walrusContent = await fetchFromWalrus<WalrusArticleContent>(blobId);

                        // Get engagement data
                        const engagement = await getArticleEngagement(blobId);

                        return {
                            id: blobId,
                            blob_id: blobId,
                            title: walrusContent.title,
                            category: 'General', // You can enhance this by storing category in metadata
                            source: walrusContent.source as 'twitter' | 'rss' | 'onchain',
                            timestamp: walrusContent.timestamp,
                            content: walrusContent.content,
                            summary: walrusContent.summary,
                            url: walrusContent.url,
                            image: walrusContent.image,
                            author: walrusContent.author,
                            ...engagement,
                        };
                    } catch (error) {
                        console.error(`Error fetching article ${blobId}:`, error);
                        return null;
                    }
                })
            );

            return articles.filter(article => article !== null) as NewsArticle[];
        },
        staleTime: 30000, // 30 seconds
    });
}

/**
 * Fetch articles by category
 */
export function useNewsByCategory(category: string, limit: number = 50) {
    return useQuery({
        queryKey: ['newsByCategory', category, limit],
        queryFn: async (): Promise<NewsArticle[]> => {
            // Similar to useLatestNews but fetch from category-specific blob list
            // Implementation depends on how you want to query category blobs
            return [];
        },
        enabled: !!category,
    });
}

/**
 * Get engagement data for an article
 */
async function getArticleEngagement(blobId: string): Promise<ArticleEngagement> {
    try {
        const registry = await suiClient.getObject({
            id: CONTRACT_CONFIG.REGISTRY_ID,
            options: { showContent: true },
        });

        if (!registry.data?.content || registry.data.content.dataType !== 'moveObject') {
            return { totalTips: 0, tipCount: 0, commentCount: 0 };
        }

        const fields = registry.data.content.fields as any;
        const engagementMap = fields.engagement_map as any;

        // Find engagement for this blob_id
        // This is a simplified version - you may need to parse the VecMap structure
        const engagement = engagementMap.contents?.find((item: any) => item.key === blobId);

        if (!engagement) {
            return { totalTips: 0, tipCount: 0, commentCount: 0 };
        }

        return {
            totalTips: parseInt(engagement.value.total_tips || '0'),
            tipCount: parseInt(engagement.value.tip_count || '0'),
            commentCount: parseInt(engagement.value.comment_count || '0'),
        };
    } catch (error) {
        console.error('Error fetching engagement:', error);
        return { totalTips: 0, tipCount: 0, commentCount: 0 };
    }
}

/**
 * Fetch a single article by blob ID
 */
export function useArticle(blobId: string) {
    return useQuery({
        queryKey: ['article', blobId],
        queryFn: async (): Promise<NewsArticle | null> => {
            try {
                const walrusContent = await fetchFromWalrus<WalrusArticleContent>(blobId);
                const engagement = await getArticleEngagement(blobId);

                return {
                    id: blobId,
                    blob_id: blobId,
                    title: walrusContent.title,
                    category: 'General',
                    source: walrusContent.source as 'twitter' | 'rss' | 'onchain',
                    timestamp: walrusContent.timestamp,
                    content: walrusContent.content,
                    summary: walrusContent.summary,
                    url: walrusContent.url,
                    image: walrusContent.image,
                    author: walrusContent.author,
                    ...engagement,
                };
            } catch (error) {
                console.error(`Error fetching article ${blobId}:`, error);
                return null;
            }
        },
        enabled: !!blobId,
    });
}
