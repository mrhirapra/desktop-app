import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const validateEmail = (email: string) =>
        /^\S+@\S+\.\S+$/.test(email);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }
        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        setLoading(true);
        // Simulate login
        setTimeout(() => {
            setLoading(false);
            if (email === "user@example.com" && password === "1234") {
                setSuccess("Login successful!");
                setError("");
                setTimeout(() => navigate("/dashboard"), 1200);
            } else {
                setError("Invalid email or password.");
                setSuccess("");
            }
        }, 1200);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 px-4">
            <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg relative">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center mt-2">Sign in to your account</h2>
                {error && (
                    <div className="mb-4 text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-200 rounded px-3 py-2 transition-all duration-300" role="alert">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 text-green-700 bg-green-50 dark:bg-green-900 dark:text-green-200 rounded px-3 py-2 transition-all duration-300" role="status">
                        {success}
                    </div>
                )}
                <form className="space-y-5" onSubmit={handleSubmit} aria-label="Login form">
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
                            className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                            aria-invalid={!!error && !email}
                            aria-describedby="email-error"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all pr-10"
                                aria-label="Password"
                                aria-invalid={!!error && !password}
                                aria-describedby="password-error"
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                                onClick={() => setShowPassword(v => !v)}
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
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>
                <div className="flex flex-col items-center mt-6">
                    <Link
                        to="/forgot-password"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm transition-colors"
                    >
                        Forgot Password?
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
