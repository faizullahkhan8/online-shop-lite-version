import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUser } from "../api/hooks/user.api";
import { useDispatch } from "react-redux"
import { loginSuccess } from "../store/slices/authSlice.js"

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

        console.log(response);
        if (response.success) {
            dispatch(loginSuccess(response.user))
            navigate("/");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-primary"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-primary"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-primary"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={registerUserLoading}
                        className="w-full bg-primary text-white py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                        {registerUserLoading ? "Registering..." : "Register"}
                    </button>
                </form>
                <div className="mt-4 text-center text-sm">
                    Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
