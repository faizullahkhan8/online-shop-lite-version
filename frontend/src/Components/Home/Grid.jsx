import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import Button from "../../UI/Button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Grid = ({ title, bannerImg, items }) => {
    const dispatch = useDispatch();

    return (
        <div className="container mx-auto px-4 lg:px-8 mb-12">
            <div className="flex bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm max-sm:flex-col">
                <div
                    className="w-full lg:w-72 p-8 bg-cover bg-center flex flex-col justify-between relative min-h-[300px] lg:min-h-[auto]"
                    style={{ backgroundImage: `url(${bannerImg})` }}
                >
                    <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] lg:backdrop-blur-none lg:bg-transparent" />

                    <div className="relative z-10">
                        <h3 className="text-2xl font-black text-slate-900 leading-tight mb-6 max-w-[150px]">
                            {title}
                        </h3>
                        <button className="group flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 font-bold rounded-xl shadow-lg shadow-slate-200/50 hover:bg-slate-900 hover:text-white transition-all text-xs uppercase tracking-widest">
                            Source now
                            <ArrowRight
                                size={14}
                                className="group-hover:translate-x-1 transition-transform"
                            />
                        </button>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-2 md:grid-cols-4">
                    {items?.map((item, idx) => (
                        <div
                            key={idx}
                            className="border-slate-50 border-b border-r last:border-r-0 md:[&:nth-child(4)]:border-r-0 p-5 relative group bg-white hover:bg-slate-50/30 transition-all duration-300"
                        >
                            <Link
                                to={`/product/${item?._id}`}
                                className="block"
                            >
                                <div className="mb-4">
                                    <h4 className="text-[13px] text-slate-700 font-bold mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                        {item.name}
                                    </h4>
                                    <p className="text-slate-400 text-[11px] font-medium">
                                        Starting at{" "}
                                        <span className="text-slate-900 font-black">
                                            Rs: {item.price}
                                        </span>
                                    </p>
                                </div>

                                <div className="flex justify-center items-center h-28 mb-4">
                                    <img
                                        src={`${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${item.image}`}
                                        alt={item.name}
                                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300 mix-blend-multiply"
                                    />
                                </div>
                            </Link>

                            <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                <Button
                                    className="w-full bg-slate-900 hover:bg-primary text-white rounded-xl py-2 font-black text-[10px] uppercase tracking-tighter"
                                    onClick={() => dispatch(addToCart(item))}
                                    size="sm"
                                >
                                    Quick Add
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
