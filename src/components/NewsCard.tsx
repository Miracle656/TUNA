import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { type NewsArticle } from '../types';
import TipModal from './TipModal';
import './NewsCard.css';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

interface NewsCardProps {
    article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
    const [isTipModalOpen, setIsTipModalOpen] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Entrance animation
    useEffect(() => {
        // Kill any existing ScrollTrigger instances for this element to prevent memory leaks or conflicts
        const triggers = ScrollTrigger.getAll();
        triggers.forEach(trigger => {
            if (trigger.trigger === cardRef.current) {
                trigger.kill();
            }
        });

        gsap.fromTo(cardRef.current,
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.5, ease: "power2.out", scrollTrigger: {
                    trigger: cardRef.current,
                    start: "top 90%"
                }
            }
        );

        return () => {
            // Cleanup
            ScrollTrigger.getById(cardRef.current?.id || '')?.kill();
        };
    }, []);

    const handleMouseEnter = () => {
        if (!cardRef.current) return;
        gsap.to(cardRef.current, {
            y: -4,
            boxShadow: "6px 6px 0px #000",
            borderColor: "var(--accent-primary)",
            duration: 0.2,
            overwrite: true
        });
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        gsap.to(cardRef.current, {
            y: 0,
            boxShadow: "4px 4px 0px #000",
            borderColor: "#000",
            duration: 0.2,
            overwrite: true
        });
    };

    return (
        <>
            <div
                ref={cardRef}
                className="card-brutal"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    cursor: 'pointer',
                    position: 'relative'
                }}
            >
                {/* Make the whole card clickable via a Link wrapper would be best, but we have buttons inside */}
                {/* So we make the image and title link to the detail page */}

                {/* Category Tag */}
                <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    background: 'var(--accent-warning)',
                    color: 'black',
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    border: '2px solid black',
                    zIndex: 2,
                    fontFamily: 'var(--font-mono)'
                }}>
                    {article.category}
                </div>

                {/* Image */}
                <Link to={`/article/${article.id}`} style={{ display: 'block' }}>
                    {article.image && (
                        <div style={{
                            height: '240px',
                            background: `url(${article.image}) center/cover no-repeat`,
                            borderBottom: '2px solid black',
                            margin: '-1.5rem -1.5rem 1rem -1.5rem'
                        }} />
                    )}
                </Link>

                <Link to={`/article/${article.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{
                        fontSize: '1.4rem',
                        marginBottom: '0.5rem',
                        lineHeight: 1.25,
                        fontWeight: 700
                    }}>
                        {article.title}
                    </h3>
                </Link>

                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginBottom: '1rem',
                    fontFamily: 'var(--font-mono)'
                }}>
                    <span>{new Date(Number(article.timestamp)).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{article.source}</span>
                </div>

                <p style={{
                    fontSize: '1rem',
                    color: '#cbd5e1',
                    flex: 1,
                    marginBottom: '2rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.5
                }}>
                    {article.summary}
                </p>

                {/* Action Bar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto',
                    borderTop: '2px solid black',
                    paddingTop: '1rem',
                    marginLeft: '-1.5rem',
                    marginRight: '-1.5rem',
                    paddingLeft: '1.5rem',
                    paddingRight: '1.5rem',
                    background: 'rgba(15, 23, 42, 0.4)'
                }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button
                            className="btn-brutal secondary"
                            style={{ fontSize: '0.7rem', padding: '0.4rem 0.8rem' }}
                            onClick={(e) => {
                                e.preventDefault();
                                setIsTipModalOpen(true);
                            }}
                        >
                            💰 TIP
                        </button>
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                            {article.totalTips > 0 ? `${(article.totalTips / 1_000_000_000).toFixed(2)} SUI` : ''}
                        </span>
                    </div>

                    <Link
                        to={`/article/${article.id}`}
                        style={{
                            color: 'var(--accent-primary)',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                            textDecoration: 'none'
                        }}
                    >
                        READ ↗
                    </Link>
                </div>
            </div>

            <TipModal
                isOpen={isTipModalOpen}
                onClose={() => setIsTipModalOpen(false)}
                articleId={article.id}
                articleTitle={article.title}
            />
        </>
    );
}
