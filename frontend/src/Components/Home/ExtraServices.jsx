import React from "react";
import { Search, Package, Send, ShieldCheck } from "lucide-react";
import ServiceCard from "../ServiceCard";
import macbook from "../../assets/images/macbook.png";
import paint from "../../assets/images/paint.png";
import phone from "../../assets/images/phone.png";
import camera from "../../assets/images/camera.png";

const ExtraServices = () => {
    const services = [
        {
            id: 1,
            title: "Source from Industry Hubs",
            image: macbook,
            icon: Search,
        },
        {
            id: 2,
            title: "Customize Your Products",
            image: paint,
            icon: Package,
        },
        {
            id: 3,
            title: "Fast, reliable shipping by ocean or air",
            image: phone,
            icon: Send,
        },
        {
            id: 4,
            title: "Product monitoring and inspection",
            image: camera,
            icon: ShieldCheck,
        },
    ];

    return (
        <section className="max-w-7xl mx-auto">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">
                Our extra services
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                {services.map((service) => (
                    <ServiceCard
                        key={service.id}
                        title={service.title}
                        image={service.image}
                        icon={service.icon}
                    />
                ))}
            </div>
        </section>
    );
};

export default ExtraServices;
