import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUser } from "../api/hooks/user.api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/slices/authSlice";
import { Loader } from "lucide-react"
import { loginSchema } from "../schema/schema";
import { toast } from "react-toastify";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { loginUser, loading: loginLoading } = useLoginUser()

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = loginSchema.safeParse({ email, password });

        if (!result.success) {
            const errors = JSON.parse(result.error.message)
            errors.forEach(error => {
                toast.error(error.message)
            })
            return
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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            placeholder="Enter your email..."
                            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-primary"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password..."
                            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-primary"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loginLoading}
                        className="w-full bg-primary text-white text-center py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        {loginLoading ? <Loader className="animate-spin" size={20} /> : "Login"}
                    </button>
                </form>
                <div className="mt-4 text-center text-sm">
                    Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
