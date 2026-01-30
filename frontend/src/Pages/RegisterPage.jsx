import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUser } from "../api/hooks/user.api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/slices/authSlice.js";
import { Loader2, User, Mail, Lock, ShieldCheck, Sparkles } from "lucide-react";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { registerUser, loading: registerUserLoading } = useRegisterUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await registerUser({ name, email, password });

        if (response?.success) {
            dispatch(loginSuccess(response.user));
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-64 bg-primary/5 skew-y-6 transform translate-y-32" />

            <div className="relative w-full max-w-md">
                <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-4 relative">
                            <ShieldCheck className="text-white" size={32} />
                            <Sparkles
                                className="absolute -top-1 -right-1 text-amber-400"
                                size={16}
                            />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                            Create Account
                        </h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
                            Join our global network
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">
                                Full Name
                            </label>
                            <div className="relative group">
                                <User
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

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
                                    required
                                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <Lock
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                                    size={18}
                                />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={registerUserLoading}
                            className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-slate-900/20 hover:bg-primary transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {registerUserLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                "Get Started Now"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                            Already a member?{" "}
                            <Link
                                to="/login"
                                className="text-primary hover:text-blue-700 underline underline-offset-4"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-6 opacity-50 grayscale">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                        alt="App Store"
                        className="h-6"
                    />
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                        alt="Play Store"
                        className="h-6"
                    />
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
