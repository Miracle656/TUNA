import { useState, useEffect } from 'react'
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { createTipArticleTransaction, suiToMist, isValidTipAmount } from '../lib/sui'
import Toast from './Toast'
import './TipModal.css'

interface TipModalProps {
    isOpen: boolean
    articleId: string
    articleTitle: string
    onClose: () => void
}

export default function TipModal({ isOpen, articleId, articleTitle, onClose }: TipModalProps) {
    const [amount, setAmount] = useState(0.01)
    const [customAmount, setCustomAmount] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
    const { mutate: signAndExecute } = useSignAndExecuteTransaction()

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setAmount(0.01)
            setCustomAmount('')
            setIsSubmitting(false)
        }
    }, [isOpen])

    if (!isOpen) return null

    const quickAmounts = [0.01, 0.05, 0.1, 0.5, 1]

    const handleTip = async () => {
        const tipAmount = customAmount ? parseFloat(customAmount) : amount
        const amountInMist = suiToMist(tipAmount)

        if (!isValidTipAmount(amountInMist)) {
            setToast({ message: 'Minimum tip amount is 0.001 SUI', type: 'error' })
            return
        }

        setIsSubmitting(true)

        try {
            const tx = createTipArticleTransaction(articleId, amountInMist)

            signAndExecute(
                { transaction: tx },
                {
                    onSuccess: () => {
                        setToast({ message: `Successfully tipped ${tipAmount} SUI!`, type: 'success' })
                        setTimeout(() => onClose(), 2000)
                    },
                    onError: (error: any) => {
                        console.error('Tip failed:', error)
                        setToast({ message: 'Failed to send tip. Please try again.', type: 'error' })
                        setIsSubmitting(false)
                    },
                }
            )
        } catch (error) {
            console.error('Error creating tip transaction:', error)
            setToast({ message: 'Failed to create transaction', type: 'error' })
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>💰 Tip this Article</h2>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>

                    <div className="modal-body">
                        <p className="article-title">{articleTitle}</p>

                        <div className="quick-amounts">
                            <p className="section-label">Quick amounts:</p>
                            <div className="amount-buttons">
                                {quickAmounts.map((amt) => (
                                    <button
                                        key={amt}
                                        className={`amount-btn ${amount === amt && !customAmount ? 'active' : ''}`}
                                        onClick={() => {
                                            setAmount(amt)
                                            setCustomAmount('')
                                        }}
                                    >
                                        {amt} SUI
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="custom-amount">
                            <p className="section-label">Or enter custom amount:</p>
                            <div className="input-group">
                                <input
                                    type="number"
                                    min="0.001"
                                    step="0.001"
                                    value={customAmount}
                                    onChange={(e) => setCustomAmount(e.target.value)}
                                    placeholder="0.000"
                                    className="amount-input"
                                />
                                <span className="input-suffix">SUI</span>
                            </div>
                            <p className="hint">Minimum: 0.001 SUI</p>
                        </div>

                        <div className="tip-summary">
                            <div className="summary-row">
                                <span>Tip Amount:</span>
                                <span className="amount-value">
                                    {customAmount || amount} SUI
                                </span>
                            </div>
                            <div className="summary-row">
                                <span>Gas Fee:</span>
                                <span className="amount-value">~0.001 SUI</span>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleTip}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Processing...' : 'Send Tip'}
                        </button>
                    </div>
                </div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    )
}
