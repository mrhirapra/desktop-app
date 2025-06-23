// import { useEffect, useRef, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Window } from "@tauri-apps/api/window";
// import { message } from '@tauri-apps/plugin-dialog';
// import { StopCircleIcon, UserGroupIcon, ClockIcon } from "@heroicons/react/24/outline";

// const TimerPage = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const windowRef = useRef(Window.getCurrent());

//     const { project, taskName, taskDesc, assigned } = location.state || {};
//     const [seconds, setSeconds] = useState(0);
//     const [running, setRunning] = useState(true);
//     const [showSummary, setShowSummary] = useState(false);
//     const intervalRef = useRef<number | null>(null);

//     const [windowInstance] = useState(() => Window.getCurrent());

//     useEffect(() => {
//         let unlistenPromise: Promise<() => void>;

//         const setupCloseProtection = async () => {
//             try {
//                 unlistenPromise = windowInstance.onCloseRequested(async (event) => {
//                     if (running) {
//                         event.preventDefault();
//                         await message('Timer is running. Please stop it before closing the app.', {
//                             title: 'Close Blocked',
//                             kind: 'warning'
//                         });
//                     }
//                 });
//             } catch (error) {
//                 console.error('Close protection setup failed:', error);
//             }
//         };

//         setupCloseProtection();

//         return () => {
//             unlistenPromise?.then(unlisten => unlisten());
//         };
//     }, [running, windowInstance]);

//     useEffect(() => {
//         if (!project || !taskName || !taskDesc || !assigned) {
//             navigate("/dashboard");
//             return;
//         }
//         if (running) {
//             intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
//         } else if (intervalRef.current) {
//             clearInterval(intervalRef.current);
//         }
//         return () => {
//             if (intervalRef.current) clearInterval(intervalRef.current);
//         };
//     }, [running, project, taskName, taskDesc, assigned, navigate]);

//     const handleStop = () => {
//         setRunning(false);
//         setShowSummary(true);
//     };

//     const formatTime = (s: number) => {
//         const h = Math.floor(s / 3600).toString().padStart(2, "0");
//         const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
//         const sec = (s % 60).toString().padStart(2, "0");
//         return `${h}:${m}:${sec}`;
//     };

//     return (
//         <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 px-4 py-8">
//             <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-10 relative">
//                 {/* <button
//                     type="button"
//                     onClick={() => navigate("/dashboard")}
//                     className="absolute top-4 left-4 flex items-center text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium focus:outline-none"
//                     aria-label="Back to Dashboard"
//                 >
//                     <ArrowLeftIcon className="h-5 w-5 mr-1" />
//                     Back to Dashboard
//                 </button> */}
//                 <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center mt-2">Task Timer</h1>
//                 <div className="mb-6">
//                     <div className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
//                         <ClockIcon className="h-5 w-5" /> {project?.name}
//                     </div>
//                     <div className="mb-1 text-base font-medium text-gray-800 dark:text-gray-100">{taskName}</div>
//                     <div className="mb-2 text-gray-600 dark:text-gray-300 text-sm">{taskDesc}</div>
//                     <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
//                         <UserGroupIcon className="h-4 w-4" />
//                         {assigned && assigned.length > 0 ? (
//                             assigned.map((m: any) => m.name).join(", ")
//                         ) : (
//                             <span>No one assigned</span>
//                         )}
//                     </div>
//                 </div>
//                 <div className="flex flex-col items-center my-8">
//                     <div className="text-5xl md:text-6xl font-mono font-bold text-blue-600 dark:text-blue-400 mb-6 transition-all select-none" aria-live="polite">
//                         {formatTime(seconds)}
//                     </div>
//                     <button
//                         type="button"
//                         onClick={handleStop}
//                         disabled={!running}
//                         className="flex items-center gap-2 px-8 py-4 rounded-lg bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white text-xl font-semibold shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:opacity-60"
//                         aria-label="Stop Timer"
//                     >
//                         <StopCircleIcon className="h-7 w-7" /> Stop
//                     </button>
//                 </div>
//                 {/* Summary Modal/Message */}
//                 {showSummary && (
//                     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 transition-all">
//                         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-sm w-full text-center">
//                             <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Task Completed</h2>
//                             <div className="mb-2 text-lg text-gray-700 dark:text-gray-200">
//                                 Task completed in <span className="font-semibold">{formatTime(seconds)}</span>
//                             </div>
//                             <button
//                                 className="mt-6 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
//                                 onClick={() => navigate("/dashboard")}
//                             >
//                                 Back to Dashboard
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default TimerPage;


import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Window } from "@tauri-apps/api/window";
import { message } from '@tauri-apps/plugin-dialog';
import { StopCircleIcon, UserGroupIcon, ClockIcon } from "@heroicons/react/24/outline";
import { LazyStore } from "@tauri-apps/plugin-store";

interface TimerState {
    seconds: number;
    running: boolean;
    project: { id: string; name: string };
    taskName: string;
    taskDesc: string;
    assigned: { id: string; name: string; avatar: string }[];
    startTime: number;
    timestamp: number;
}

const store = new LazyStore("timer-state.dat");

const TimerPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const intervalRef = useRef<number | null>(null);
    const saveIntervalRef = useRef<number | null>(null);

    const { project, taskName, taskDesc, assigned, initialSeconds = 0, startTime } = location.state || {};
    const [seconds, setSeconds] = useState(initialSeconds);

    const [running, setRunning] = useState(true);
    const [showSummary, setShowSummary] = useState(false);


    const [windowInstance] = useState(() => Window.getCurrent());

    useEffect(() => {
        const loadSavedState = async () => {
            try {
                const state = await store.get<TimerState>("timerState");
                if (state && state.running && !location.state) {
                    const elapsed = Math.floor((Date.now() - state.timestamp) / 1000);
                    setSeconds(state.seconds + elapsed);
                    setRunning(state.running);
                }
            }
            catch (error) {
                console.error("Failed to load saved state:", error);
            }
        }

        loadSavedState();
    }, [])

    // Save timer state to store
    const saveTimerState = async () => {
        try {
            await store.set("timerState", {
                seconds,
                running,
                project,
                taskName,
                taskDesc,
                assigned,
                startTime,
                timestamp: Date.now(),
            })
            await store.save();
        } catch (error) {
            console.error("Failed to save timer state:", error);
        }
    };

    // Clear timer state
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
        // if (running) {
        //     intervalRef.current = setInterval(() => setSeconds((s: number) => s + 1), 1000);
        //     // Save state every 10 seconds while running
        //     const saveInterval = setInterval(saveTimerState, 10000);

        //     return () => {
        //         if (intervalRef.current) clearInterval(intervalRef.current);
        //         clearInterval(saveInterval);
        //     };
        // } else if (intervalRef.current) {
        //     clearInterval(intervalRef.current);
        // }

        if (running) {
            intervalRef.current = window.setInterval(() => {
                setSeconds((s: number) => s + 1);
            }, 1000)

            saveIntervalRef.current = window.setInterval(() => {
                saveTimerState();
            }, 10000);
        }


        // Save state when running changes
        saveTimerState();
        return () => {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (saveIntervalRef.current) {
                window.clearInterval(saveIntervalRef.current);
                saveIntervalRef.current = null;
            }
        };
    }, [running, project, taskName, taskDesc, assigned, navigate]);

    const handleStop = async () => {
        setRunning(false);
        setShowSummary(true);
        await clearTimerState(); // Clear state when timer is stopped
    };

    const formatTime = (s: number) => {
        const h = Math.floor(s / 3600).toString().padStart(2, "0");
        const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
        const sec = (s % 60).toString().padStart(2, "0");
        return `${h}:${m}:${sec}`;
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
                        {formatTime(seconds)}
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
                                Task completed in <span className="font-semibold">{formatTime(seconds)}</span>
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
