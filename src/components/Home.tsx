import { useLatestNews } from '../hooks/useNews'
import Header from './Header'
import NewsCard from './NewsCard'
import JustInSidebar from './JustInSidebar'
import { Link } from 'react-router-dom';

export default function Home() {
    const { data: articles, isLoading, error } = useLatestNews(50)

    // Split content: First article is Hero, next 8 are sidebar, rest are grid
    const heroArticle = articles?.[0];
    const sidebarArticles = articles?.slice(1, 9) || [];
    const feedArticles = articles?.slice(9) || [];

    return (
        <div className="home-page" style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1
        }}>
            <Header />

            <main className="container" style={{
                width: '100%',
                maxWidth: '1600px',
                margin: '0 auto',
                padding: '0 1rem',
                paddingBottom: '4rem',
                boxSizing: 'border-box'
            }}>

                {/* ROW 1: HERO SECTION (Full Width) */}
                <div style={{ marginBottom: 'clamp(2rem, 5vw, 4rem)', width: '100%' }}>
                    {isLoading ? (
                        <div className="card-brutal" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Loading Tuna Feed...
                        </div>
                    ) : error ? (
                        <div className="card-brutal" style={{ borderColor: 'var(--accent-secondary)' }}>
                            Error: {error.message}
                        </div>
                    ) : heroArticle ? (
                        <div className="hero-card card-brutal" style={{
                            width: '100%',
                            minHeight: 'clamp(400px, 60vh, 600px)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 1) 10%, rgba(15, 23, 42, 0.4) 100%), url(${heroArticle.image || 'https://placehold.co/800x400?text=Tuna'})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            padding: 'clamp(1.5rem, 5vw, 5rem)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
                                <div style={{
                                    display: 'inline-block',
                                    backgroundColor: 'var(--accent-primary)',
                                    color: 'black',
                                    padding: 'clamp(0.4rem, 1vw, 0.5rem) clamp(0.8rem, 2vw, 1rem)',
                                    fontWeight: 800,
                                    fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                                    marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
                                    border: '2px solid black',
                                    boxShadow: '4px 4px 0 black'
                                }}>
                                    TOP STORY
                                </div>

                                <h2 style={{
                                    fontSize: 'clamp(1.75rem, 5vw, 5rem)',
                                    marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
                                    color: 'white',
                                    textShadow: '4px 4px 0 #000',
                                    lineHeight: 1.1,
                                    maxWidth: '1200px',
                                    wordWrap: 'break-word'
                                }}>
                                    {heroArticle.title}
                                </h2>

                                <Link to={`/article/${heroArticle.id}`}
                                    className="btn-primary"
                                    style={{
                                        textDecoration: 'none',
                                        display: 'inline-block',
                                        padding: 'clamp(1rem, 2vw, 1.25rem) clamp(1.5rem, 3vw, 2.5rem)',
                                        fontWeight: 800,
                                        fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                                        border: '2px solid black',
                                        boxShadow: '6px 6px 0 black',
                                        cursor: 'pointer'
                                    }}>
                                    READ STORY ↗
                                </Link>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* ROW 2: MAIN CONTENT COLUMNS */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 'clamp(2rem, 4vw, 4rem)',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap'
                }}>

                    {/* LEFT: NEWS GRID */}
                    <div style={{ flex: '999 1 700px', minWidth: '0' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
                            paddingBottom: '1rem',
                            borderBottom: '4px solid var(--border-color)'
                        }}>
                            <h2 style={{
                                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                                textTransform: 'uppercase',
                                margin: 0
                            }}>Latest News</h2>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(min(350px, 100%), 1fr))',
                            gap: 'clamp(1.5rem, 3vw, 2.5rem)'
                        }}>
                            {feedArticles.map((article) => (
                                <NewsCard key={article.id} article={article} />
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: SIDEBAR */}
                    <div style={{ flex: '1 1 350px', minWidth: '0', maxWidth: '100%', width: '100%' }}>
                        <JustInSidebar articles={sidebarArticles} />
                    </div>

                </div>

            </main>
        </div>
    )
}
