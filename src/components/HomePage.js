import {
  Heart,
  ShoppingCart,
  Facebook,
  Twitter,
  Instagram,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import Navbar from "./NavBar";

const HomePage = () => {
  // const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const featuredProducts = [
    {
      id: 1,
      name: "Premium Dog Food",
      price: "$24.99",
      image: "🥘",
      category: "Food",
    },
    {
      id: 2,
      name: "Cat Scratching Post",
      price: "$39.99",
      image: "🏠",
      category: "Toys",
    },
    {
      id: 3,
      name: "Pet Carrier Bag",
      price: "$49.99",
      image: "👜",
      category: "Accessories",
    },
    {
      id: 4,
      name: "Interactive Dog Toy",
      price: "$19.99",
      image: "🎾",
      category: "Toys",
    },
    {
      id: 5,
      name: "Cat Litter Box",
      price: "$34.99",
      image: "📦",
      category: "Essentials",
    },
    {
      id: 6,
      name: "Pet Grooming Kit",
      price: "$29.99",
      image: "✂️",
      category: "Grooming",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      <Navbar />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-200 via-blue-200 to-yellow-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">🐕🐱</div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
              Happy Pets, Happy You!
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover everything your furry friends need to live their best
              life. From premium food to fun toys and cozy accessories.
            </p>
            <button className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-8 py-4 rounded-full text-xl font-semibold hover:from-pink-600 hover:to-blue-600 transform hover:scale-105 transition-all shadow-lg">
              Shop Now
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Shop by Category
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl p-8 text-center hover:transform hover:scale-105 transition-all cursor-pointer shadow-lg">
              <div className="text-6xl mb-4">🐕</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Dogs</h3>
              <p className="text-gray-600">
                Everything for your loyal companion
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 text-center hover:transform hover:scale-105 transition-all cursor-pointer shadow-lg">
              <div className="text-6xl mb-4">🐱</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Cats</h3>
              <p className="text-gray-600">
                Perfect products for your feline friends
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl p-8 text-center hover:transform hover:scale-105 transition-all cursor-pointer shadow-lg">
              <div className="text-6xl mb-4">🎾</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Accessories
              </h3>
              <p className="text-gray-600">Toys, treats, and essentials</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Featured Products
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
              >
                <div className="bg-gradient-to-br from-pink-100 to-blue-100 h-48 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                  {product.image}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">
                      {product.name}
                    </h3>
                    <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-pink-500">
                      {product.price}
                    </span>
                    <button className="bg-gradient-to-r from-pink-400 to-blue-400 text-white px-4 py-2 rounded-lg hover:from-pink-500 hover:to-blue-500 transition-all flex items-center space-x-2">
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">
            About Bowlfull Buddies
          </h2>
          <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-2xl p-8 shadow-lg">
            <p className="text-lg text-gray-700 leading-relaxed">
              At Bowlfull Buddies, we believe every pet deserves the very best.
              Founded by passionate pet lovers, we're dedicated to providing
              high-quality products that keep your furry friends healthy, happy,
              and loved. From premium nutrition to engaging toys and essential
              accessories, we carefully curate every item in our store. Our
              mission is simple: to strengthen the bond between you and your
              beloved pets while ensuring they live their most joyful lives.
              Join our community of pet lovers who trust us to deliver
              excellence, care, and endless tail wags to their homes.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-pink-400" />
                <span className="text-xl font-bold">Bowlfull Buddies</span>
              </div>
              <p className="text-gray-400">
                Making pets and their families happier, one product at a time.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#home"
                    className="hover:text-pink-400 transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#shop"
                    className="hover:text-pink-400 transition-colors"
                  >
                    Shop
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="hover:text-pink-400 transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-pink-400 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>(555) 123-PETS</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>hello@bowlfullbuddies.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>123 Pet Street, Animal City</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-pink-400 transition-colors"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-pink-400 transition-colors"
                >
                  <Twitter className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-pink-400 transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 Bowlfull Buddies. All rights reserved. Made with ❤️
              for pets everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
