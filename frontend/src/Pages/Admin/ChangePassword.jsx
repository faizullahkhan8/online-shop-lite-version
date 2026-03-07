import { useState } from "react";
import { useChangeAdminPassword } from "../../features/users.all";
import Input from "../../UI/Input";
import { Eye } from "lucide-react";

export default function ChangePassword() {
    const { mutateAsync: changePassword, isLoading: loading, error, isSuccess: success } = useChangeAdminPassword();

    const [form, setForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await changePassword(form);

        setForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

    };

    return (
        <div className="h-[80vh] flex items-center justify-center">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-semibold text-zinc-800 mb-6 text-center">
                    Change Password
                </h2>

                {success && (
                    <div className="mb-4 text-sm font-semibold text-green-600 bg-green-50 p-2 rounded">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold font-medium text-zinc-700">
                            Current Password
                        </label>
                        <Input
                            type={showPassword ? "text" : "password"}
                            name="oldPassword"
                            value={form.oldPassword}
                            placeholder={"Enter old password..."}
                            onChange={handleChange}
                            className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold font-medium text-zinc-700">
                            New Password
                        </label>
                        <Input
                            type={showPassword ? "text" : "password"}
                            name="newPassword"
                            value={form.newPassword}
                            placeholder={"Enter new password"}
                            onChange={handleChange}
                            className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold font-medium text-zinc-700">
                            Confirm New Password
                        </label>
                        <Input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={form.confirmPassword}
                            placeholder={"Confirm your password"}
                            onChange={handleChange}
                            className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
                        />
                    </div>
                    <p onClick={() => setShowPassword(!showPassword)} className="text-sm font-semibold cursor-pointer text-blue-500 hover:underline pl-2">
                        {showPassword ? "hide passwords" : "show passwords"}
                    </p>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-2 rounded-md hover:bg-zinc-800 transition disabled:opacity-60"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}