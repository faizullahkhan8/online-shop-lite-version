import { useState, useEffect } from "react";
import {
    useAddReview,
    useGetProductReviews,
} from "../../api/hooks/review.api.js";
import StarRating from "../UI/StarRating.jsx";
import { MessageSquare, User, Calendar, Loader2, PenLine } from "lucide-react";

const ProductReviews = ({ productId }) => {
    const {
        getReviews,
        reviews,
        loading: reviewsLoading,
    } = useGetProductReviews();
    const { addReview, loading: addLoading } = useAddReview();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    useEffect(() => {
        if (productId) {
            getReviews(productId);
        }
    }, [productId, getReviews]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return;

        const res = await addReview({
            productId,
            rating,
            comment,
            name,
            email,
        });

        if (res?.success) {
            setRating(0);
            setComment("");
            getReviews(productId);
        }
    };

    return (
        <div className="space-y-12 py-12 border-t border-zinc-100">
            <header className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-[0.3em] mb-2">
                        Customer Reviews
                    </h3>
                    <p className="text-sm text-zinc-400 uppercase tracking-widest font-medium">
                        {reviews.length}{" "}
                        {reviews.length === 1 ? "entry" : "entries"} recorded
                    </p>
                </div>
                <div className="hidden lg:block h-[1px] flex-1 mx-12 bg-zinc-100"></div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-4">
                    <div className="bg-zinc-50 p-8 rounded-2xl border border-zinc-100 sticky top-32">
                        <div className="flex items-center gap-3 mb-8">
                            <PenLine size={16} className="text-zinc-900" />
                            <h4 className="text-md font-bold text-zinc-900 uppercase tracking-[0.2em]">
                                Create Review
                            </h4>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                    Product Rating
                                </label>
                                <StarRating
                                    rating={rating}
                                    setRating={setRating}
                                    size={20}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-zinc-400 tracking-widest">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full border border-zinc-200 px-4 py-2 rounded-2xl text-sm"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-zinc-400 tracking-widest">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full border border-zinc-200 px-4 py-2 rounded-2xl text-sm"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-zinc-400 tracking-widest">
                                    Your Commentary
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Describe your experience..."
                                    className="w-full border border-zinc-200 rounded-2xl p-4 text-md uppercase tracking-widest focus:border-zinc-900 outline-none transition-all placeholder:text-zinc-300 min-h-[150px] resize-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={addLoading || rating === 0}
                                className="w-full bg-zinc-900 text-white py-4 text-md font-bold uppercase tracking-[0.25em] hover:bg-zinc-700 transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:cursor-not-allowed rounded-2xl"
                            >
                                {addLoading ? (
                                    <Loader2
                                        className="animate-spin"
                                        size={14}
                                    />
                                ) : (
                                    "Post Review"
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-8 space-y-6">
                    {reviewsLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white border border-zinc-100">
                            <Loader2
                                className="animate-spin text-zinc-200 mb-4"
                                size={24}
                            />
                            <p className="text-sm uppercase tracking-widest text-zinc-400">
                                Syncing Reviews...
                            </p>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-zinc-50 border border-dashed border-zinc-200">
                            <MessageSquare
                                className="text-zinc-200 mb-4"
                                size={32}
                                strokeWidth={1}
                            />
                            <p className="text-sm uppercase tracking-widest text-zinc-400 text-center">
                                No commentary available for this item.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-100">
                            {reviews.map((review) => (
                                <div
                                    key={review._id}
                                    className="py-8 first:pt-0 group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-zinc-900 text-white flex items-center justify-center text-sm font-bold uppercase rounded-2xl">
                                                {review.name.substring(0, 2)}
                                            </div>
                                            <div>
                                                <h5 className="text-md font-bold text-zinc-900 tracking-widest mb-1">
                                                    {review.name}
                                                </h5>
                                                <p className="text-xs text-zinc-400">
                                                    {review.email}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-zinc-400 font-bold tracking-tighter">
                                                    <Calendar size={10} />
                                                    {new Date(
                                                        review.createdAt,
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <StarRating
                                            rating={review.rating}
                                            readonly
                                            size={12}
                                        />
                                    </div>
                                    <p className="text-[13px] text-zinc-500 leading-relaxed font-light pl-14 pr-4">
                                        {review.comment}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductReviews;
