import { useEffect } from "react";
import { useGetProductReviews } from "../../api/hooks/review.api.js";
import StarRating from "../UI/StarRating.jsx";
import { MessageSquare, Calendar, Loader2 } from "lucide-react";

const ProductReviews = ({ productId }) => {
    const {
        getReviews,
        reviews,
        loading: reviewsLoading,
    } = useGetProductReviews();

    useEffect(() => {
        if (productId) {
            getReviews(productId);
        }
    }, [productId, getReviews]);

    return (
        <div className="space-y-8 sm:space-y-10 lg:space-y-12 py-8 sm:py-10 lg:py-12 border-t border-zinc-100">

            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h3 className="text-xs sm:text-sm font-bold text-zinc-900 uppercase tracking-[0.25em] mb-1 sm:mb-2">
                        Customer Reviews
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-500 uppercase tracking-widest font-medium">
                        {reviews.length}{" "}
                        {reviews.length === 1 ? "entry" : "entries"} recorded
                    </p>
                </div>
                <div className="hidden lg:block h-[1px] flex-1 mx-12 bg-zinc-100"></div>
            </header>

            {/* Grid */}
            <div className="w-full">
                <div className="w-full space-y-6">

                    {/* Loading */}
                    {reviewsLoading ? (
                        <div className="flex flex-col items-center justify-center py-16 sm:py-20 bg-white border border-zinc-100 rounded-xl">
                            <Loader2
                                className="animate-spin text-zinc-200 mb-4"
                                size={22}
                            />
                            <p className="text-xs sm:text-sm uppercase tracking-widest text-zinc-500">
                                Syncing Reviews...
                            </p>
                        </div>
                    ) : reviews.length === 0 ? (

                        /* Empty */
                        <div className="flex flex-col items-center justify-center py-16 sm:py-20 bg-zinc-50 border border-dashed border-zinc-200 rounded-xl">
                            <MessageSquare
                                className="text-zinc-200 mb-4"
                                size={28}
                                strokeWidth={1}
                            />
                            <p className="text-xs sm:text-sm uppercase tracking-widest text-zinc-500 text-center px-6">
                                No commentary available for this item.
                            </p>
                        </div>

                    ) : (

                        /* Reviews */
                        <div className="divide-y divide-zinc-100">
                            {reviews.map((review) => (
                                <div
                                    key={review._id}
                                    className="py-6 sm:py-8 first:pt-0"
                                >
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">

                                        {/* Left Section */}
                                        <div className="flex gap-4">
                                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-zinc-900 text-white flex items-center justify-center text-xs sm:text-sm font-bold uppercase rounded-xl shrink-0">
                                                {review.name.substring(0, 2)}
                                            </div>

                                            <div>
                                                <h5 className="text-sm sm:text-md font-bold text-zinc-900 tracking-wider mb-1">
                                                    {review.name}
                                                </h5>

                                                <p className="text-[11px] sm:text-xs text-zinc-500 break-all">
                                                    {review.email}
                                                </p>

                                                <div className="flex items-center gap-2 text-[10px] sm:text-xs text-zinc-500 font-medium mt-1">
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

                                        {/* Rating */}
                                        <div className="self-start sm:self-auto">
                                            <StarRating
                                                rating={review.rating}
                                                readonly
                                                size={12}
                                            />
                                        </div>
                                    </div>

                                    {/* Comment */}
                                    <p className="text-xs sm:text-[13px] text-zinc-700 leading-relaxed font-light sm:pl-14 pr-2">
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
