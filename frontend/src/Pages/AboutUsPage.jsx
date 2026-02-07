import { Link } from "react-router-dom";
import { Globe, Mail, MapPin, Phone, Award } from "lucide-react";
import TestAvatar from "../assets/images/avatar.jpg";

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}

            <div className="container mx-auto px-4 lg:px-8 py-16">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl lg:text-6xl font-black text-slate-900 m-4 tracking-tight">
                        About <span className="text-primary">E-Shop</span>
                    </h1>
                    <p className="text-lg text-slate-600">
                        Your trusted destination for premium quality products
                        and exceptional service.
                    </p>
                </div>
            </div>

            {/* Admin Section */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        <div className="grid lg:grid-cols-2 gap-0">
                            {/* Admin Image */}
                            <div className="bg-gradient-to-br from-primary/10 to-slate-50 p-8 lg:p-12 flex items-center justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"></div>
                                    <div className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-2xl shadow-primary/30">
                                        <div className="text-center">
                                            <img
                                                src={TestAvatar}
                                                alt="avatar"
                                                className="w-full h-full rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Admin Details */}
                            <div className="p-8 lg:p-12 flex flex-col justify-center">
                                <div className="mb-6">
                                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full mb-4">
                                        <span className="text-xs font-bold uppercase tracking-wider">
                                            Founder & CEO
                                        </span>
                                    </div>
                                    <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-3">
                                        Faiz Ullah Khan
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed mb-6">
                                        A passionate entrepreneur dedicated to
                                        revolutionizing the e-commerce
                                        experience. With a vision to provide
                                        quality products and exceptional
                                        customer service, Faiz founded E-Shop to
                                        create a trusted marketplace for
                                        everyone.
                                    </p>
                                </div>

                                {/* Contact Information */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-slate-700">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <Mail size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                Email
                                            </p>
                                            <p className="font-semibold">
                                                faiz@eshop.com
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-slate-700">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                Phone
                                            </p>
                                            <p className="font-semibold">
                                                +92 300 1234567
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-slate-700">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                Location
                                            </p>
                                            <p className="font-semibold">
                                                Islamabad, Pakistan
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 bg-white border-y border-slate-200">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                            <h3 className="text-2xl font-black text-slate-900 mb-4">
                                Our Mission
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                To provide our customers with the best shopping
                                experience by offering high-quality products,
                                competitive prices, and outstanding customer
                                service. We strive to build lasting
                                relationships based on trust and satisfaction.
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                            <h3 className="text-2xl font-black text-slate-900 mb-4">
                                Our Vision
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                To become the most trusted and preferred
                                e-commerce platform, known for innovation,
                                reliability, and customer-centric approach. We
                                aim to make online shopping accessible,
                                enjoyable, and rewarding for everyone.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 text-white text-center shadow-2xl">
                        <h2 className="text-3xl lg:text-4xl font-black mb-4">
                            Ready to Start Shopping?
                        </h2>
                        <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                            Discover our wide range of premium products and
                            enjoy a seamless shopping experience.
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-xl shadow-primary/30"
                        >
                            Browse Products
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
