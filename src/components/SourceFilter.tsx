import { useState } from 'react';

interface SourceFilterProps {
    onSourceChange: (source: string) => void;
    activeSource: string;
}

const sources = [
    { id: 'all', label: 'ALL SOURCES' },
    { id: '@SuiNetwork', label: '@SuiNetwork' },
    { id: '@Mysten_Labs', label: '@Mysten_Labs' },
    { id: '@SuiHubAfrica', label: '@SuiHubAfrica' },
    { id: 'rss', label: 'RSS FEEDS' },
];

export default function SourceFilter({ onSourceChange, activeSource }: SourceFilterProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* Dropdown Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn-brutal"
                style={{
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--bg-card)',
                }}
            >
                <span>📡</span>
                {sources.find(s => s.id === activeSource)?.label || 'ALL SOURCES'}
                <span style={{ fontSize: '0.7rem' }}>▼</span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className="card-brutal"
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 0.5rem)',
                        left: 0,
                        minWidth: '200px',
                        background: 'var(--bg-card)',
                        zIndex: 1000,
                        padding: '0.5rem',
                    }}
                >
                    {sources.map((source) => (
                        <button
                            key={source.id}
                            onClick={() => {
                                onSourceChange(source.id);
                                setIsOpen(false);
                            }}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                textAlign: 'left',
                                background: activeSource === source.id ? 'var(--accent-primary)' : 'transparent',
                                color: activeSource === source.id ? 'black' : 'var(--text-main)',
                                border: 'none',
                                fontWeight: activeSource === source.id ? 800 : 600,
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                if (activeSource !== source.id) {
                                    e.currentTarget.style.background = 'var(--bg-deep)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeSource !== source.id) {
                                    e.currentTarget.style.background = 'transparent';
                                }
                            }}
                        >
                            {source.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
