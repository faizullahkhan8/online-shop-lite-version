import { Star, StarHalf } from "lucide-react";

const StarRating = ({ rating, setRating, readonly = false, size = 18 }) => {
    const handleRating = (index) => {
        if (!readonly && setRating) {
            setRating(index);
        }
    };

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((index) => {
                const isFull = rating >= index;
                const isHalf = rating >= index - 0.5 && rating < index;

                return (
                    <div
                        key={index}
                        onClick={() => handleRating(index)}
                        className={`${!readonly ? "cursor-pointer" : ""}`}
                    >
                        {isFull ? (
                            <Star
                                size={size}
                                fill="currentColor"
                                className="text-yellow-400"
                            />
                        ) : isHalf ? (
                            <StarHalf
                                size={size}
                                fill="currentColor"
                                className="text-yellow-400"
                            />
                        ) : (
                            <Star size={size} className="text-slate-300" />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default StarRating;
