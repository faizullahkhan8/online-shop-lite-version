import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from "../store/slices/authSlice";
import { useUpdateUser } from "../api/hooks/user.api";

const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth);
    const [userData, setUserData] = useState(null);
    const dispatch = useDispatch();

    const { updateUser, loading: updateUserLoading } = useUpdateUser();

    useEffect(() => {
        if (user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
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
        <div className="container py-6">
            <h1 className="text-2xl font-bold mb-6">My Profile</h1>
            <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                        <img
                            src={
                                user?.avatar ||
                                `https://ui-avatars.com/api/?name=${user?.name}`
                            }
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {user?.name || "Guest User"}
                        </h2>
                        <p className="text-gray-500">{user?.email}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                Full Name
                            </label>
                            <input
                                name="name"
                                value={userData?.name || ""}
                                onChange={handleChange}
                                type="text"
                                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                Email
                            </label>
                            <input
                                disabled
                                title="Cannot change email"
                                name="email"
                                value={userData?.email || ""}
                                onChange={handleChange}
                                type="email"
                                className="w-full border border-gray-300 rounded px-3 py-2 outline-none bg-gray-50 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                Phone
                            </label>
                            <input
                                name="phone"
                                value={userData?.phone || ""}
                                onChange={handleChange}
                                type="text"
                                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                Address (first address)
                            </label>
                            <input
                                name="address"
                                value={userData?.addresses?.[0]?.address || ""}
                                onChange={(e) =>
                                    setUserData((pre) => ({
                                        ...pre,
                                        addresses: [
                                            { address: e.target.value },
                                        ],
                                    }))
                                }
                                type="text"
                                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary"
                            />
                        </div>
                    </div>
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={updateUserLoading}
                            className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition-colors"
                        >
                            {updateUserLoading ? "Updating..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
