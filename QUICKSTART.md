# Sui Pulse - Quick Start Guide

## 🚀 Your Frontend is Ready!

The UI is now fully set up and running. Here's what you have:

### ✅ Components Built
- **App.tsx** - Main layout with three-column design
- **NewsCard.tsx** - Article display with engagement stats
- **TipModal.tsx** - Custom tip amount modal
- **Responsive Design** - Works on desktop, tablet, and mobile

### 🎨 Features
- Dark theme with modern UI
- Wallet connection (Sui Wallet)
- News feed (currently empty - needs data)
- Tip functionality (ready to use)
- Category and source filters
- Network stats sidebar

---

## 📝 Next Steps to See It Working

### 1. Add Test Data

Since there are no articles in the registry yet, you need to add some test data. You can do this in two ways:

#### Option A: Add via CLI (Recommended for testing)

```bash
# Make sure you're in the newscontract directory
cd ../newscontract

# Add a test article
sui client call \
  --package 0xc19c25a9e42f77c2466a1df42d99a160a65a8800711eef447bb8da441df33c9e \
  --module news_registry \
  --function add_news \
  --args \
    0x87c090e5a60dd505d3ef7634e6f32ced2134640f56b329946ab920a3a9299f6e \
    0x65fa3ee1fa53af68c36dd47b525392dfb844726af980f758c1b6dc353a30e962 \
    "test_article_1" \
    "General" \
    "rss" \
    "Sui Network Reaches New Milestone" \
  --gas-budget 10000000
```

#### Option B: Build the Backend Ingestion Pipeline

Create a script to:
1. Scrape news from Twitter/RSS
2. Upload to Walrus
3. Call `add_news()` on the contract

---

## 🧪 Testing the UI

### 1. Connect Your Wallet
- Click "Connect Wallet" in the header
- Select your Sui Wallet
- Make sure you're on testnet

### 2. View News Feed
- Once articles are added, they'll appear in the center column
- Click categories to filter (when implemented)

### 3. Tip an Article
- Click the "💰 Tip" button on any article
- Select a quick amount or enter custom
- Confirm the transaction in your wallet

---

## 🔧 Current Limitations & TODOs

### Data Fetching
The `useNews` hook currently tries to fetch from the registry, but:
- ❌ No articles exist yet (registry is empty)
- ⚠️ The hook needs to properly parse the VecMap structure from Sui

### To Fix:
1. Add test articles (see above)
2. Update `useNews.ts` to correctly parse the registry data structure
3. Or create mock data for development

### Missing Features
- [ ] Comment section (not yet implemented)
- [ ] Category filtering (UI ready, logic needed)
- [ ] Source filtering (UI ready, logic needed)
- [ ] Search functionality
- [ ] User profiles

---

## 💡 Quick Mock Data for Development

If you want to see the UI with fake data immediately, update `App.tsx`:

```typescript
// Add this mock data at the top of App.tsx
const mockArticles = [
  {
    id: '1',
    blob_id: 'mock_1',
    title: 'Sui Network Reaches 1 Billion Transactions',
    category: 'General',
    source: 'rss' as const,
    timestamp: Date.now() - 3600000,
    summary: 'The Sui blockchain has officially processed over 1 billion transactions, marking a significant milestone in its growth.',
    url: 'https://sui.io',
    image: 'https://via.placeholder.com/800x400',
    totalTips: 5000000,
    tipCount: 12,
    commentCount: 8,
  },
  {
    id: '2',
    blob_id: 'mock_2',
    title: 'New DeFi Protocol Launches on Sui',
    category: 'DeFi',
    source: 'twitter' as const,
    timestamp: Date.now() - 7200000,
    summary: 'A revolutionary new DeFi protocol has launched on Sui, offering innovative yield farming strategies.',
    totalTips: 3000000,
    tipCount: 7,
    commentCount: 15,
  },
];

// Then in the component, replace the useLatestNews hook:
// const { data: articles, isLoading } = useLatestNews(50);
const articles = mockArticles;
const isLoading = false;
```

---

## 📱 Viewing the App

The dev server should be running at:
```
http://localhost:5173
```

Open it in your browser and connect your Sui Wallet!

---

## 🎯 Production Checklist

Before deploying to production:

- [ ] Add real news data (backend pipeline)
- [ ] Fix data fetching from Sui registry
- [ ] Implement comment section
- [ ] Add error boundaries
- [ ] Optimize images (lazy loading)
- [ ] Add analytics
- [ ] SEO optimization
- [ ] Performance testing
- [ ] Security audit

---

## 🆘 Troubleshooting

### "No articles found"
- The registry is empty. Add test articles using the CLI command above.

### Wallet not connecting
- Make sure Sui Wallet extension is installed
- Switch to testnet in your wallet
- Refresh the page

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Check that all import paths are correct

---

**Your frontend is live and ready! 🎉**

Next: Add some test articles or build the backend ingestion pipeline!
