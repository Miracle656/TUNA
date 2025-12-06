export default function Footer() {
    return (
        <footer style={{
            background: 'var(--bg-deep)',
            borderTop: '4px solid black',
            marginTop: 'auto',
            padding: 'clamp(3rem, 5vw, 5rem) clamp(1rem, 3vw, 2rem)',
        }}>
            <div style={{
                maxWidth: '1600px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 'clamp(2rem, 4vw, 4rem)',
            }}>
                {/* Left: Logo & Tagline */}
                <div>
                    <h3 style={{
                        fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                        fontWeight: 900,
                        letterSpacing: '-2px',
                        marginBottom: '1rem',
                        color: 'var(--text-main)',
                        textShadow: '3px 3px 0 var(--accent-primary)',
                    }}>
                        TUNA<span style={{ color: 'var(--accent-primary)', textShadow: 'none' }}>.</span>
                    </h3>
                    <p style={{
                        fontSize: '0.9rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.6,
                        maxWidth: '300px',
                    }}>
                        Your decentralized source for Sui ecosystem news. Powered by Walrus storage and on-chain verification.
                    </p>
                </div>

                {/* Middle: Navigation Links */}
                <div>
                    <h4 style={{
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        marginBottom: '1.5rem',
                        color: 'var(--text-main)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                    }}>
                        About
                    </h4>
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                    }}>
                        {['How It Works', 'Smart Contract', 'Walrus Storage', 'Team'].map((item) => (
                            <li key={item}>
                                <a
                                    href="#"
                                    style={{
                                        color: 'var(--text-muted)',
                                        textDecoration: 'none',
                                        fontSize: '0.9rem',
                                        transition: 'color 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                >
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right: Social & Contact */}
                <div>
                    <h4 style={{
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        marginBottom: '1.5rem',
                        color: 'var(--text-main)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                    }}>
                        Connect
                    </h4>
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                    }}>
                        {[
                            { label: '𝕏 Twitter', href: 'https://twitter.com' },
                            { label: '📱 Telegram', href: 'https://telegram.org' },
                            { label: '💬 Discord', href: 'https://discord.com' },
                            { label: '📧 Email', href: 'mailto:hello@tuna.news' },
                        ].map((item) => (
                            <li key={item.label}>
                                <a
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        color: 'var(--text-muted)',
                                        textDecoration: 'none',
                                        fontSize: '0.9rem',
                                        transition: 'color 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Copyright */}
            <div style={{
                maxWidth: '1600px',
                margin: '0 auto',
                marginTop: 'clamp(3rem, 5vw, 4rem)',
                paddingTop: '2rem',
                borderTop: '2px solid var(--border-color)',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
            }}>
                <p style={{ margin: 0 }}>
                    Copyright ©2025 TUNA. All rights reserved. | Built on Sui
                </p>
            </div>
        </footer>
    );
}
