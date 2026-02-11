import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUser } from "../api/hooks/user.api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/slices/authSlice.js";
import { Loader2, User, Mail, Lock, ShieldCheck } from "lucide-react";

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                            <ShieldCheck className="text-white" size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Create Account
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Join us and start shopping
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <div className="relative">
                                <User
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                    className="w-full h-11 pl-10 pr-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

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
                                    required
                                    className="w-full h-11 pl-10 pr-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <Lock
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    className="w-full h-11 pl-10 pr-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                            className="w-full h-11 bg-blue-600 text-white rounded-lg font-medium text-sm shadow-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        >
                            {registerUserLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Creating account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;