import { useEffect, useState } from "react";
import { useGetAllUsers, useRegisterUser } from "../../api/hooks/user.api";

export const UserList = () => {
    const { getAllUsers, loading } = useGetAllUsers();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        (async () => {
            const res = await getAllUsers();
            if (res?.users) setUsers(res.users);
        })();
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 m-6">
            <h2 className="text-xl font-bold mb-4">User List</h2>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="overflow-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr>
                                <th className="text-left p-2">Name</th>
                                <th className="text-left p-2">Email</th>
                                <th className="text-left p-2">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id} className="border-t">
                                    <td className="p-2">{u.name}</td>
                                    <td className="p-2">{u.email}</td>
                                    <td className="p-2">{u.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export const AddUser = () => {
    const { registerUser, loading } = useRegisterUser();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
    });

    const submit = async (e) => {
        e.preventDefault();
        const res = await registerUser(form);
        if (res?.user) {
            setForm({ name: "", email: "", password: "", role: "user" });
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 m-6 max-w-2xl">
            <h2 className="text-xl font-bold mb-6">Add New User</h2>
            <form onSubmit={submit} className="grid grid-cols-1 gap-4">
                <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Name"
                    className="border p-2 rounded"
                />
                <input
                    required
                    value={form.email}
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                    placeholder="Email"
                    type="email"
                    className="border p-2 rounded"
                />
                <input
                    required
                    value={form.password}
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                    placeholder="Password"
                    type="password"
                    className="border p-2 rounded"
                />
                <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="border p-2 rounded"
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <div>
                    <button
                        disabled={loading}
                        className="bg-primary text-white px-4 py-2 rounded"
                    >
                        Add User
                    </button>
                </div>
            </form>
        </div>
    );
};
