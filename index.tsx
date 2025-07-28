import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import AIROICalculatorPopup from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

/**
 * A simple host to demonstrate the AI ROI Calculator Popup.
 * In a real Framer integration, you would control the `isOpen`
 * state from your Framer canvas and interactions.
 */
const PreviewHost = () => {
    // For preview purposes, the popup is open by default.
    // In Framer, you'll control this with a state variable.
    const [isOpen, setIsOpen] = useState(true);

    // The API key is assumed to be available in process.env.API_KEY.
    // In Framer, you'll pass this as a prop to your code component.
    const apiKey = process.env.API_KEY || "";

    const handleClose = () => {
        console.log("Close button clicked. In Framer, this would set your state variable to false.");
        // We toggle the state to allow re-opening the popup in this preview environment.
        setIsOpen(false);
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800;900&display=swap');
                html, body, #root {
                    margin: 0;
                    padding: 0;
                    font-family: 'Inter', sans-serif;
                }
                 #root {
                    background-image: url('https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=2574&auto=format&fit=crop');
                    background-size: cover;
                    background-position: center;
                    min-height: 100vh;
                 }
                .preview-button {
                    transform: translateY(-2px);
                    box-shadow: 0 7px 20px 0 rgba(16, 185, 129, 0.45);
                }
            `}</style>
             {/* This button is for preview purposes to demonstrate re-opening the popup */}
             {!isOpen && (
                 <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="preview-button"
                        style={{
                            padding: '1rem 2rem',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            backgroundColor: '#10B981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '9999px',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)',
                            transition: 'all 0.2s ease-in-out'
                        }}
                    >
                        Re-open Calculator
                    </button>
                 </div>
             )}
            <AIROICalculatorPopup
                isOpen={isOpen}
                onClose={handleClose}
                apiKey={apiKey}
            />
        </>
    );
};

root.render(
    <React.StrictMode>
        <PreviewHost />
    </React.StrictMode>
);
