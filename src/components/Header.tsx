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

    // GSAP Animation for Entrance
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
            padding: '1.5rem 2rem',
            borderBottom: '4px solid black',
            background: 'var(--bg-deep)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            {/* Logo */}
            <div className="logo-container">
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <h1 style={{
                        fontSize: '3rem',
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
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '2px',
                    color: 'var(--text-muted)'
                }}>
                    SUI ECOSYSTEM NEWS
                </span>
            </div>

            {/* Navigation / Actions */}
            <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <a href="#latest" style={{
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    textDecoration: 'none',
                    fontSize: '1.1rem'
                }}>LATEST</a>
                <a href="#trending" style={{
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    textDecoration: 'none',
                    fontSize: '1.1rem'
                }}>TRENDING</a>

                {account ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                            {account.address.slice(0, 6)}...{account.address.slice(-4)}
                        </span>
                        <button
                            onClick={() => disconnect()}
                            className="btn-brutal"
                            style={{
                                padding: '0.8rem 1.5rem',
                                fontSize: '0.9rem',
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
                                className="btn-primary" // Use the primary "brutal" button style
                                style={{
                                    padding: '0.8rem 2rem',
                                    fontSize: '1.1rem',
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
