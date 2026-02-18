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
import Breadcrumb from "../Components/Breadcrumb.jsx";

const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth);
    const [userData, setUserData] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const dispatch = useDispatch();

    const { updateUser, loading: updateUserLoading } = useUpdateUser();

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Profile" },
    ];

    useEffect(() => {
        if (user) {
            setUserData(user);
        }
    }, [user]);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleAddressChange = (field, value) => {
        setUserData((prev) => ({
            ...prev,
            addresses: [
                {
                    ...(prev?.addresses?.[0] || {}),
                    [field]: value,
                },
            ],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("data", JSON.stringify(userData));
        if (selectedFile) {
            formData.append("avatar", selectedFile);
        }

        const response = await updateUser({ userId: user._id, user: formData });

        if (response && response.user) {
            dispatch(loginSuccess(response.user));
            setSelectedFile(null);
        }
    };

    return (
        <div className="bg-white min-h-screen py-12">
            <div className="container mx-auto px-6 max-w-5xl">
                <Breadcrumb items={breadcrumbItems} />
                <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-10">
                    <div>
                        <h1 className="text-sm font-bold text-zinc-900 uppercase tracking-[0.4em] mb-3">
                            Account Profile
                        </h1>
                        <p className="text-md text-zinc-500 uppercase tracking-widest leading-relaxed max-w-md">
                            Identity verification and logistics configuration.
                            Ensure all data points are current for optimal service.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900 rounded-2xl shadow-sm">
                        <ShieldCheck size={14} className="text-white" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                            Status: Verified
                        </span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-4">
                        <div className="bg-zinc-50 p-10 border border-zinc-100 sticky top-32">
                            <div className="relative w-40 h-40 mx-auto mb-8">
                                <div className="w-full h-full bg-zinc-200 overflow-hidden border border-zinc-100">
                                    <img
                                        src={
                                            avatarPreview ||
                                            user?.avatar ||
                                            `https://ui-avatars.com/api/?name=${user?.name}&background=18181b&color=fff`
                                        }
                                        alt="Avatar"
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                    />
                                </div>
                                <label
                                    htmlFor="avatar-upload"
                                    className="absolute -bottom-3 -right-3 w-12 h-12 bg-zinc-900 text-white flex items-center justify-center hover:bg-zinc-800 transition-colors cursor-pointer shadow-lg"
                                >
                                    <Camera size={18} strokeWidth={1.5} />
                                </label>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <div className="text-center space-y-2">
                                <h2 className="text-[12px] font-bold text-zinc-900 uppercase tracking-[0.2em] truncate">
                                    {user?.name || "Unidentified User"}
                                </h2>
                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.3em]">
                                    Tier: Core Member
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <form onSubmit={handleSubmit} className="space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                                <ProfileInput
                                    label="Legal Identity"
                                    name="name"
                                    icon={<User size={14} />}
                                    value={userData?.name}
                                    onChange={handleChange}
                                />
                                <ProfileInput
                                    label="Digital Address"
                                    name="email"
                                    disabled
                                    icon={<Mail size={14} />}
                                    value={userData?.email}
                                />
                                <ProfileInput
                                    label="Telecommunication"
                                    name="phone"
                                    icon={<Phone size={14} />}
                                    value={userData?.phone}
                                    onChange={handleChange}
                                />
                                <ProfileInput
                                    label="Primary Logistics (Street)"
                                    name="street"
                                    icon={<MapPin size={14} />}
                                    value={userData?.addresses?.[0]?.street || ""}
                                    onChange={(e) => handleAddressChange("street", e.target.value)}
                                />
                                <ProfileInput
                                    label="Unit / Suite"
                                    name="addressLine2"
                                    icon={<MapPin size={14} />}
                                    value={userData?.addresses?.[0]?.addressLine2 || ""}
                                    onChange={(e) => handleAddressChange("addressLine2", e.target.value)}
                                />
                                <ProfileInput
                                    label="Municipality"
                                    name="city"
                                    icon={<MapPin size={14} />}
                                    value={userData?.addresses?.[0]?.city || ""}
                                    onChange={(e) => handleAddressChange("city", e.target.value)}
                                />
                                <ProfileInput
                                    label="Province / Region"
                                    name="state"
                                    icon={<MapPin size={14} />}
                                    value={userData?.addresses?.[0]?.state || ""}
                                    onChange={(e) => handleAddressChange("state", e.target.value)}
                                />
                                <ProfileInput
                                    label="Logistics Code"
                                    name="postalCode"
                                    icon={<MapPin size={14} />}
                                    value={userData?.addresses?.[0]?.postalCode || ""}
                                    onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                                />
                                <div className="md:col-span-2">
                                    <ProfileInput
                                        label="Sovereign Territory (Country)"
                                        name="country"
                                        icon={<MapPin size={14} />}
                                        value={userData?.addresses?.[0]?.country || ""}
                                        onChange={(e) => handleAddressChange("country", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="pt-10">
                                <button
                                    type="submit"
                                    disabled={updateUserLoading}
                                    className="w-full md:w-auto min-w-[240px] bg-zinc-900 text-white px-12 h-14 font-bold uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-4 hover:bg-zinc-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                                >
                                    {updateUserLoading ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <>
                                            Synchronize Profile
                                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
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
    <div className="space-y-3 group">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-[0.25em] flex items-center gap-2">
            {label}
        </label>
        <div className="relative">
            <div
                className={`absolute left-0 top-1/2 -translate-y-1/2 transition-colors ${disabled ? "text-zinc-300" : "text-zinc-500 group-focus-within:text-zinc-900"}`}
            >
                {icon}
            </div>
            <input
                name={name}
                value={value || ""}
                onChange={onChange}
                disabled={disabled}
                type={type}
                className={`w-full border-b border-zinc-200 rounded-2xl pl-8 pr-0 py-3 text-[12px] font-medium tracking-widest outline-none transition-all ${disabled
                    ? "bg-transparent text-zinc-500 cursor-not-allowed opacity-50 border-zinc-100"
                    : "bg-transparent text-zinc-900 focus:border-zinc-900 placeholder:text-zinc-200"
                    }`}
                placeholder="NOT SPECIFIED"
            />
        </div>
    </div>
);

export default ProfilePage;
