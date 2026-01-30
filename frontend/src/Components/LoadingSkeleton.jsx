/**
 * Loading Skeleton Component
 * Shows animated placeholder while content is loading
 * Makes the app feel faster and more responsive
 */

const LoadingSkeleton = ({ count = 1, height = "h-48" }) => {
    // Create array of skeleton items based on count
    const skeletons = Array.from({ length: count }, (_, index) => index);

    return (
        <>
            {skeletons.map((item) => (
                <div key={item} className="animate-pulse">
                    {/* Image placeholder */}
                    <div className={`${height} bg-gray-200 rounded-md`}></div>
                    
                    {/* Title placeholder */}
                    <div className="h-4 bg-gray-200 rounded mt-3"></div>
                    
                    {/* Price placeholder (shorter) */}
                    <div className="h-4 bg-gray-200 rounded mt-2 w-3/4"></div>
                </div>
            ))}
        </>
    );
};

export default LoadingSkeleton;
