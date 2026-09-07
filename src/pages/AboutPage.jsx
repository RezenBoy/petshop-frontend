import React from "react";
import { Heart, PawPrint, Shield, Truck, Smile, ArrowRight, Package, Award, HeadphonesIcon } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/user/NavBar";
import Footer from "../components/common/user/Footer";
import { BRAND } from "../components/common/brand";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* <div className="h-16" /> */}

      {/* ── Hero ── */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-pink-50 via-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest text-pink-500 uppercase mb-3">
            Our Story
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            About{" "}
            <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
              {BRAND.name}
            </span>
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Because every wag, purr, and cuddle deserves care, comfort, and love.
            We're here to make your pets' world a happier place.
          </p>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            <div className="flex-1">
              <img
                src="https://images.unsplash.com/photo-1558944351-c0e86f1f1cf4?auto=format&fit=crop&w=800&q=80"
                alt="Pets with owners"
                className="rounded-2xl w-full object-cover shadow-sm border border-gray-100"
              />
            </div>

            <div className="flex-1 text-left">
              <span className="text-xs font-semibold tracking-widest text-pink-500 uppercase">
                Who We Are
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-4 leading-tight">
                Built for pets,<br /> by pet lovers.
              </h2>
              <div className="w-10 h-1 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full mb-5" />
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-3">
                Founded by passionate pet lovers, {BRAND.name} began with one mission — to provide
                high-quality, safe, and heart-warming products for our furry friends. From nutritious meals
                to comfy accessories, we've grown into a trusted pet-care brand loved by pet parents across India.
              </p>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8">
                Our journey is guided by love, compassion, and the belief that pets aren't just animals —
                they're family. Every product we curate goes through thoughtful care to ensure your pets
                wag their tails with joy.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-blue-500 px-6 py-2.5 rounded-full hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── What Drives Us ── */}
      <section className="py-16 sm:py-20 bg-gray-50/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-xs font-semibold tracking-widest text-pink-500 uppercase">
              Our Purpose
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
              What Drives Us
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {[
              {
                icon: PawPrint,
                title: "Our Mission",
                desc: "To make premium, safe, and sustainable pet care accessible to all. Every product we offer is chosen with love and tested for your pets' comfort.",
                color: "text-pink-500 bg-pink-50",
              },
              {
                icon: Heart,
                title: "Our Vision",
                desc: "To build a global community where pets live happier, healthier lives — supported by products, education, and love from {BRAND.name}.",
                color: "text-blue-500 bg-blue-50",
              },
              {
                icon: Smile,
                title: "Our Promise",
                desc: "We promise honesty, quality, and compassion. Every order supports local pet shelters and animal welfare programs.",
                color: "text-purple-500 bg-purple-50",
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl bg-white border border-gray-100 hover:border-pink-200/60 hover:shadow-sm transition-all"
              >
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-1.5">{title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-xs font-semibold tracking-widest text-pink-500 uppercase">
              Why Us
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
              Why Choose {BRAND.name}?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              { icon: Truck, title: "Fast Delivery", desc: "Get essentials delivered quickly with real-time tracking and secure packaging.", color: "text-pink-500 bg-pink-50" },
              { icon: Shield, title: "100% Authentic", desc: "We only partner with trusted brands so you can shop with confidence.", color: "text-blue-500 bg-blue-50" },
              { icon: Heart, title: "Love in Every Order", desc: "Every order helps us contribute to animal shelters and stray welfare.", color: "text-purple-500 bg-purple-50" },
              { icon: HeadphonesIcon, title: "24/7 Support", desc: "Our team of pet lovers is always ready to help you.", color: "text-green-500 bg-green-50" },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-gradient-to-br from-pink-50/50 to-blue-50/50 border border-gray-100 hover:border-pink-200/60 hover:shadow-sm transition-all"
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-2.5 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 sm:py-20 bg-gray-50/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-xs font-semibold tracking-widest text-pink-500 uppercase">
              By The Numbers
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
              Trusted by thousands
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { value: "500+", label: "Products available", icon: Package, color: "text-pink-500 bg-pink-50" },
              { value: "50+", label: "Trusted brands", icon: Award, color: "text-blue-500 bg-blue-50" },
              { value: "10k+", label: "Happy pet parents", icon: PawPrint, color: "text-purple-500 bg-purple-50" },
              { value: "24/7", label: "Customer support", icon: HeadphonesIcon, color: "text-green-500 bg-green-50" },
            ].map(({ value, label, icon: Icon, color }) => (
              <div
                key={label}
                className="border border-gray-100 hover:border-pink-200 rounded-2xl p-5 sm:p-6 flex flex-col gap-1 transition-all hover:shadow-sm bg-white"
              >
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center mb-1 ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                  {value}
                </span>
                <span className="text-xs sm:text-sm text-gray-400 leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>



      <Footer />
    </div>
  );
};

export default AboutPage;