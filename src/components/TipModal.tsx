import { useState, useEffect } from 'react'
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { createTipArticleTransaction, suiToMist, isValidTipAmount } from '../lib/sui'
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
            alert('Minimum tip amount is 0.001 SUI')
            return
        }

        setIsSubmitting(true)

        try {
            const tx = createTipArticleTransaction(articleId, amountInMist)

            signAndExecute(
                { transaction: tx },
                {
                    onSuccess: () => {
                        alert(`Successfully tipped ${tipAmount} SUI!`)
                        onClose()
                    },
                    onError: (error: any) => {
                        console.error('Tip failed:', error)
                        alert('Failed to send tip. Please try again.')
                        setIsSubmitting(false)
                    },
                }
            )
        } catch (error) {
            console.error('Error creating tip transaction:', error)
            alert('Failed to create transaction')
            setIsSubmitting(false)
        }
    }

    return (
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
    )
}
