import { useEffect, useState } from "react";
import { LazyStore } from "@tauri-apps/plugin-store";
import { ClockIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { calculateTimeDifference, formatTimeDifference } from "../utils/helper";

const store = new LazyStore("timer-state.dat");

interface TimerState {
    seconds: number;
    running: boolean;
    project: { id: string; name: string };
    taskName: string;
    taskDesc: string;
    assigned: { name: string; id: string; avatar: string }[];
    startTime: number;
    timestamp: number;
}

const ResumePrompt = ({ onClose }: { onClose: () => void }) => {
    const navigate = useNavigate();
    const [savedState, setSavedState] = useState<TimerState | null>(null);
    const [timeDifference, setTimeDifference] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const loadState = async () => {
            try {
                const state = await store.get<TimerState>("timerState");
                if (state && state.running) {
                    setTimeDifference(calculateTimeDifference(state.startTime, state.timestamp));
                    setSavedState(state);
                } else {
                    onClose()
                }
            } catch (error) {
                console.error("Failed to load timer state:", error);
                onClose();
            }
        };
        loadState();
    }, [onClose]);

    const handleContinue = async () => {
        if (savedState) {
            navigate("/timer", {
                state: {
                    project: savedState.project,
                    taskName: savedState.taskName,
                    taskDesc: savedState.taskDesc,
                    assigned: [savedState.assigned],
                    startTime: savedState.startTime,
                    initialSeconds: savedState.seconds,
                },
            });
            onClose();
        }
    };

    const handleNewTask = async () => {
        try {
            await store.delete("timerState");
            await store.save();
            navigate("/dashboard");
            onClose();
        } catch (error) {
            console.error("Failed to clear timer state:", error);
        }
    };

    if (!savedState) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#858585] dark:bg-[#131313] bg-opacity-40 z-50">
            <div className="bg-white dark:bg-[#202020] rounded-xl shadow-xl p-8 max-w-md w-full text-center">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Resume Previous Task?</h2>
                <div className="mb-4 text-gray-700 dark:text-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                        <ClockIcon className="h-5 w-5" />
                        <span>Project: {savedState.project.name}</span>
                    </div>
                    <div>Task: {savedState.taskName}</div>
                    <div>Time Elapsed: <span className="font-semibold">
                        {formatTimeDifference(timeDifference)}
                    </span></div>
                </div>
                <div className="flex justify-center gap-4">
                    <button
                        className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                        onClick={handleContinue}
                    >
                        Continue Task
                    </button>
                    <button
                        className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                        onClick={handleNewTask}
                    >
                        New Task
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResumePrompt;
