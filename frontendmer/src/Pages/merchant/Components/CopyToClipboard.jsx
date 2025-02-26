import React, { useState } from 'react';

function CopyToClipboard({ text }) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        } catch (error) {
            console.error('Failed to copy text: ', error);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px', wordBreak: 'break-word' }}>{text}</span>
            <button
                onClick={handleCopy}
                style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                }}
                title="Copy to clipboard"
            >
                📋 {/* You can replace this with an SVG or icon library */}
            </button>
            {isCopied && <span style={{ color: 'green', fontSize: '12px' }}>Copied!</span>}
        </div>
    );
}

export default CopyToClipboard;
