import React from "react";
import Image from "./Image";
import Newsletter from "./Newsletter";

function Footer() {
  return (
    <div className="w-full bg-white">
      <div className="w-full px-4 lg:px-24 relative z-20">
        <Newsletter />
      </div>

      <footer className="w-full bg-[#F0F0F0] text-black -mt-20 lg:-mt-24 pt-28 lg:pt-32 pb-8 px-4 lg:px-24">
        <div className="flex flex-col lg:flex-row justify-between gap-8 pb-10 border-b border-black/10">
          <div className="max-w-[248px]">
            <h2 className="font-integral-bold text-28 lg:text-32 tracking-tight mb-4">
              SHOP.CO
            </h2>
            <p className="text-sm text-black/60 font-satoshi-regular mb-6">
              We have clothes that suits your style and which you’re proud to wear. From women to men.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-7 h-7 bg-white rounded-full flex items-center justify-center border border-black/10">
                <Image src="/icons/twitter.svg" alt="twitter" className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center">
                <Image src="/icons/facebook.svg" alt="facebook" className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 bg-white rounded-full flex items-center justify-center border border-black/10">
                <Image src="/icons/insta.svg" alt="instagram" className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 bg-white rounded-full flex items-center justify-center border border-black/10">
                <Image src="/icons/github.svg" alt="github" className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1 lg:ml-16">
            <div>
              <h3 className="font-satoshi-medium text-base tracking-widest uppercase mb-4">COMPANY</h3>
              <ul className="space-y-3 text-sm text-black/60 font-satoshi-regular">
                <li><a href="#" className="hover:text-black">About</a></li>
                <li><a href="#" className="hover:text-black">Features</a></li>
                <li><a href="#" className="hover:text-black">Works</a></li>
                <li><a href="#" className="hover:text-black">Career</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-satoshi-medium text-base tracking-widest uppercase mb-4">HELP</h3>
              <ul className="space-y-3 text-sm text-black/60 font-satoshi-regular">
                <li><a href="#" className="hover:text-black">Customer Support</a></li>
                <li><a href="#" className="hover:text-black">Delivery Details</a></li>
                <li><a href="#" className="hover:text-black">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-black">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-satoshi-medium text-base tracking-widest uppercase mb-4">FAQ</h3>
              <ul className="space-y-3 text-sm text-black/60 font-satoshi-regular">
                <li><a href="#" className="hover:text-black">Account</a></li>
                <li><a href="#" className="hover:text-black">Manage Deliveries</a></li>
                <li><a href="#" className="hover:text-black">Orders</a></li>
                <li><a href="#" className="hover:text-black">Payments</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-satoshi-medium text-base tracking-widest uppercase mb-4">RESOURCES</h3>
              <ul className="space-y-3 text-sm text-black/60 font-satoshi-regular">
                <li><a href="#" className="hover:text-black">Free eBooks</a></li>
                <li><a href="#" className="hover:text-black">Development Tutorial</a></li>
                <li><a href="#" className="hover:text-black">How to - Blog</a></li>
                <li><a href="#" className="hover:text-black">Youtube Playlist</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-black/60 font-satoshi-regular">
          <p>Shop.co © 2000-2023, All Rights Reserved</p>
          <img src="/images/brands.png" alt="brands-icon" width={250}/>
        </div>
      </footer>
    </div>
  );
}

export default Footer;