import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useCurrentAccount, useDisconnectWallet, ConnectModal } from '@mysten/dapp-kit';
// useConnectWallet, useWallets,
import { Link } from 'react-router-dom';

export default function Header() {
    const headerRef = useRef<HTMLElement>(null);
    const account = useCurrentAccount();
    const { mutate: disconnect } = useDisconnectWallet();
    const [open, setOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(headerRef.current, {
                y: -100,
                opacity: 0,
                duration: 1,
                ease: "power4.out"
            });
        }, headerRef);

        return () => ctx.revert();
    }, []);

    return (
        <>
            <header ref={headerRef} className="app-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'clamp(1rem, 3vw, 1.5rem) clamp(1rem, 3vw, 2rem)',
                borderBottom: '4px solid black',
                background: 'var(--bg-deep)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div className="logo-container">
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 5vw, 3rem)',
                            fontWeight: 900,
                            letterSpacing: '-2px',
                            lineHeight: 1,
                            margin: 0,
                            color: 'var(--text-main)',
                            textShadow: '4px 4px 0 var(--accent-primary)'
                        }}>
                            TUNA<span style={{ color: 'var(--accent-primary)', textShadow: 'none' }}>.</span>
                        </h1>
                    </Link>
                    <span style={{
                        display: 'block',
                        fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '2px',
                        color: 'var(--text-muted)'
                    }}>
                        SUI ECOSYSTEM NEWS
                    </span>
                </div>

                {/* Desktop Navigation */}
                <nav className="header-nav" style={{
                    display: 'flex',
                    gap: 'clamp(0.5rem, 2vw, 2rem)',
                    alignItems: 'center'
                }}>
                    <a href="#latest" className="nav-link" style={{
                        fontWeight: 700,
                        color: 'var(--text-main)',
                        textDecoration: 'none',
                        fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                        display: 'none'
                    }}>LATEST</a>
                    <a href="#trending" className="nav-link" style={{
                        fontWeight: 700,
                        color: 'var(--text-main)',
                        textDecoration: 'none',
                        fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                        display: 'none'
                    }}>TRENDING</a>

                    {account ? (
                        <div className="desktop-account" style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="account-address" style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)'
                            }}>
                                {account.address.slice(0, 6)}...{account.address.slice(-4)}
                            </span>
                            <button
                                onClick={() => disconnect()}
                                className="btn-brutal"
                                style={{
                                    padding: 'clamp(0.6rem, 1.5vw, 0.8rem) clamp(1rem, 2vw, 1.5rem)',
                                    fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
                                    background: 'var(--bg-card)'
                                }}
                            >
                                LOGOUT
                            </button>
                        </div>
                    ) : (
                        <div className="desktop-connect" style={{ display: 'none' }}>
                            <ConnectModal
                                trigger={
                                    <button
                                        className="btn-primary"
                                        style={{
                                            padding: 'clamp(0.6rem, 1.5vw, 0.8rem) clamp(1rem, 2vw, 2rem)',
                                            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                                            fontWeight: 800
                                        }}
                                    >
                                        GET STARTED
                                    </button>
                                }
                                open={open}
                                onOpenChange={(isOpen) => setOpen(isOpen)}
                            />
                        </div>
                    )}

                    {/* Hamburger Menu Button (Mobile Only) */}
                    <button
                        className="hamburger-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            background: 'none',
                            border: '2px solid var(--accent-primary)',
                            padding: '0.5rem',
                            cursor: 'pointer',
                            width: '40px',
                            height: '40px',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        aria-label="Toggle menu"
                    >
                        <span style={{
                            width: '20px',
                            height: '2px',
                            background: 'var(--accent-primary)',
                            display: 'block',
                            transition: 'transform 0.3s'
                        }}></span>
                        <span style={{
                            width: '20px',
                            height: '2px',
                            background: 'var(--accent-primary)',
                            display: 'block',
                            transition: 'transform 0.3s'
                        }}></span>
                        <span style={{
                            width: '20px',
                            height: '2px',
                            background: 'var(--accent-primary)',
                            display: 'block',
                            transition: 'transform 0.3s'
                        }}></span>
                    </button>
                </nav>
            </header>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="mobile-menu-overlay"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.8)',
                        zIndex: 150,
                        display: 'flex',
                        justifyContent: 'flex-end'
                    }}
                >
                    <div
                        className="mobile-menu"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'var(--bg-card)',
                            width: '80%',
                            maxWidth: '300px',
                            height: '100%',
                            padding: '2rem',
                            borderLeft: '4px solid var(--border-color)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2rem',
                            animation: 'slideInRight 0.3s ease'
                        }}
                    >
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            style={{
                                alignSelf: 'flex-end',
                                background: 'var(--accent-secondary)',
                                border: '2px solid black',
                                width: '40px',
                                height: '40px',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold'
                            }}
                        >
                            ✕
                        </button>

                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <a
                                href="#latest"
                                onClick={() => setMobileMenuOpen(false)}
                                style={{
                                    fontWeight: 700,
                                    color: 'var(--text-main)',
                                    textDecoration: 'none',
                                    fontSize: '1.25rem',
                                    padding: '0.5rem 0',
                                    borderBottom: '2px solid var(--border-color)'
                                }}
                            >
                                LATEST
                            </a>
                            <a
                                href="#trending"
                                onClick={() => setMobileMenuOpen(false)}
                                style={{
                                    fontWeight: 700,
                                    color: 'var(--text-main)',
                                    textDecoration: 'none',
                                    fontSize: '1.25rem',
                                    padding: '0.5rem 0',
                                    borderBottom: '2px solid var(--border-color)'
                                }}
                            >
                                TRENDING
                            </a>

                            {account ? (
                                <>
                                    <div style={{
                                        padding: '1rem',
                                        background: 'var(--bg-deep)',
                                        border: '2px solid var(--border-color)',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '0.9rem',
                                        wordBreak: 'break-all'
                                    }}>
                                        {account.address.slice(0, 6)}...{account.address.slice(-4)}
                                    </div>
                                    <button
                                        onClick={() => {
                                            disconnect();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="btn-brutal"
                                        style={{
                                            width: '100%',
                                            background: 'var(--bg-surface)'
                                        }}
                                    >
                                        LOGOUT
                                    </button>
                                </>
                            ) : (
                                <ConnectModal
                                    trigger={
                                        <button
                                            className="btn-primary"
                                            style={{
                                                width: '100%',
                                                padding: '1rem',
                                                fontSize: '1rem',
                                                fontWeight: 800
                                            }}
                                        >
                                            GET STARTED
                                        </button>
                                    }
                                    open={open}
                                    onOpenChange={(isOpen) => {
                                        setOpen(isOpen);
                                        if (isOpen) setMobileMenuOpen(false);
                                    }}
                                />
                            )}
                        </nav>
                    </div>
                </div>
            )}

            <style>{`
                @media (min-width: 769px) {
                    .hamburger-btn {
                        display: none !important;
                    }
                    .nav-link,
                    .desktop-account,
                    .desktop-connect {
                        display: flex !important;
                    }
                }

                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
            `}</style>
        </>
    );
}
