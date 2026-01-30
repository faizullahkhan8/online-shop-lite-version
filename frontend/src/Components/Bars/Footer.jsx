import { ShoppingCart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-200">
      <div className="container grid grid-cols-1 md:grid-cols-6 gap-8 mb-12">
        {/* Brand Column */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-primary rounded p-1 text-white">
              <ShoppingCart size={24} />
            </div>
            <span className="text-xl font-bold text-secondary-dark">Brand</span>
          </div>
          <p className="text-gray-500 text-sm mb-4 leading-relaxed">
            Best information about the company gies here but now lorem ipsum is
          </p>
          <div className="flex gap-3">
             {/* Social placeholders */}
             <div className="w-8 h-8 rounded-full bg-gray-300"></div>
             <div className="w-8 h-8 rounded-full bg-gray-300"></div>
             <div className="w-8 h-8 rounded-full bg-gray-300"></div>
             <div className="w-8 h-8 rounded-full bg-gray-300"></div>
             <div className="w-8 h-8 rounded-full bg-gray-300"></div>
          </div>
        </div>

        {/* Links Columns */}
        <div>
            <h4 className="font-medium mb-3">About</h4>
            <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Find store</a></li>
                <li><a href="#" className="hover:text-primary">Categories</a></li>
                <li><a href="#" className="hover:text-primary">Blogs</a></li>
            </ul>
        </div>
        <div>
            <h4 className="font-medium mb-3">Partnership</h4>
            <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Find store</a></li>
                <li><a href="#" className="hover:text-primary">Categories</a></li>
                <li><a href="#" className="hover:text-primary">Blogs</a></li>
            </ul>
        </div>
        <div>
            <h4 className="font-medium mb-3">Information</h4>
            <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">Money Refund</a></li>
                <li><a href="#" className="hover:text-primary">Shipping</a></li>
                <li><a href="#" className="hover:text-primary">Contact us</a></li>
            </ul>
        </div>
        <div>
            <h4 className="font-medium mb-3">For users</h4>
            <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-primary">Login</a></li>
                <li><a href="#" className="hover:text-primary">Register</a></li>
                <li><a href="#" className="hover:text-primary">Settings</a></li>
                <li><a href="#" className="hover:text-primary">My Orders</a></li>
            </ul>
        </div>

        {/* Get App */}
        <div>
            <h4 className="font-medium mb-3">Get app</h4>
            <div className="flex flex-col gap-2">
                <div className="bg-black text-white px-3 py-2 rounded flex items-center gap-2 w-32 cursor-pointer">
                    <div className="w-6 h-6 bg-white/20 rounded-full"></div> {/* specific icon placeholder */}
                    <div className="text-xs">
                        <div className="scale-75 origin-left">Download on the</div>
                        <div className="font-bold">App Store</div>
                    </div>
                </div>
                <div className="bg-black text-white px-3 py-2 rounded flex items-center gap-2 w-32 cursor-pointer">
                     <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                    <div className="text-xs">
                        <div className="scale-75 origin-left">Get it on</div>
                        <div className="font-bold">Google Play</div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="container bg-gray-100 p-4 rounded flex justify-between items-center text-sm text-gray-500">
           <p>© 2023 Ecommerce.</p>
           <div className="flex items-center gap-2">
               <img src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" alt="USA" className="w-5 h-3 object-cover" />
               <span>English ▾</span>
           </div>
      </div>
    </footer>
  );
};

export default Footer;
