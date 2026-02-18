import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUser } from "../api/hooks/user.api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/slices/authSlice.js";
import { Loader2, User, Mail, Lock, ShieldCheck } from "lucide-react";
import Breadcrumb from "../Components/Breadcrumb.jsx";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Register" },
    ];
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { registerUser, loading: registerUserLoading } = useRegisterUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await registerUser({ name, email, password });

        if (response?.success) {
            dispatch(loginSuccess(response.user));
            navigate("/admin-dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 max-w-7xl pt-12">
                <Breadcrumb items={breadcrumbItems} />
                <div className="flex items-center justify-center py-12">
                    <div className="w-full max-w-md">
                        <div className="bg-white p-10 border border-zinc-100 shadow-sm">
                            {/* Header - Matches Login Design */}
                            <div className="flex flex-col items-center mb-12">
                                <div className="w-16 h-16 bg-zinc-900 flex items-center justify-center mb-6">
                                    <ShieldCheck className="text-white" size={28} strokeWidth={1} />
                                </div>
                                <h2 className="text-md uppercase tracking-[0.4em] font-semibold text-zinc-900">
                                    Registration
                                </h2>
                                <p className="text-sm uppercase tracking-widest text-zinc-500 mt-2">
                                    Create your account
                                </p>
                            </div>

                            {/* Form - Aligned with Login Inputs */}
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-sm uppercase tracking-widest font-semibold text-zinc-900">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User
                                            className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-500"
                                            size={16}
                                        />
                                        <input
                                            type="text"
                                            placeholder="YOUR NAME"
                                            required
                                            className="w-full h-12 pl-8 pr-4 bg-transparent border-b border-zinc-200 text-sm text-zinc-900 placeholder-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm uppercase tracking-widest font-semibold text-zinc-900">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail
                                            className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-500"
                                            size={16}
                                        />
                                        <input
                                            type="email"
                                            placeholder="YOUR@EMAIL.COM"
                                            required
                                            className="w-full h-12 pl-8 pr-4 bg-transparent border-b border-zinc-200 text-sm text-zinc-900 placeholder-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm uppercase tracking-widest font-semibold text-zinc-900">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock
                                            className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-500"
                                            size={16}
                                        />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            className="w-full h-12 pl-8 pr-4 bg-transparent border-b border-zinc-200 text-sm text-zinc-900 placeholder-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={registerUserLoading}
                                    className="w-full h-14 bg-zinc-900 text-white text-sm uppercase tracking-[0.3em] font-semibold hover:bg-zinc-700 transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-10"
                                >
                                    {registerUserLoading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={16} strokeWidth={1.5} />
                                            Creating...
                                        </>
                                    ) : (
                                        "Sign Up"
                                    )}
                                </button>
                            </form>

                            {/* Footer - Aligned with Login page link style */}
                            <div className="mt-8 text-center">
                                <p className="text-[11px] uppercase tracking-widest text-zinc-700">
                                    Already have an account?{" "}
                                    <Link
                                        to="/login"
                                        className="text-zinc-900 font-bold border-b border-zinc-900 ml-1 hover:text-zinc-500 hover:border-zinc-400 transition-colors"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
