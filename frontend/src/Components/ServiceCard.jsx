const ServiceCard = ({ image, title, icon: IconComponent }) => {
    return (
        <div
            className="
                relative flex flex-col
                bg-white border border-gray-200 rounded-md
                overflow-hidden
                cursor-pointer
                hover:shadow-md transition-all duration-200
            "
        >
            {/* Image */}
            <div className="relative h-32 w-full">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover
                               brightness-90 transition-transform duration-200
                               hover:scale-105"
                />

                {/* Soft overlay */}
                <div className="absolute inset-0 bg-black/10" />

                {/* Icon badge */}
                <div
                    className="
                    absolute -bottom-5 right-4
                    w-11 h-11
                    bg-[#E6F0FF]
                    border-2 border-white
                    rounded-full
                    flex items-center justify-center
                    shadow-sm
                "
                >
                    <IconComponent className="w-5 h-5 text-gray-900" />
                </div>
            </div>

            {/* Content */}
            <div className="p-4 pt-6">
                <p className="text-gray-900 text-sm font-medium leading-snug max-w-40">
                    {title}
                </p>
            </div>
        </div>
    );
};

export default ServiceCard;
