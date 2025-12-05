import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { NewsArticle } from '../types';

interface JustInSidebarProps {
    articles: NewsArticle[];
}

export default function JustInSidebar({ articles }: JustInSidebarProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Only animate if there are children to animate
        if (containerRef.current && containerRef.current.children.length > 0) {
            // Convert HTMLCollection to Array for cleaner GSAP handling
            const children = Array.from(containerRef.current.children);

            gsap.fromTo(children,
                { x: 20, opacity: 0 },
                { x: 0, opacity: 1, stagger: 0.05, duration: 0.4, delay: 0.5, clearProps: 'all' }
            );
        }
    }, [articles]);

    return (
        <div className="card-brutal" style={{ height: '100%', borderColor: 'transparent', boxShadow: 'none' }}>
            <h3 style={{
                borderBottom: '4px solid var(--border-color)',
                paddingBottom: '0.5rem',
                marginBottom: '1.5rem',
                textTransform: 'uppercase',
                color: 'var(--accent-secondary)', // Pink accent for "Breaking" vibe
                fontSize: '1.5rem'
            }}>
                Just In
            </h3>

            <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {articles.slice(0, 8).map((article) => (
                    <div key={article.id} className="just-in-item" style={{
                        paddingBottom: '1rem',
                        borderBottom: '1px solid rgba(71, 85, 105, 0.4)'
                    }}>
                        <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--accent-primary)',
                            fontWeight: 700,
                            display: 'block',
                            marginBottom: '0.4rem',
                            fontFamily: 'var(--font-mono)'
                        }}>
                            {new Date(Number(article.timestamp)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <Link to={`/article/${article.id}`} style={{
                            color: 'var(--text-main)',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            lineHeight: 1.4,
                            display: 'block',
                            textDecoration: 'none'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-secondary)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                        >
                            {article.title}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
