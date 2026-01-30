import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from "../store/slices/authSlice";
import { useUpdateUser } from "../api/hooks/user.api";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Camera,
    ShieldCheck,
    Loader2,
} from "lucide-react";

const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth);
    const [userData, setUserData] = useState(null);
    const dispatch = useDispatch();

    const { updateUser, loading: updateUserLoading } = useUpdateUser();

    useEffect(() => {
        if (user) {
            setUserData(user);
        }
    }, [user]);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await updateUser({ userId: user._id, user: userData });

        if (response.user) {
            dispatch(loginSuccess(response.user));
        }
    };

    return (
        <div className="bg-slate-50/50 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <header className="mb-10 flex items-end justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                            Account Settings
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">
                            Manage your public profile and delivery preferences.
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                            Verified Account
                        </span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 text-center shadow-xl shadow-slate-200/40">
                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 overflow-hidden border-4 border-white shadow-inner">
                                    <img
                                        src={
                                            user?.avatar ||
                                            `https://ui-avatars.com/api/?name=${user?.name}&background=0f172a&color=fff`
                                        }
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-white hover:scale-110 transition-transform">
                                    <Camera size={16} />
                                </button>
                            </div>
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight truncate">
                                {user?.name || "Guest User"}
                            </h2>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                                Customer Level 01
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 lg:p-10 shadow-xl shadow-slate-200/40">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ProfileInput
                                        label="Full Name"
                                        name="name"
                                        icon={<User size={16} />}
                                        value={userData?.name}
                                        onChange={handleChange}
                                    />
                                    <ProfileInput
                                        label="Email Address"
                                        name="email"
                                        disabled
                                        icon={<Mail size={16} />}
                                        value={userData?.email}
                                    />
                                    <ProfileInput
                                        label="Phone Number"
                                        name="phone"
                                        icon={<Phone size={16} />}
                                        value={userData?.phone}
                                        onChange={handleChange}
                                    />
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                                            Default Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                <MapPin size={16} />
                                            </div>
                                            <input
                                                name="address"
                                                value={
                                                    userData?.addresses?.[0]
                                                        ?.address || ""
                                                }
                                                onChange={(e) =>
                                                    setUserData((pre) => ({
                                                        ...pre,
                                                        addresses: [
                                                            {
                                                                address:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        ],
                                                    }))
                                                }
                                                type="text"
                                                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-300"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-50">
                                    <button
                                        type="submit"
                                        disabled={updateUserLoading}
                                        className="w-full md:w-auto bg-slate-900 text-white px-10 h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 hover:bg-primary transition-all active:scale-95 shadow-xl shadow-slate-900/10 disabled:opacity-50"
                                    >
                                        {updateUserLoading ? (
                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            "Update Profile"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileInput = ({
    label,
    name,
    value,
    onChange,
    disabled,
    icon,
    type = "text",
}) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
            {label}
        </label>
        <div className="relative">
            <div
                className={`absolute left-4 top-1/2 -translate-y-1/2 ${disabled ? "text-slate-300" : "text-slate-400"}`}
            >
                {icon}
            </div>
            <input
                name={name}
                value={value || ""}
                onChange={onChange}
                disabled={disabled}
                type={type}
                className={`w-full border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none transition-all ${
                    disabled
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed opacity-60"
                        : "bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20"
                }`}
            />
        </div>
    </div>
);

export default ProfilePage;
