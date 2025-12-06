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
        <header ref={headerRef} className="app-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'clamp(1rem, 3vw, 1.5rem) clamp(1rem, 3vw, 2rem)',
            borderBottom: '4px solid black',
            background: 'var(--bg-deep)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            gap: '1rem',
            flexWrap: 'wrap'
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

            <nav className="header-nav" style={{
                display: 'flex',
                gap: 'clamp(0.5rem, 2vw, 2rem)',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'flex-end'
            }}>
                <a href="#latest" className="nav-link" style={{
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    textDecoration: 'none',
                    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)'
                }}>LATEST</a>
                <a href="#trending" className="nav-link" style={{
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    textDecoration: 'none',
                    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)'
                }}>TRENDING</a>

                {account ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
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
                )}
            </nav>
        </header>
    );
}
