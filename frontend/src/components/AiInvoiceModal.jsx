import React, { useEffect, useState } from 'react'
import { aiInvoiceModalStyles } from '../assets/dummyStyles'
import GeminiIcon from './GeminiIcon';
import AnimatedButton from '../assets/GenerateBtn/Gbtn'

const AiInvoiceModal = ({ open, onClose, onGenerate, initialText = " " }) => {
    const [text, settext] = useState(initialText || '')
    const [loading, setloading] = useState(false)
    const [error, seterror] = useState("")
    useEffect(() => {
        seterror('')
        settext(initialText || '')
        setloading(false)
    }, [open, initialText])
    if (!open) return null;
    async function handleGenerateClick() {
        seterror('');
        const raw = (text || "").trim();
        if (!raw) {
            seterror('Please paste invoice text to generate from AI')
            return;
        }
        try {
            setloading(true);
            const maybePromise = onGenerate && onGenerate(raw);
            if (maybePromise && typeof maybePromise.then === 'function') {
                await maybePromise;
            }
        } catch (error) {
            console.error('onGenrate handle failed', error);
            const msg = error && (error.message || (typeof error === 'string' ? error : JSON.stringify(error)));
            seterror(msg || 'Failed to generate Try again')
        } finally {
            setloading(false)
        }
    }

    return (
        <div className={aiInvoiceModalStyles.overlay}>
            <div className={aiInvoiceModalStyles.backdrop} onClick={() => onClose && onClose()}></div>
            <div className={aiInvoiceModalStyles.modal}>
                <div className='flex items-start justify-between'>
                    <div>
                        <h3 className={aiInvoiceModalStyles.title}>
                            <GeminiIcon className='w-6 h-6 roup-hover:scale-110 transition-transform fllex-none' />
                            Create Invoice with AI
                        </h3>
                        <p className={aiInvoiceModalStyles.description}>Paste any text that contains invoice details (client, items, qty, prices) and we'll attempt to extract an  invoice </p>
                    </div>
                    <button className={aiInvoiceModalStyles.closeButton} onClick={() => onClose && onClose()}> ✕ </button>
                </div>
                <div className='mt-4'><label className={aiInvoiceModalStyles.label}>Paste Invoice Text</label>
                    <textarea value={text} onChange={(e) => settext(e.target.value)} placeholder={`eg. A person wants a logo design for her 
                    organic brand "GreenVibe." Quoted for 120$ for 2 logo options and final delivery in PNG and vector format`}
                        rows={8} className={aiInvoiceModalStyles.textarea}>
                    </textarea>
                </div>
                {error && (
                    <div className={aiInvoiceModalStyles.error} role="alert">
                        {String(error)
                            .split("\n")
                            .map((line, i) => (
                                <div key={i}>{line}</div>
                            ))}
                        {(/quota|exhausted|resource_exhausted/i.test(String(error)) && (
                            <div style={{ marginTop: 8, fontSize: 13, color: "#374151" }}>
                                Tip: AI is temporarily unavailable (quota). Try again in a few
                                minutes, or create the invoice manually.
                            </div>
                        )) ||
                            null}
                    </div>
                )}
                <div className={aiInvoiceModalStyles.actions}>
                    <AnimatedButton onClick={handleGenerateClick} isLoading={loading} disabled={loading} label='Generate' />
                </div>
            </div>
        </div>
    )
}

export default AiInvoiceModal