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
                <div style={{ marginBottom: '4rem', width: '100%' }}>
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
                            minHeight: '600px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 1) 10%, rgba(15, 23, 42, 0.4) 100%), url(${heroArticle.image || 'https://placehold.co/800x400?text=Tuna'})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            padding: 'clamp(2rem, 5vw, 5rem)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
                                <div style={{
                                    display: 'inline-block',
                                    backgroundColor: 'var(--accent-primary)',
                                    color: 'black',
                                    padding: '0.5rem 1rem',
                                    fontWeight: 800,
                                    fontSize: '1rem',
                                    marginBottom: '1.5rem',
                                    border: '2px solid black',
                                    boxShadow: '4px 4px 0 black'
                                }}>
                                    TOP STORY
                                </div>

                                <h2 style={{
                                    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                                    marginBottom: '2rem',
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
                                        padding: '1.25rem 2.5rem',
                                        fontWeight: 800,
                                        fontSize: '1.2rem',
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
                    gap: '4rem',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap'
                }}>

                    {/* LEFT: NEWS GRID */}
                    <div style={{ flex: '999 1 700px', minWidth: '300px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '2rem',
                            paddingBottom: '1rem',
                            borderBottom: '4px solid var(--border-color)'
                        }}>
                            <h2 style={{ fontSize: '2.5rem', textTransform: 'uppercase', margin: 0 }}>Latest News</h2>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                            gap: '2.5rem'
                        }}>
                            {feedArticles.map((article) => (
                                <NewsCard key={article.id} article={article} />
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: SIDEBAR */}
                    <div style={{ flex: '1 1 350px', minWidth: '300px', maxWidth: '400px' }}>
                        <JustInSidebar articles={sidebarArticles} />
                    </div>

                </div>

            </main>
        </div>
    )
}
