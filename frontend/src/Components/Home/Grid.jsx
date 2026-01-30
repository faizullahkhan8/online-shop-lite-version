import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import Button from "../../UI/Button";
import { Link } from "react-router-dom";

const Grid = ({ title, bannerImg, items }) => {
    const dispatch = useDispatch();
    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex bg-white border border-gray-200 rounded-md overflow-hidden min-h-65 max-sm:flex-col">
                {/* Left Banner */}
                <div
                    className="w-70 p-6 bg-cover bg-center flex flex-col justify-between relative"
                    style={{ backgroundImage: `url(${bannerImg})` }}
                >
                    <div>
                        <h3 className="bg-amber-300 text-2xl font-bold text-white w-36 leading-tight mb-4">
                            {title}
                        </h3>
                        <button className="px-4 py-2 bg-white text-gray-900 font-medium rounded-md shadow-sm hover:bg-gray-50 text-sm transition">
                            Source now
                        </button>
                    </div>
                </div>

                {/* Right Grid */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4">
                    {items?.map((item, idx) => (
                        <div
                            key={idx}
                            className="border border-gray-200 border-l-0 p-4 relative group bg-white hover:shadow-lg transition-shadow duration-300 z-0 hover:z-10"
                        >
                            <Link to={`/product/${item?._id}`}>
                                <div className="mb-2">
                                    <h4 className=" text-xs text-gray-900 font-medium mb-1 group-hover:text-primary transition-colors">
                                        {item.name}
                                    </h4>
                                    <p className="text-gray-400 text-xs">
                                        From{" "}
                                        <span className="text-gray-600">
                                            Rs: {item.price}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <img
                                        src={`${
                                            import.meta.env.VITE_BACKEND_URL
                                        }/${item.image}`}
                                        alt={item.name}
                                        className="w-20 h-20 object-contain group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                            </Link>
                            <div className="w-full">
                                <Button
                                    className={"w-full"}
                                    onClick={() => dispatch(addToCart(item))}
                                    size="sm"
                                >
                                    Add to Cart
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Grid;
