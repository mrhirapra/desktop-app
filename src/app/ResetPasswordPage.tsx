import { useState } from "react";
import {useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

const passwordStrength = (pw: string) => {
    return /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(pw);
};

const ResetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!passwordStrength(password)) {
            setError("Password must be at least 8 characters, include a number and a symbol.");
            return;
        }
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 1200);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#131313] transition-colors duration-300 px-4">
            <div className="w-full max-w-md p-8 bg-white dark:bg-[#202020] rounded-xl shadow-lg relative">
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="absolute top-4 left-4 flex items-center text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium focus:outline-none"
                    aria-label="Back to Login"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-1" />
                    Back to Login
                </button>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center mt-2">Reset Password</h2>
                {success ? (
                    <div className="mb-4 text-green-700 bg-green-50 dark:bg-green-900 dark:text-green-200 rounded px-3 py-2 transition-all duration-300 text-center" role="status">
                        Your password has been reset successfully.
                    </div>
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit} aria-label="Reset password form">
                        <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="new-password"
                                    name="new-password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className={classNames(
                                        "block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all pr-10",
                                        error && !passwordStrength(password) ? "border-red-500" : ""
                                    )}
                                    aria-invalid={!!error && !passwordStrength(password)}
                                    aria-describedby="password-error"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                                    tabIndex={-1}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type={showConfirm ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    value={confirm}
                                    onChange={e => setConfirm(e.target.value)}
                                    className={classNames(
                                        "block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all pr-10",
                                        error && password !== confirm ? "border-red-500" : ""
                                    )}
                                    aria-invalid={!!error && password !== confirm}
                                    aria-describedby="confirm-error"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(v => !v)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                                    tabIndex={-1}
                                    aria-label={showConfirm ? "Hide password" : "Show password"}
                                >
                                    {showConfirm ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                        {error && (
                            <div className="text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-200 rounded px-3 py-2 transition-all duration-300" id="password-error" role="alert">
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full flex justify-center items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60"
                            disabled={loading}
                            aria-busy={loading}
                        >
                            {loading && (
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                            )}
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;
