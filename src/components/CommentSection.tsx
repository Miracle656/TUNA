import { useState } from 'react';
import { useCurrentAccount, ConnectModal } from '@mysten/dapp-kit'; // Back to standard hook
// useConnectWallet, useWallets,
import { useArticleComments, usePostComment } from '../hooks/useComments';

interface CommentSectionProps {
    articleId: string;
}

export default function CommentSection({ articleId }: CommentSectionProps) {
    const { data: comments, isLoading } = useArticleComments(articleId);
    const { mutate: postComment, isPending } = usePostComment();
    const account = useCurrentAccount();
    const [commentText, setCommentText] = useState('');
    const [open, setOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        postComment({ blobId: articleId, text: commentText }, {
            onSuccess: () => {
                setCommentText('');
            },
            onError: (err) => {
                console.error("Failed to post comment:", err);
                alert("Failed to post comment. See console for details.");
            }
        });
    };

    return (
        <div className="comments-section" style={{ marginTop: '4rem' }}>
            <h3 style={{
                fontSize: '2rem',
                textTransform: 'uppercase',
                marginBottom: '2rem',
                borderBottom: '4px solid var(--border-color)',
                paddingBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
            }}>
                Comments <span style={{
                    fontSize: '1rem',
                    background: 'var(--text-main)',
                    color: 'var(--bg-deep)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px'
                }}>{comments?.length || 0}</span>
            </h3>

            {/* Comment Form */}
            <div className="comment-form card-brutal" style={{ marginBottom: '3rem', background: 'var(--bg-card)' }}>
                {!account ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Login to join the conversation.</p>
                        <ConnectModal
                            trigger={
                                <button className="btn-primary" style={{ padding: '0.8rem 2rem' }}>
                                    GET STARTED
                                </button>
                            }
                            open={open}
                            onOpenChange={setOpen}
                        />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="What are your thoughts on this story?"
                            maxLength={280}
                            style={{
                                width: '100%',
                                minHeight: '100px',
                                padding: '1rem',
                                background: 'var(--bg-deep)',
                                border: '2px solid var(--border-color)',
                                color: 'var(--text-main)',
                                fontSize: '1rem',
                                marginBottom: '1rem',
                                resize: 'vertical',
                                outline: 'none',
                                fontFamily: 'var(--font-mono)'
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: commentText.length > 250 ? 'var(--accent-secondary)' : 'var(--text-muted)' }}>
                                {commentText.length}/280
                            </span>
                            <button
                                type="submit"
                                disabled={!commentText.trim() || isPending}
                                className="btn-primary"
                                style={{
                                    border: '2px solid black',
                                    boxShadow: '4px 4px 0 black',
                                    opacity: isPending ? 0.7 : 1
                                }}
                            >
                                {isPending ? 'POSTING...' : 'POST COMMENT'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Comments List */}
            <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {isLoading ? (
                    <div className="spinner"></div>
                ) : comments && comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="comment-item" style={{
                            padding: '1.5rem',
                            border: '2px solid var(--border-color)',
                            background: 'var(--bg-deep)',
                            boxShadow: '4px 4px 0 var(--border-color)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{
                                    fontWeight: 700,
                                    color: 'var(--accent-primary)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.9rem'
                                }}>
                                    {comment.author.slice(0, 6)}...{comment.author.slice(-4)}
                                </span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    {new Date(comment.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                            <p style={{ fontSize: '1rem', lineHeight: 1.5, color: 'var(--text-main)' }}>
                                {comment.text}
                            </p>
                        </div>
                    ))
                ) : (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                        No comments yet. Be the first to share your thoughts!
                    </p>
                )}
            </div>
        </div>
    );
}
