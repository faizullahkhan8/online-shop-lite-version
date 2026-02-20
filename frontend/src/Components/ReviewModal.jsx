import { useState } from "react";
import { X, Loader2, Star } from "lucide-react";
import { useAddReview } from "../features/review.all.js";

const ReviewModal = ({
    isOpen,
    onClose,
    product,
    orderRecipient,
    onSuccess,
}) => {
    const addReviewMutation = useAddReview();
    const [rating, setRating] = useState(5);
    const [formData, setFormData] = useState({
        name: orderRecipient?.name || "",
        email: orderRecipient?.email || "",
        comment: "",
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const reviewData = {
            productId: product._id || product.id,
            rating,
            ...formData,
        };

        try {
            await addReviewMutation.mutateAsync(reviewData);

            if (onSuccess) {
                onSuccess(product._id || product.id);
            }

            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="relative p-8">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="mb-8">
                        <h2 className="text-xl font-bold uppercase tracking-widest text-zinc-900 mb-2">
                            Give Review
                        </h2>
                        <p className="text-sm text-zinc-500 uppercase tracking-widest">
                            {product.name}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Rating */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                Your Rating
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <Star
                                            size={24}
                                            className={
                                                star <= rating
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-zinc-200"
                                            }
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                Full Name
                            </label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Your name..."
                                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-sm tracking-widest focus:outline-none focus:border-zinc-900 transition-all"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                Email Address
                            </label>
                            <input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                placeholder="Your email..."
                                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-sm tracking-widest focus:outline-none focus:border-zinc-900 transition-all"
                            />
                        </div>

                        {/* Commentary */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                Your Commentary
                            </label>
                            <textarea
                                required
                                value={formData.comment}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        comment: e.target.value,
                                    })
                                }
                                placeholder="Describe your exprerience..."
                                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-6 text-sm tracking-widest focus:border-zinc-900 outline-none transition-all min-h-[120px] resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={addReviewMutation.isPending}
                            className="w-full bg-zinc-900 text-white py-5 text-sm font-bold uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all disabled:opacity-50 rounded-2xl flex items-center justify-center gap-3"
                        >
                            {addReviewMutation.isPending ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                "Submit Review"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
