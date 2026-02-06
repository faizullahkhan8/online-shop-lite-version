import { useEffect, useState } from "react";
import { useAddUserFromAdmin, useGetAllUsers } from "../../api/hooks/user.api";
import {
    ShieldCheck,
    User,
    Mail,
    Lock,
    UserPlus,
    RefreshCw,
    Fingerprint,
    Phone,
} from "lucide-react";

export const UserList = () => {
    const { getAllUsers, loading } = useGetAllUsers();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        (async () => {
            const res = await getAllUsers();
            if (res?.users) setUsers(res.users);
        })();
    }, []);

    console.log(users[0]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex items-end justify-between px-2">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                        Users
                    </h2>
                </div>
            </header>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    Picture + Name
                                </th>
                                <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    Email
                                </th>
                                <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    Phone Number
                                </th>
                                <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    Address
                                </th>
                                <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    Role
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {loading && users.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="py-20 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-10 h-10 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                Fetching Users...
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr
                                        key={u._id}
                                        className="group hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    <User size={18} />
                                                </div>
                                                <span className="font-semibold text-slate-800 tracking-tight">
                                                    {u.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 font-medium text-slate-500">
                                            {u.email}
                                        </td>
                                        <td className="px-6 py-5 text-slate-500">
                                            {u.phone}
                                        </td>

                                        <td className="px-8 py-5 text-slate-500">
                                            {u?.address || "temp address"}
                                        </td>
                                        <td className="px-8 py-5 text-left text-sm text-slate-500">
                                            <span
                                                className={`text-[10px] font-semibold px-3 py-1 rounded-full uppercase ${
                                                    u.role === "admin"
                                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                        : "bg-slate-100 text-slate-500"
                                                }`}
                                            >
                                                {u.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export const AddUser = () => {
    const { addUserFromAdmin, loading } = useAddUserFromAdmin();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
        phone: "",
    });

    const submit = async (e) => {
        e.preventDefault();
        const res = await addUserFromAdmin(form);
        if (res?.user) {
            setForm({ name: "", email: "", password: "", role: "user" });
        }
    };

    return (
        <div className="max-w-2xl animate-in slide-in-from-right-4 duration-500">
            <header className="mb-8 px-2">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                    <UserPlus className="text-primary" size={32} />
                    Add User
                </h2>
            </header>

            <form
                onSubmit={submit}
                className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Full Name
                        </label>
                        <div className="relative">
                            <User
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                                size={16}
                            />
                            <input
                                required
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                                placeholder="J. DOE"
                                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                                size={16}
                            />
                            <input
                                required
                                type="email"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                                placeholder="CORE@NETWORK.COM"
                                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Phone
                        </label>
                        <div className="relative">
                            <Phone
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                                size={16}
                            />
                            <input
                                required
                                type="phone"
                                value={form.phone}
                                onChange={(e) =>
                                    setForm({ ...form, phone: e.target.value })
                                }
                                placeholder="CORE@NETWORK.COM"
                                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Password
                        </label>
                        <div className="relative">
                            <Lock
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                                size={16}
                            />
                            <input
                                required
                                type="password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        password: e.target.value,
                                    })
                                }
                                placeholder="••••••••"
                                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Role
                        </label>
                        <div className="relative">
                            <ShieldCheck
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                                size={16}
                            />
                            <select
                                value={form.role}
                                onChange={(e) =>
                                    setForm({ ...form, role: e.target.value })
                                }
                                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-black uppercase appearance-none focus:ring-2 focus:ring-primary/20 transition-all"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        disabled={loading}
                        className="group w-full bg-slate-900 text-white rounded-2xl py-5 font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? (
                            <RefreshCw size={16} className="animate-spin" />
                        ) : (
                            <>
                                <Fingerprint
                                    size={18}
                                    className="group-hover:animate-pulse"
                                />
                                Add User
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
