import { useEffect, useState } from 'react';
import { Window } from '@tauri-apps/api/window';
import './App.css';

interface SplashScreenProps {
    children: React.ReactNode;
}

export default function SplashScreen({ children }: SplashScreenProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initApp = async () => {
            try {
                const unlisten = await Window.getCurrent().listen('splashscreen-loaded', async () => {
                    unlisten();
                    await new Promise(resolve => setTimeout(resolve, 500)); // Smooth transition
                    setLoading(false);
                });

                const timeout = setTimeout(() => {
                    setLoading(false);
                    console.warn('Splash screen timeout reached');
                }, 10000);

                return () => clearTimeout(timeout);
            } catch (err) {
                console.error('Splash screen error:', err);
                setError(err instanceof Error ? err.message : String(err));
            }
        };

        initApp();
    }, []);

    if (error) {
        return (
            <div className="splash-error">
                <h1>Application Error</h1>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="splash-container">
                <div className="splash-content">
                    <img
                        src="/assets/splash-screen.png"
                        alt="Loading..."
                        className="splash-image"
                    />
                    <div className="splash-loader">
                        <div className="splash-loader-bar"></div>
                    </div>
                    <p className="splash-status">Initializing application...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
