import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { NewsArticle } from '../types';
import TipModal from './TipModal';
import './NewsCard.css';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

interface NewsCardProps {
    article: NewsArticle;
    size?: 'regular' | 'featured' | 'compact';
}

export default function NewsCard({ article }: NewsCardProps) {
    const [isTipModalOpen, setIsTipModalOpen] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Entrance animation
    useEffect(() => {
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
                    minHeight: '400px',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundImage: article.image
                        ? `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%), url(${article.image})`
                        : 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-deep) 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '1.5rem',
                    justifyContent: 'flex-end',
                }}
            >
                {/* Category Tag */}
                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'var(--accent-warning)',
                    color: 'black',
                    padding: '0.3rem 0.7rem',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    border: '2px solid black',
                    boxShadow: '3px 3px 0 black',
                    zIndex: 2,
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase',
                }}>
                    {article.category}
                </div>

                {/* Content Container */}
                <div style={{
                    position: 'relative',
                    zIndex: 1,
                }}>
                    <Link to={`/article/${article.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h3 style={{
                            fontSize: 'clamp(1.2rem, 2vw, 1.6rem)',
                            marginBottom: '0.75rem',
                            lineHeight: 1.25,
                            fontWeight: 800,
                            color: 'white',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        }}>
                            {article.title}
                        </h3>
                    </Link>

                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        fontSize: '0.8rem',
                        color: 'rgba(255,255,255,0.8)',
                        marginBottom: '1rem',
                        fontFamily: 'var(--font-mono)',
                    }}>
                        <span>{new Date(Number(article.timestamp)).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{article.source}</span>
                    </div>

                    <p style={{
                        fontSize: '0.95rem',
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: '1.5rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.5,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                    }}>
                        {article.summary || article.content?.substring(0, 150) || 'No description available'}
                    </p>

                    {/* Action Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                    }}>
                        <button
                            onClick={() => setIsTipModalOpen(true)}
                            className="btn-brutal"
                            style={{
                                padding: '0.5rem 1rem',
                                fontSize: '0.85rem',
                                background: 'rgba(0,0,0,0.7)',
                                backdropFilter: 'blur(10px)',
                                border: '2px solid var(--accent-primary)',
                                color: 'var(--accent-primary)',
                            }}
                        >
                            💰 TIP
                        </button>

                        <Link
                            to={`/article/${article.id}`}
                            className="btn-brutal"
                            style={{
                                padding: '0.5rem 1rem',
                                fontSize: '0.85rem',
                                textDecoration: 'none',
                                background: 'var(--accent-primary)',
                                color: 'black',
                                border: '2px solid black',
                                boxShadow: '3px 3px 0 black',
                            }}
                        >
                            READ ↗
                        </Link>

                        <div style={{
                            marginLeft: 'auto',
                            display: 'flex',
                            gap: '1rem',
                            fontSize: '0.8rem',
                            color: 'rgba(255,255,255,0.8)',
                            fontFamily: 'var(--font-mono)',
                        }}>
                            <span>💬 {article.commentCount || 0}</span>
                            <span>💰 {article.totalTips || 0} SUI</span>
                        </div>
                    </div>
                </div>
            </div>

            {isTipModalOpen && (
                <TipModal
                    isOpen={isTipModalOpen}
                    articleId={article.id}
                    articleTitle={article.title}
                    onClose={() => setIsTipModalOpen(false)}
                />
            )}
        </>
    );
}
