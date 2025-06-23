import { useState } from 'react';
import { WifiOff } from 'lucide-react';
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from 'react-router-dom';
import { message } from '@tauri-apps/plugin-dialog';

const NoInternet = () => {
    const navigate = useNavigate()
    const [isOnline, setIsOnline] = useState(true);

    const checkConnection = async () => {
        invoke<boolean>('check_internet')
            .then(setIsOnline)
            .catch(() => setIsOnline(false));
    }

    const dialogMsg = async () => {
        await message('We couldn’t connect to the internet. Check your connection and we’ll try again',
            { title: 'Tauri', kind: 'error' })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 transition-colors">
            <div className="text-center max-w-md px-6">
                <div className="flex justify-center mb-6 animate-pulse">
                    <div className="bg-red-500 p-4 rounded-full shadow-lg">
                        <WifiOff className="text-white w-10 h-10" />
                    </div>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
                    Oops! You're Offline
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-3">
                    It seems you’ve lost your internet connection. Please check your network settings or try reconnecting.
                </p>

                <button
                    onClick={async () => {
                        checkConnection()
                        if (isOnline) {
                            navigate("/")
                        } else {
                            await dialogMsg();
                        }
                    }}
                    className="mt-6 inline-block px-6 py-3 bg-red-500 text-white rounded-xl text-sm font-semibold shadow-lg hover:bg-red-600 transition"
                >
                    Retry Connection
                </button>
            </div>
        </div>
    );
};

export default NoInternet;
