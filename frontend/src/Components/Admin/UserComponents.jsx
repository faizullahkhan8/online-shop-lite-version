import { useEffect, useState } from "react";
import { useGetAllUsers, useRegisterUser } from "../../api/hooks/user.api";
import {
    ShieldCheck,
    User,
    Mail,
    Lock,
    UserPlus,
    RefreshCw,
    Fingerprint,
} from "lucide-react";

export const UserList = () => {
    const { getAllUsers, loading } = useGetAllUsers();
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        const res = await getAllUsers();
        if (res?.users) setUsers(res.users);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <header className="flex items-end justify-between px-2">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                        User <span className="text-primary">Registry</span>
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
                        Authorized Personnel: {users.length}
                    </p>
                </div>
                <button
                    onClick={fetchUsers}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
                >
                    <RefreshCw
                        size={12}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh Database
                </button>
            </header>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    Identity
                                </th>
                                <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    Communication Node
                                </th>
                                <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    Clearance
                                </th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    Access Key
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
                                                Scanning Identities...
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
                                                <span className="font-black text-slate-800 uppercase tracking-tight">
                                                    {u.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 font-medium text-slate-500">
                                            {u.email}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span
                                                className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                                                    u.role === "admin"
                                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                        : "bg-slate-100 text-slate-500"
                                                }`}
                                            >
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right font-mono text-[10px] text-slate-300">
                                            {u._id.slice(-12).toUpperCase()}
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
        <div className="max-w-2xl animate-in slide-in-from-right-4 duration-700">
            <header className="mb-8 px-2">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                    <UserPlus className="text-primary" size={32} />
                    Provision <span className="text-primary">Account</span>
                </h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
                    Establish new personnel credentials
                </p>
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
                            Email Node
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
                            Security Key
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
                            Clearance Level
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
                                <option value="user">Standard User</option>
                                <option value="admin">System Admin</option>
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
                                Finalize Registration
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
