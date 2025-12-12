import { useParams, Link } from 'react-router-dom';
import { useArticle } from '../hooks/useNews';
import Header from './Header';
import TipModal from './TipModal';
import CommentSection from './CommentSection'; // Import the new component
import { useState } from 'react';

export default function ArticlePage() {
    const { id } = useParams();
    const { data: article, isLoading, error } = useArticle(id || '');
    const [isTipModalOpen, setIsTipModalOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="app">
                <Header />
                <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
                    <div className="spinner"></div>
                    <h2>Fetching Story...</h2>
                </div>
            </div>
        )
    }

    if (error || !article) {
        return (
            <div className="app">
                <Header />
                <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
                    <h2>⚠️ Article Not Found</h2>
                    <p>The story you are looking for does not exist or has been removed.</p>
                    <Link to="/" className="btn-brutal secondary" style={{ marginTop: '2rem', display: 'inline-block' }}>
                        &larr; Back to News
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="app">
            <Header />

            <main className="container" style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: '0 clamp(1rem, 3vw, 2rem) clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem)'
            }}>
                <Link to="/" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: 'clamp(1rem, 3vw, 2rem)',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                }}>
                    &larr; Back to Feed
                </Link>

                <article className="article-content card-brutal" style={{ padding: '0', overflow: 'hidden', width: '100%', maxWidth: '100%' }}>
                    {/* Header Image */}
                    {article.image && (
                        <div style={{
                            width: '100%',
                            height: 'clamp(250px, 40vh, 400px)',
                            backgroundImage: `url(${article.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderBottom: '2px solid black'
                        }} />
                    )}

                    <div style={{ padding: 'clamp(1.5rem, 5vw, 3rem)', maxWidth: '100%', boxSizing: 'border-box' }}>
                        {/* Meta Tags */}
                        <div style={{
                            display: 'flex',
                            gap: 'clamp(0.5rem, 2vw, 1rem)',
                            marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
                            flexWrap: 'wrap'
                        }}>
                            <span style={{
                                background: 'var(--accent-primary)',
                                color: 'black',
                                fontWeight: 800,
                                padding: 'clamp(0.25rem, 1vw, 0.25rem) clamp(0.5rem, 2vw, 0.75rem)',
                                border: '2px solid black',
                                fontSize: 'clamp(0.75rem, 2vw, 0.9rem)'
                            }}>
                                {article.category || 'NEWS'}
                            </span>
                            <span style={{
                                color: 'var(--text-muted)',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: 'clamp(0.75rem, 2vw, 1rem)'
                            }}>
                                {new Date(Number(article.timestamp)).toLocaleDateString(undefined, {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 style={{
                            fontSize: 'clamp(1.75rem, 5vw, 3.5rem)',
                            lineHeight: 1.1,
                            marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
                            color: 'var(--text-main)',
                            textShadow: '2px 2px 0 #000',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word',
                            maxWidth: '100%',
                            width: '100%'
                        }}>
                            {article.title}
                        </h1>

                        {/* Author/Source */}
                        <div style={{
                            padding: 'clamp(0.75rem, 2vw, 1rem)',
                            background: 'var(--bg-deep)',
                            border: '2px solid var(--border-color)',
                            marginBottom: 'clamp(2rem, 4vw, 3rem)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 'clamp(0.75rem, 2vw, 1rem)'
                        }}>
                            <div>
                                <span style={{
                                    color: 'var(--text-muted)',
                                    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
                                }}>Source: </span>
                                <a href={article.url} target="_blank" rel="noopener noreferrer" style={{
                                    fontWeight: 800,
                                    color: 'var(--accent-primary)',
                                    fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                                    wordBreak: 'break-word'
                                }}>
                                    {article.source} ↗
                                </a>
                            </div>

                            <div className="action-buttons" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <button
                                    className="btn-brutal secondary"
                                    onClick={() => setIsTipModalOpen(true)}
                                    style={{
                                        fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
                                        padding: 'clamp(0.6rem, 1.5vw, 0.75rem) clamp(1rem, 2vw, 1.5rem)'
                                    }}
                                >
                                    💰 TIP AUTHOR
                                </button>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div className="article-body">
                            <div dangerouslySetInnerHTML={{ __html: article.content || '<p>No content available.</p>' }} />
                        </div>

                        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
                            <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{
                                display: 'inline-block',
                                padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem)',
                                textDecoration: 'none',
                                fontWeight: 800,
                                border: '2px solid black',
                                boxShadow: '4px 4px 0 black',
                                fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                            }}>
                                Check Original Website ↗
                            </a>
                        </div>
                    </div>
                </article>

                {/* Comment Section Integration */}
                <CommentSection articleId={article.id} />

            </main>

            <TipModal
                isOpen={isTipModalOpen}
                onClose={() => setIsTipModalOpen(false)}
                articleId={article.id}
                articleTitle={article.title}
            />
        </div>
    );
}
