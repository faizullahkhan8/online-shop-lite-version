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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
            <div className="absolute top-0 left-0 w-full h-64 bg-primary/5 -skew-y-6 transform -translate-y-32" />

            <div className="relative w-full max-w-md">
                <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
                            <ShieldCheck className="text-white" size={32} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                            Welcome Back
                        </h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
                            Login to your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                                    size={18}
                                />
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                    Password
                                </label>
                                <Link
                                    to="#"
                                    className="text-[10px] font-black text-primary uppercase tracking-wider hover:underline"
                                >
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                                    size={18}
                                />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-slate-900/20 hover:bg-primary transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:bg-slate-900"
                        >
                            {loginLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                "Secure Login"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-primary hover:text-blue-700 underline underline-offset-4"
                            >
                                Join for free
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Protected by 256-bit SSL encryption
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
