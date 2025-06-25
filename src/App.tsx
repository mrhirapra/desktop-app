import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import LoginPage from "./app/LoginPage";
import ForgotPasswordPage from "./app/ForgotPasswordPage";
import ResetPasswordPage from "./app/ResetPasswordPage";
import DashboardPage from "./app/DashboardPage";
import TimerPage from "./app/TimerPage";
import NoInternet from "./app/noConnectionError";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { LazyStore } from "@tauri-apps/plugin-store";
import ResumePrompt from "./components/ResumePrompt";

const store = new LazyStore("timer-state.dat");

function App() {

    const [isOnline, setIsOnline] = useState(true);
    const [showResumePrompt, setShowResumePrompt] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            invoke('close_splashscreen');
        }, 3000);
    }, []);

    useEffect(() => {
        const checkSavedState = async () => {
            try {
                const state: any = await store.get('timerState');
                if (state && state?.running) {
                    setShowResumePrompt(true);
                }
            } catch (error) {
                console.error("Failed to check saved timer state:", error);
            }
        };
        checkSavedState();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            invoke<boolean>('check_internet')
                .then(setIsOnline)
                .catch(async () => {
                    setIsOnline(false);
                });
        }, 10000);

        return () => clearInterval(interval);
    }, []);


    const InternetGuard = () => {
        return isOnline ? <Outlet /> : <Navigate to="/internet-error" />;
    };

    return (
        <Router>
            {showResumePrompt && <ResumePrompt onClose={() => setShowResumePrompt(false)} />}
            <Routes>
                <Route path="/internet-error" element={<NoInternet />} />
                <Route element={<InternetGuard />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/timer" element={<TimerPage />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
