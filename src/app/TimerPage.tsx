import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Window } from "@tauri-apps/api/window";
import { message } from '@tauri-apps/plugin-dialog';
import { StopCircleIcon, UserGroupIcon, ClockIcon } from "@heroicons/react/24/outline";
import { LazyStore } from "@tauri-apps/plugin-store";
import { calculateTimeDifference, formatTimeDifference } from "../utils/helper";

const store = new LazyStore("timer-state.dat");

const TimerPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { project, taskName, taskDesc, assigned, startTime } = location.state || {};

    const intervalRef = useRef<number | null>(null);
    const [windowInstance] = useState(() => Window.getCurrent());

    const [running, setRunning] = useState(true);
    const [showSummary, setShowSummary] = useState(false);
    const [timeDifference, setTimeDifference] = useState({ hours: 0, minutes: 0, seconds: 0 });

    const saveTimerState = async () => {
        try {
            const currentTimestamp = Date.now();
            await store.set("timerState", {
                running,
                project,
                taskName,
                taskDesc,
                assigned,
                startTime,
                timestamp: currentTimestamp,
            })
            await store.save();
        } catch (error) {
            console.error("Failed to save timer state:", error);
        }
    };

    const clearTimerState = async () => {
        try {
            await store.delete("timerState");
            await store.save();
        } catch (error) {
            console.error("Failed to clear timer state:", error);
        }
    };

    useEffect(() => {
        let unlistenPromise: Promise<() => void>;

        const setupCloseProtection = async () => {
            try {
                unlistenPromise = windowInstance.onCloseRequested(async (event) => {
                    if (running) {
                        event.preventDefault();
                        await message('Timer is running. Please stop it before closing the app.', {
                            title: 'Close Blocked',
                            kind: 'warning'
                        });
                    }
                });
            } catch (error) {
                console.error('Close protection setup failed:', error);
            }
        };

        setupCloseProtection();

        return () => {
            unlistenPromise?.then(unlisten => unlisten());
        };
    }, [running, windowInstance]);

    useEffect(() => {
        if (!project || !taskName || !taskDesc || !assigned) {
            navigate("/dashboard");
            return;
        }

        if (running) {
            intervalRef.current = window.setInterval(() => {
                if (startTime) {
                    setTimeDifference(calculateTimeDifference(startTime, Date.now()));
                }
            }, 1000)
        }

        saveTimerState();

        return () => {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [running, project, taskName, taskDesc, assigned, navigate]);

    const handleStop = async () => {
        setRunning(false);
        setShowSummary(true);
        await clearTimerState();
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 px-4 py-8">
            <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-10 relative">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center mt-2">Task Timer</h1>
                <div className="mb-6">
                    <div className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                        <ClockIcon className="h-5 w-5" /> {project?.name}
                    </div>
                    <div className="mb-1 text-base font-medium text-gray-800 dark:text-gray-100">{taskName}</div>
                    <div className="mb-2 text-gray-600 dark:text-gray-300 text-sm">{taskDesc}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                        <UserGroupIcon className="h-4 w-4" />
                        {assigned && assigned.length > 0 ? (
                            assigned.map((m: any) => m.name).join(", ")
                        ) : (
                            <span>No one assigned</span>
                        )}
                    </div>
                </div>
                <div className="flex flex-col items-center my-8">
                    <div className="text-5xl md:text-6xl font-mono font-bold text-blue-600 dark:text-blue-400 mb-6 transition-all select-none" aria-live="polite">
                        {formatTimeDifference(timeDifference)}
                    </div>
                    <button
                        type="button"
                        onClick={handleStop}
                        disabled={!running}
                        className="flex items-center gap-2 px-8 py-4 rounded-lg bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white text-xl font-semibold shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:opacity-60"
                        aria-label="Stop Timer"
                    >
                        <StopCircleIcon className="h-7 w-7" /> Stop
                    </button>
                </div>
                {showSummary && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 transition-all">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-sm w-full text-center">
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Task Completed</h2>
                            <div className="mb-2 text-lg text-gray-700 dark:text-gray-200">
                                Task completed in <span className="font-semibold">
                                    {formatTimeDifference(timeDifference)}
                                </span>
                            </div>
                            <button
                                className="mt-6 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                                onClick={() => navigate("/dashboard")}
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimerPage;
