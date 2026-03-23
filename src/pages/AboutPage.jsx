import React from "react";
import { Heart, PawPrint, Shield, Truck, Smile } from "lucide-react";
import Footer from "../components/common/user/Footer";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative text-center py-16 bg-gradient-to-r from-pink-100 via-blue-100 to-yellow-100 shadow-inner">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Bowlfull Buddies</span>
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Because every wag, purr, and cuddle deserves care, comfort, and love.  
            We’re here to make your pets’ world a happier place 🐾
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1558944351-c0e86f1f1cf4?auto=format&fit=crop&w=800&q=80"
              alt="Pets with owners"
              className="rounded-2xl shadow-xl"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Founded by passionate pet lovers, <strong>Bowlfull Buddies</strong> began with one mission — 
              to provide high-quality, safe, and heart-warming products for our furry friends.  
              From nutritious meals to comfy accessories, we’ve grown into a trusted pet-care brand loved by pet parents across India.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our journey is guided by love, compassion, and the belief that pets aren’t just animals — 
              they’re family. Every product we create or curate goes through thoughtful care to ensure your pets wag their tails with joy.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision & Values */}
      <section className="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">What Drives Us</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-md border border-pink-100 hover:shadow-lg transition">
              <PawPrint className="h-10 w-10 text-pink-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                To make premium, safe, and sustainable pet care accessible to all.  
                Every product we offer is chosen with love and tested for your pets’ comfort.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md border border-pink-100 hover:shadow-lg transition">
              <Heart className="h-10 w-10 text-pink-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                To build a global community where pets live happier, healthier lives —  
                supported by products, education, and love from Bowlfull Buddies.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md border border-pink-100 hover:shadow-lg transition">
              <Smile className="h-10 w-10 text-pink-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Promise</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                We promise honesty, quality, and compassion.  
                Every order supports local pet shelters and animal welfare programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Why Choose Bowlfull Buddies?</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-100 shadow-sm hover:shadow-md transition">
              <Truck className="h-10 w-10 text-pink-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Fast & Reliable Delivery</h4>
              <p className="text-gray-600 text-sm">
                Get your pet’s essentials delivered quickly with real-time tracking and secure packaging.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-100 shadow-sm hover:shadow-md transition">
              <Shield className="h-10 w-10 text-pink-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">100% Authentic Products</h4>
              <p className="text-gray-600 text-sm">
                We only partner with trusted brands and suppliers so you can shop with confidence.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-100 shadow-sm hover:shadow-md transition">
              <Heart className="h-10 w-10 text-pink-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Love in Every Order</h4>
              <p className="text-gray-600 text-sm">
                Every order you place helps us contribute to animal shelters and stray welfare.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
