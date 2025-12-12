import type { NewsArticle } from '../types';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
    article: NewsArticle;
}

import { getProxiedImageUrl } from '../lib/utils';

export default function HeroSection({ article }: HeroSectionProps) {
    const bgImage = article.image
        ? getProxiedImageUrl(article.image)
        : `https://placehold.co/1200x600/000000/FFF?text=${article.category || 'Featured Story'}`;

    return (
        <div className="hero-section" style={{
            position: 'relative',
            width: '100%',
            height: '500px',
            marginBottom: '3rem',
            border: '4px solid black',
            boxShadow: '8px 8px 0 black',
            overflow: 'hidden',
            background: 'var(--bg-card)',
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
            {/* Background overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%)',
                zIndex: 1,
            }} />

            {/* Content */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '3rem',
                zIndex: 2,
            }}>
                {/* TOP STORY Badge */}
                <div style={{
                    display: 'inline-block',
                    background: 'var(--accent-primary)',
                    color: 'black',
                    padding: '0.5rem 1rem',
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    letterSpacing: '2px',
                    marginBottom: '1.5rem',
                    border: '2px solid black',
                    boxShadow: '4px 4px 0 black',
                }}>
                    TOP STORY
                </div>

                {/* Headline */}
                <h1 style={{
                    fontSize: '3.5rem',
                    fontWeight: 900,
                    lineHeight: 1.1,
                    marginBottom: '1.5rem',
                    color: 'white',
                    textShadow: '4px 4px 0 black',
                    maxWidth: '900px',
                }}>
                    {article.title}
                </h1>

                {/* Description */}
                {article.content && (
                    <p style={{
                        fontSize: '1.2rem',
                        lineHeight: 1.6,
                        marginBottom: '2rem',
                        color: 'var(--text-muted)',
                        maxWidth: '700px',
                    }}>
                        {article.content.substring(0, 200)}...
                    </p>
                )}

                {/* Read Story Button */}
                <Link
                    to={`/article/${article.blob_id}`}
                    className="btn-primary"
                    style={{
                        display: 'inline-block',
                        padding: '1rem 2.5rem',
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        textDecoration: 'none',
                    }}
                >
                    READ STORY ↗
                </Link>
            </div>
        </div>
    );
}
