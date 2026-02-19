import { useState, useEffect } from "react";
import {
    Plus,
    Trash2,
    Edit3,
    Image as ImageIcon,
    Save,
    X,
    Loader2,
    Eye,
    EyeOff,
} from "lucide-react";
import {
    useAddHeroSlide,
    useUpdateHeroSlide,
    useDeleteHeroSlide,
} from "../../features/heros/hero.mutations.js";

import { useHeroSlides } from "../../features/heros/hero.queries.js";

import Input from "../../UI/Input.jsx";

const HeroManager = () => {
    const { data: heroData, isPending } = useHeroSlides();
    const { mutateAsync: addSlide, isPending: addLoading } = useAddHeroSlide();
    const { mutateAsync: updateSlide, isPending: updateLoading } = useUpdateHeroSlide();
    const { mutateAsync: deleteSlide } = useDeleteHeroSlide();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        headline: "",
        subtitle: "",
        bg: "bg-[#e3f0ff]",
        accent: "text-blue-600",
        order: 0,
        isActive: true,
        isRemoveBg: false,
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleEdit = (slide) => {
        setEditingSlide(slide);
        setFormData({
            title: slide.title,
            headline: slide.headline,
            subtitle: slide.subtitle || "",
            bg: slide.bg,
            accent: slide.accent,
            order: slide.order,
            isActive: slide.isActive,
            isRemoveBg: false,
        });
        setPreviewUrl(`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${slide.image}`);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingSlide(null);
        setFormData({
            title: "",
            headline: "",
            subtitle: "",
            bg: "bg-[#e3f0ff]",
            accent: "text-blue-600",
            order: 0,
            isActive: true,
            isRemoveBg: false,
        });
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("data", JSON.stringify(formData));
        if (selectedFile) {
            data.append("image", selectedFile);
        }

        if (editingSlide) {
            await updateSlide({ id: editingSlide._id, formData: data }, {
                onSuccess: () => {
                    handleClose();
                }
            });
        } else {
            await addSlide(data, {
                onSuccess: () => {
                    handleClose();
                }
            });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this slide?")) {
            await deleteSlide(id, {
                onSuccess: () => {
                    handleClose();
                }
            });
        }
    };

    const bgPresets = [
        { name: "Blue Sky", class: "bg-[#e3f0ff]", accent: "text-blue-600" },
        { name: "Peach", class: "bg-[#fff1e6]", accent: "text-orange-600" },
        { name: "Mint", class: "bg-[#e8f5e9]", accent: "text-emerald-600" },
        { name: "Slate", class: "bg-slate-100", accent: "text-slate-900" },
        { name: "Purple", class: "bg-purple-50", accent: "text-purple-600" },
    ];

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                        <ImageIcon className="text-blue-600" size={24} />
                        Hero Slides
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">Manage homepage carousel slides</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-2xl font-medium text-sm hover:bg-blue-700 transition-colors"
                >
                    <Plus size={16} />
                    Add Slide
                </button>
            </header>

            {isPending ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-200 rounded-2xl">
                    <Loader2 className="animate-spin text-blue-600 mb-3" size={32} />
                    <p className="text-sm text-gray-500">Loading slides...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {heroData?.slides.map((slide) => (
                        <div
                            key={slide._id}
                            className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-md transition-all"
                        >
                            <div className={`h-40 relative overflow-hidden ${slide.bg}`}>
                                <img
                                    src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${slide.image}`}
                                    alt={slide.title}
                                    className="w-full h-full object-contain"
                                />
                                <div className="absolute top-3 right-3 flex gap-2">
                                    <div className="p-1.5 rounded-2xl bg-white/90 border border-gray-200 text-gray-700">
                                        {slide.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                                    </div>
                                    <div className="px-2 py-1 rounded-2xl bg-white/90 border border-gray-200 text-gray-700 text-xs font-medium">
                                        #{slide.order}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 space-y-3">
                                <div>
                                    <h3 className={`text-xs font-medium mb-1 ${slide.accent}`}>
                                        {slide.title}
                                    </h3>
                                    <h4 className="text-base font-semibold text-gray-900 leading-tight">
                                        {slide.headline}
                                    </h4>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                                        {slide.subtitle}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <button
                                        onClick={() => handleEdit(slide)}
                                        className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 text-gray-700 py-2 rounded-2xl text-sm font-medium hover:bg-gray-900 hover:text-white transition-all"
                                    >
                                        <Edit3 size={14} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(slide._id)}
                                        className="p-2 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl relative">
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all z-10"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-6 overflow-y-auto max-h-[90vh]">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <ImageIcon className="text-blue-600" size={20} />
                                {editingSlide ? "Edit Slide" : "Add New Slide"}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-700">
                                                Image
                                            </label>
                                            <div
                                                onClick={() => document.getElementById("hero-image").click()}
                                                className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all overflow-hidden"
                                            >
                                                {previewUrl ? (
                                                    <img src={previewUrl} className="w-full h-full object-contain" alt="Preview" />
                                                ) : (
                                                    <>
                                                        <ImageIcon size={32} className="text-gray-300 mb-2" />
                                                        <p className="text-sm text-gray-500">
                                                            Click to upload
                                                        </p>
                                                    </>
                                                )}
                                                <input
                                                    id="hero-image"
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    accept="image/*"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Settings
                                            </label>
                                            <div className="flex flex-col gap-2">
                                                <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.isActive}
                                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">
                                                        Active
                                                    </span>
                                                </label>
                                                <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.isRemoveBg}
                                                        onChange={(e) => setFormData({ ...formData, isRemoveBg: e.target.checked })}
                                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">
                                                        Remove Background
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-700">
                                                Title
                                            </label>
                                            <Input
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="Latest Trending"
                                                className="w-full"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-700">
                                                Headline
                                            </label>
                                            <Input
                                                value={formData.headline}
                                                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                                className="w-full"
                                                placeholder="Electronic Items"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-700">
                                                Subtitle
                                            </label>
                                            <Input
                                                value={formData.subtitle}
                                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                                className="w-full"
                                                placeholder="Premium Tech Selection"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-700">
                                                Order
                                            </label>
                                            <Input
                                                type="number"
                                                value={formData.order}
                                                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                                                className="w-full"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Background Style
                                    </label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {bgPresets.map((preset) => (
                                            <button
                                                key={preset.name}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, bg: preset.class, accent: preset.accent })}
                                                className={`p-2 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 ${formData.bg === preset.class
                                                    ? "border-blue-600 bg-blue-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                <div className={`w-8 h-8 rounded ${preset.class}`} />
                                                <span className="text-xs text-gray-600">
                                                    {preset.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={addLoading || updateLoading}
                                    className="w-full bg-blue-600 text-white py-2.5 rounded-2xl font-medium text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {(addLoading || updateLoading) ? (
                                        <>
                                            <Loader2 className="animate-spin" size={16} />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} />
                                            {editingSlide ? "Update Slide" : "Add Slide"}
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeroManager;
