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
        <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-white p-10 border border-zinc-100 shadow-sm">
                    <div className="flex flex-col items-center mb-12">
                        <div className="w-16 h-16 bg-zinc-900 flex items-center justify-center mb-6">
                            <ShieldCheck className="text-white" size={28} strokeWidth={1} />
                        </div>
                        <h2 className="text-md uppercase tracking-[0.4em] font-semibold text-zinc-900">
                            Authentication
                        </h2>
                        <p className="text-sm uppercase tracking-widest text-zinc-400 mt-2">
                            Access your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-sm uppercase tracking-widest font-semibold text-zinc-900">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-400"
                                    size={16}
                                />
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full h-12 pl-8 pr-4 bg-transparent border-b border-zinc-200 text-sm text-zinc-900 placeholder-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm uppercase tracking-widest font-semibold text-zinc-900">
                                    Password
                                </label>
                            </div>
                            <div className="relative">
                                <Lock
                                    className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-400"
                                    size={16}
                                />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full h-12 pl-8 pr-4 bg-transparent border-b border-zinc-200 text-sm text-zinc-900 placeholder-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full h-14 bg-zinc-900 text-white text-sm uppercase tracking-[0.3em] font-semibold hover:bg-zinc-700 transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-10"
                        >
                            {loginLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} strokeWidth={1.5} />
                                    Verifying...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;