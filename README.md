# Sui Pulse - Frontend

A decentralized news aggregator for the Sui ecosystem built with React, TypeScript, and Vite.

## Features

- 📰 **News Aggregation**: Fetch and display news from the Sui ecosystem
- 💰 **Article Tipping**: Tip articles with custom SUI amounts
- 💬 **Comments**: Post comments on articles (short or long with Walrus storage)
- 🎁 **Comment Tipping**: Tip individual comments
- 🔗 **Hybrid Storage**: Short content on-chain, long content on Walrus
- 🎨 **Modern UI**: Built with React 19 and TypeScript

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Blockchain**: Sui Network (Testnet)
- **Storage**: Walrus (Decentralized blob storage)
- **State Management**: TanStack Query (React Query)
- **Wallet**: @mysten/dapp-kit

## Prerequisites

- Node.js 18+ and npm
- A Sui wallet (Sui Wallet browser extension)
- Testnet SUI tokens

## Installation

1. **Clone and install dependencies**:
```bash
cd tuna
npm install
```

2. **Create environment file**:
```bash
cp .env.example .env.local
```

The `.env.local` file is already configured with the deployed contract addresses:
```env
VITE_PACKAGE_ID=0xc19c25a9e42f77c2466a1df42d99a160a65a8800711eef447bb8da441df33c9e
VITE_REGISTRY_ID=0x65fa3ee1fa53af68c36dd47b525392dfb844726af980f758c1b6dc353a30e962
```

3. **Start the development server**:
```bash
npm run dev
```

## Project Structure

```
tuna/
├── src/
│   ├── components/        # React components
│   │   ├── NewsCard.tsx
│   │   ├── CommentSection.tsx
│   │   ├── TipModal.tsx
│   │   └── ...
│   ├── hooks/            # Custom React hooks
│   │   ├── useNews.ts
│   │   └── useComments.ts
│   ├── lib/              # Utilities
│   │   ├── sui.ts        # Sui transaction builders
│   │   └── walrus.ts     # Walrus integration
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── config/           # Configuration
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── .env.example          # Environment template
└── package.json
```

## Usage

### Fetching News

```typescript
import { useLatestNews } from './hooks/useNews';

function NewsFeed() {
  const { data: articles, isLoading } = useLatestNews(50);
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {articles?.map(article => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
}
```

### Tipping an Article

```typescript
import { useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { createTipArticleTransaction, suiToMist } from './lib/sui';

function TipButton({ blobId }: { blobId: string }) {
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
  
  const handleTip = (amountInSui: number) => {
    const tx = createTipArticleTransaction(blobId, suiToMist(amountInSui));
    signAndExecute({ transactionBlock: tx });
  };
  
  return <button onClick={() => handleTip(0.1)}>Tip 0.1 SUI</button>;
}
```

### Posting a Comment

```typescript
import { createPostCommentTransaction } from './lib/sui';

function CommentForm({ blobId }: { blobId: string }) {
  const [text, setText] = useState('');
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
  
  const handleSubmit = () => {
    const tx = createPostCommentTransaction(blobId, text);
    signAndExecute({ transactionBlock: tx });
  };
  
  return (
    <div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleSubmit}>Post Comment</button>
    </div>
  );
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contract Integration

The frontend integrates with the deployed Sui smart contract:

**Package ID**: `0xc19c25a9e42f77c2466a1df42d99a160a65a8800711eef447bb8da441df33c9e`  
**Registry ID**: `0x65fa3ee1fa53af68c36dd47b525392dfb844726af980f758c1b6dc353a30e962`

### Available Functions

- `tip_article(registry, blob_id, payment)` - Tip an article
- `post_comment(registry, blob_id, text)` - Post short comment
- `post_comment_with_blob(...)` - Post long/media comment
- `tip_comment(comment, payment)` - Tip a comment
- `withdraw_comment_tips(comment)` - Withdraw your tips

## Walrus Integration

The app uses Walrus for decentralized storage:

- **Publisher**: `https://publisher.walrus-testnet.walrus.space/v1/store`
- **Aggregator**: `https://aggregator.walrus-testnet.walrus.space/v1`

### Uploading to Walrus

```typescript
import { uploadToWalrus } from './lib/walrus';

const content = {
  title: "Article Title",
  content: "Full article content...",
  timestamp: Date.now()
};

const blobId = await uploadToWalrus(content);
```

## Development Roadmap

- [x] Basic news feed
- [x] Article tipping
- [x] Comment system
- [x] Hybrid storage
- [ ] User profiles
- [ ] Search functionality
- [ ] Category filtering
- [ ] Trending articles
- [ ] Notifications
- [ ] Dark mode

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Support

For issues or questions:
- GitHub Issues
- Sui Discord
- Documentation: [Sui Docs](https://docs.sui.io)

---

**Built with ❤️ for the Sui ecosystem**
