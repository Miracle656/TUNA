export interface NewsArticle {
    id: string;
    blob_id: string;
    title: string;
    category: string;
    source: 'twitter' | 'rss' | 'onchain';
    timestamp: number;

    // Full content (fetched from Walrus)
    content?: string;
    summary?: string;
    url?: string;
    image?: string;
    author?: string;

    // Engagement
    totalTips: number;
    tipCount: number;
    commentCount: number;
}

export interface Comment {
    id: string;
    blob_id: string;
    author: string;
    preview_text: string;
    content_blob_id: string | null;
    comment_type: 'text' | 'text_long' | 'media';
    timestamp: number;
    tips_received: number;

    // Full content (fetched from Walrus if content_blob_id exists)
    fullContent?: {
        text: string;
        media?: Array<{
            type: 'image' | 'video';
            url: string;
            caption?: string;
        }>;
    };
}

export interface ArticleEngagement {
    totalTips: number;
    tipCount: number;
    commentCount: number;
}

export interface WalrusArticleContent {
    title: string;
    content: string;
    summary?: string;
    source: string;
    url?: string;
    image?: string;
    author?: string;
    timestamp: number;
}

export interface WalrusCommentContent {
    text: string;
    media?: Array<{
        type: 'image' | 'video';
        url: string;
        caption?: string;
    }>;
    timestamp: number;
}
