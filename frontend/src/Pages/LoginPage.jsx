import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUser } from "../api/hooks/user.api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/slices/authSlice";
import { Loader2, Mail, Lock, ShieldCheck } from "lucide-react";
import { loginSchema } from "../schema/schema";
import { toast } from "react-toastify";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loginUser, loading: loginLoading } = useLoginUser();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = loginSchema.safeParse({ email, password });

        if (!result.success) {
            const errors = JSON.parse(result.error.message);
            errors.forEach((error) => {
                toast.error(error.message);
            });
            return;
        }

        const response = await loginUser({ email, password });

        if (response?.success) {
            dispatch(loginSuccess(response.user));
            if (response.user.role === "admin") {
                navigate("/admin-dashboard");
            } else {
                navigate("/");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm mb-4">
                            <ShieldCheck className="text-white" size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Welcome Back
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Sign in to your account
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    className="w-full h-11 pl-10 pr-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <Link
                                    to="#"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="w-full h-11 pl-10 pr-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full h-11 bg-blue-600 text-white rounded-lg font-medium text-sm shadow-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                        >
                            {loginLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;