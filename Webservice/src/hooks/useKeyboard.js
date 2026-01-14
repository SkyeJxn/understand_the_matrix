import { useEffect } from "react";

// actions: { [key: string]: function }
// onNext, onBack: fallback functions for space/backspace
// mode: string for escape navigation
export function useKeyMap( onNext, onBack, mode) {
    useEffect(() => {
        // Standard key names per MDN
        const keyMappings = {
            "Escape": () => {
                if (mode) {
                    window.location.href = `/${mode}`;
                }
            },
            " ": onNext, // Spacebar
            "Backspace": onBack
        };

        function handleKeyDown(e) {
            const isInput = 
                e.target.tagName === "INPUT" || 
                e.target.tagName === "TEXTAREA" || 
                e.target.isContentEditable; 
            
            if (isInput) return;    // input

            const handler = keyMappings[e.key];
            if (typeof handler === "function") {
                e.preventDefault();
                handler();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onNext, onBack, mode]);
}