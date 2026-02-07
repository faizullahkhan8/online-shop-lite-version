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
    MoveUp,
    MoveDown,
} from "lucide-react";
import {
    useGetHeroSlides,
    useAddHeroSlide,
    useUpdateHeroSlide,
    useDeleteHeroSlide,
} from "../../api/hooks/hero.api.js";
import Input from "../../UI/Input.jsx";

const HeroManager = () => {
    const { getSlides, slides, loading } = useGetHeroSlides();
    const { addSlide, loading: addLoading } = useAddHeroSlide();
    const { updateSlide, loading: updateLoading } = useUpdateHeroSlide();
    const { deleteSlide } = useDeleteHeroSlide();

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

    useEffect(() => {
        getSlides();
    }, [getSlides]);

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

        let res;
        if (editingSlide) {
            res = await updateSlide(editingSlide._id, data);
        } else {
            res = await addSlide(data);
        }

        if (res?.success) {
            handleClose();
            getSlides();
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this slide?")) {
            const res = await deleteSlide(id);
            if (res?.success) {
                getSlides();
            }
        }
    };

    const bgPresets = [
        { name: "Blue Sky", class: "bg-[#e3f0ff]", accent: "text-blue-600" },
        { name: "Peach Sun", class: "bg-[#fff1e6]", accent: "text-orange-600" },
        { name: "Mint Fresh", class: "bg-[#e8f5e9]", accent: "text-emerald-600" },
        { name: "Industrial Slate", class: "bg-slate-100", accent: "text-slate-900" },
        { name: "Cyber Purple", class: "bg-purple-50", accent: "text-purple-600" },
    ];

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-1">
                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4">
                        <div className="p-3 bg-primary rounded-2xl text-white shadow-xl shadow-primary/20">
                            <ImageIcon size={28} />
                        </div>
                        Hero{" "}
                        <span className="text-primary text-outline-1">
                            Management
                        </span>
                    </h2>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="group bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-primary transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                    Deploy New Slide
                </button>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/50">
                    <Loader2 className="animate-spin text-primary mb-4" size={40} />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">
                        Synchronizing Slides...
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {slides.map((slide) => (
                        <div
                            key={slide._id}
                            className="group relative bg-white border border-slate-100 rounded-4xl overflow-hidden shadow-xl shadow-slate-200/40 hover:border-primary/20 transition-all"
                        >
                            <div className={`h-48 relative overflow-hidden ${slide.bg}`}>
                                <img
                                    src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${slide.image}`}
                                    alt={slide.title}
                                    className="w-full h-full object-contain"
                                />
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <div className={`p-2 rounded-xl backdrop-blur-md bg-white/50 border border-white/20 text-slate-900`}>
                                        {slide.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                                    </div>
                                    <div className="p-2 rounded-xl backdrop-blur-md bg-white/50 border border-white/20 text-slate-900 font-black text-[10px]">
                                        #{slide.order}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <h3 className={`text-[10px] font-black uppercase tracking-widest mb-1 ${slide.accent}`}>
                                        {slide.title}
                                    </h3>
                                    <h4 className="text-xl font-black text-slate-900 leading-tight">
                                        {slide.headline}
                                    </h4>
                                    <p className="text-xs font-medium text-slate-400 mt-1 line-clamp-1">
                                        {slide.subtitle}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <button
                                        onClick={() => handleEdit(slide)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-slate-50 text-slate-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all group"
                                    >
                                        <Edit3 size={14} className="group-hover:scale-110 transition-transform" />
                                        Modify
                                    </button>
                                    <button
                                        onClick={() => handleDelete(slide._id)}
                                        className="p-3 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
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
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
                        <button
                            onClick={handleClose}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all z-10"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8 lg:p-12 overflow-y-auto max-h-[90vh]">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-8 flex items-center gap-3">
                                <div className="p-2 bg-primary rounded-xl text-white">
                                    <ImageIcon size={20} />
                                </div>
                                {editingSlide ? "Edit Slide" : "Initialize New Slide"}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                                Image Content
                                            </label>
                                            <div
                                                onClick={() => document.getElementById("hero-image").click()}
                                                className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-4 cursor-pointer hover:border-primary hover:bg-slate-100 transition-all group overflow-hidden"
                                            >
                                                {previewUrl ? (
                                                    <img src={previewUrl} className="w-full h-full object-contain" alt="Preview" />
                                                ) : (
                                                    <>
                                                        <ImageIcon size={32} className="text-slate-300 mb-2 group-hover:text-primary transition-colors" />
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                            Click to Upload
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
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                                Active Status
                                            </label>
                                            <div className="flex flex-col gap-2">
                                                <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.isActive}
                                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                        className="w-5 h-5 rounded-lg border-2 border-slate-200 text-primary focus:ring-primary/20 transition-all"
                                                    />
                                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest text-nowrap">
                                                        Slide Visibility
                                                    </span>
                                                </label>
                                                <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.isRemoveBg}
                                                        onChange={(e) => setFormData({ ...formData, isRemoveBg: e.target.checked })}
                                                        className="w-5 h-5 rounded-lg border-2 border-slate-200 text-primary focus:ring-primary/20 transition-all"
                                                    />
                                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest text-nowrap">
                                                        Remove Bg
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 text-nowrap">
                                        <div className="space-y-2 flex flex-col items-start">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 ">
                                                Title (e.g. Latest Trending)
                                            </label>
                                            <Input
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="Collection Name"
                                                className="w-full"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2 flex flex-col items-start">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                                Headline (e.g. Electronic Items)
                                            </label>
                                            <Input
                                                value={formData.headline}
                                                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                                className="w-full"
                                                placeholder="Main Promotion"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2 flex flex-col items-start">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                                Subtitle (e.g. Premium Tech Selection)
                                            </label>
                                            <Input
                                                value={formData.subtitle}
                                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                                className="w-full"
                                                placeholder="Supporting Context"
                                            />
                                        </div>
                                        <div className="space-y-2 flex flex-col items-start">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                                Sequence Order
                                            </label>
                                            <Input
                                                type="number"
                                                value={formData.order}
                                                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                                                className="w-full"
                                                placeholder="Sort Order"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 flex flex-col items-start">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Style Presets
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                        {bgPresets.map((preset) => (
                                            <button
                                                key={preset.name}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, bg: preset.class, accent: preset.accent })}
                                                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                                                    formData.bg === preset.class ? "border-primary bg-primary/5" : "border-slate-100 hover:border-slate-200"
                                                }`}
                                            >
                                                <div className={`w-8 h-8 rounded-lg shadow-inner ${preset.class}`} />
                                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap">
                                                    {preset.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={addLoading || updateLoading}
                                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {(addLoading || updateLoading) ? (
                                        <Loader2 className="animate-spin" size={18} />
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            {editingSlide ? "Update Node" : "Deploy Slide"}
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
