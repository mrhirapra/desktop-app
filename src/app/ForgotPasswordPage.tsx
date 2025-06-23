import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 1200);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 px-4">
            <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg relative">
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="absolute top-4 left-4 flex items-center text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium focus:outline-none"
                    aria-label="Back to Login"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-1" />
                    Back to Login
                </button>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center mt-2">Forgot Password</h2>
                {success ? (
                    <div className="mb-4 text-green-700 bg-green-50 dark:bg-green-900 dark:text-green-200 rounded px-3 py-2 transition-all duration-300 text-center" role="status">
                        If this email exists, a reset link has been sent.
                    </div>
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit} aria-label="Forgot password form">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className={`block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all ${error ? 'border-red-500' : ''}`}
                                aria-invalid={!!error}
                                aria-describedby="email-error"
                            />
                        </div>
                        {error && (
                            <div className="text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-200 rounded px-3 py-2 transition-all duration-300" id="email-error" role="alert">
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
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
