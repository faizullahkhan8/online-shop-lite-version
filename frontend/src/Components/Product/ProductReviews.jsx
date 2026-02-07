import { useState, useEffect } from "react";
import { useAddReview, useGetProductReviews } from "../../api/hooks/review.api.js";
import StarRating from "../UI/StarRating.jsx";
import { MessageSquare, User, Calendar, Loader2 } from "lucide-react";

const ProductReviews = ({ productId }) => {
    const { getReviews, reviews, loading: reviewsLoading } = useGetProductReviews();
    const { addReview, loading: addLoading } = useAddReview();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    useEffect(() => {
        if (productId) {
            getReviews(productId);
        }
    }, [productId, getReviews]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            return;
        }
        const res = await addReview({ productId, rating, comment });
        if (res?.success) {
            setRating(0);
            setComment("");
            getReviews(productId);
        }
    };

    return (
        <div className="space-y-12 py-12 border-t border-slate-100">
            <header className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <MessageSquare size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                        Customer Reviews
                    </h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"} for this product
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Review Form */}
                <div className="lg:col-span-5">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 sticky top-24">
                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">
                            Write a Review
                        </h4>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                    Rating
                                </label>
                                <StarRating rating={rating} setRating={setRating} size={24} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                    Your Experience
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell others what you think..."
                                    className="w-full bg-white border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 min-h-[120px] resize-none"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={addLoading || rating === 0}
                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {addLoading ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : (
                                    "Submit Review"
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Review List */}
                <div className="lg:col-span-7 space-y-6">
                    {reviews.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-slate-200 rounded-[2.5rem]">
                            <MessageSquare className="text-slate-200 mb-4" size={48} />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">
                                No reviews yet. Be the first to share your experience!
                            </p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div
                                key={review._id}
                                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all space-y-4"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-black text-slate-900 uppercase">
                                                {review.name}
                                            </h5>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                <Calendar size={10} />
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <StarRating rating={review.rating} readonly size={14} />
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    {review.comment}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductReviews;
