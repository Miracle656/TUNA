# 🐟 TUNA. Developer Integration Guide

This guide details how to integrate the **TUNA. News Feed** into your own application. TUNA acts as a decentralized "News Oracle" on the Sui Network, indexing content that is permanently stored on Walrus.

> **TL;DR:** You only need the **Registry Object ID** to fetch news. The data is public, permissionless, and free to use.

---

## 🏗️ Architecture

The system consists of two parts:
1.  **The Index (Sui)**: A Shared Object called the `NewsRegistry`. It contains a vector (list) of "Blob IDs".
2.  **The Content (Walrus)**: The actual article JSON is stored as "blobs" on the Walrus decentralized storage network.

To get the news, your app follows this path:
`Sui Registry -> Get Blob IDs -> Fetch JSON from Walrus Aggregator`

---

## 🔑 Configuration (Sui Testnet)

You only need **one** ID to read the feed.

| Resource | Value | Note |
| :--- | :--- | :--- |
| **Registry ID** | `0x68c01d2c08923d5257a5a9959d7c9250c4053dbe4641e229ccff2f35e6a3bb6d` | **REQUIRED**. The object storing the list of news. |
| **Package ID** | `0xadf0...` | *NOT NEEDED* for fetching. Only needed if you are executing transactions. |

---

## 💻 Integration Code (TypeScript)

Here is a complete, copy-pasteable service class to fetch the news.
It uses the official `@mysten/sui.js` SDK.

### 1. Install Dependencies
```bash
npm install @mysten/sui.js
```

### 2. Implementation (`tunaService.ts`)

```typescript
import { SuiClient } from '@mysten/sui.js/client';

// Configuration
const CONFIG = {
    // Sui Testnet RPC
    RPC: 'https://fullnode.testnet.sui.io:443',
    // The TUNA Registry Object
    REGISTRY_ID: '0x68c01d2c08923d5257a5a9959d7c9250c4053dbe4641e229ccff2f35e6a3bb6d',
    // Walrus Aggregator (Public Gateway)
    WALRUS_GATEWAY: 'https://aggregator.walrus-testnet.walrus.space/v1',
};

// Data Types
export interface TunaArticle {
    title: string;
    summary: string;
    content: string; // HTML string
    source: string;  // e.g., "Sui Blog", "@SuiNetwork"
    url: string;     // Original link
    image?: string;  // Cover image URL
    timestamp: number;
    author?: string;
}

export class TunaService {
    private client: SuiClient;

    constructor() {
        this.client = new SuiClient({ url: CONFIG.RPC });
    }

    /**
     * Fetches the latest N articles from the TUNA protocol.
     */
    async getLatestNews(limit: number = 20): Promise<TunaArticle[]> {
        try {
            // 1. Fetch the Registry Object from Sui
            // We request the 'showContent' option to see the fields inside.
            const registry = await this.client.getObject({
                id: CONFIG.REGISTRY_ID,
                options: { showContent: true }
            });

            if (!registry.data?.content || registry.data.content.dataType !== 'moveObject') {
                throw new Error('Failed to fetch valid Registry object from Sui');
            }

            // 2. Extract the list of Blob IDs from the Move struct
            // The contract field is named 'latest_blobs'
            const fields = registry.data.content.fields as any;
            const allBlobIds = fields.latest_blobs as string[];

            console.log(`TUNA Registry contains ${allBlobIds.length} total articles.`);

            // 3. Get the most recent IDs
            // The contract appends new items to the end.
            // So we slice from the end (-limit) and reverse to get Newest First.
            const recentBlobIds = allBlobIds.slice(-limit).reverse();

            // 4. Fetch the actual content from Walrus in parallel
            const articles = await Promise.all(
                recentBlobIds.map(id => this.fetchFromWalrus(id))
            );

            // Filter out any failed fetches (nulls)
            return articles.filter(a => a !== null) as TunaArticle[];

        } catch (error) {
            console.error('Error fetching TUNA news:', error);
            return [];
        }
    }

    /**
     * Helper to fetch a single blob from Walrus
     */
    private async fetchFromWalrus(blobId: string): Promise<TunaArticle | null> {
        try {
            const response = await fetch(`${CONFIG.WALRUS_GATEWAY}/${blobId}`);
            
            if (!response.ok) {
                console.warn(`Walrus fetch failed for ${blobId}: ${response.status}`);
                return null;
            }
            
            const data = await response.json();
            return data as TunaArticle;
        } catch (error) {
            console.warn(`Failed to parse article ${blobId}`, error);
            return null;
        }
    }
}
```

### 3. Usage Example

```typescript
import { TunaService } from './tunaService';

const newsFeed = new TunaService();

async function displayNews() {
    console.log("Fetching latest news...");
    const articles = await newsFeed.getLatestNews(5);
    
    articles.forEach(article => {
        console.log(`[${article.source}] ${article.title}`);
        console.log(`Link: ${article.url}\n`);
    });
}

displayNews();
```

---

## ❓ FAQ & Troubleshooting

**Q: Do I need a Sui wallet to fetch news?**
A: **No.** Reading from the blockchain is public. You do not need to sign any transactions or hold SUI tokens.

**Q: Why don't I need the Package ID?**
A: The Package ID is only required if you invoke a Move function (write operation). Since you are only reading the state of a Shared Object (the Registry), the Object ID is sufficient.

**Q: What if the Walrus gateway is slow?**
A: The example uses the public testnet aggregator. For production apps, you might want to run your own local aggregator or cache the JSON responses on your own backend to ensure low latency.

**Q: Is the image URL always valid?**
A: Most image URLs are standard web links (https). However, some might be raw blob references. You should check if the `image` field is present before rendering.
