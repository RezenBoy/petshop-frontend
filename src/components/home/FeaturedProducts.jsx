import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import productImg from "../../assets/categories/dog_food.jpg";

const products = [
  {
    id: 1,
    name: "Steel Dog Bowl",
    category: "Bowls",
    image: productImg,
    variants: ["200ml", "400ml", "600ml"],
    moreVariants: 2,
  },
  {
    id: 2,
    name: "Printed Dog Bowl",
    category: "Bowls",
    image: productImg,
    variants: ["200ml", "400ml", "600ml"],
    moreVariants: 4,
  },
  {
    id: 3,
    name: "Dog Cage (Iron)",
    category: "Cages",
    image: productImg,
    variants: ['18"', '24"', '30"'],
    moreVariants: 2,
  },
  {
    id: 4,
    name: "Pipe Dog Cage",
    category: "Cages",
    image: productImg,
    variants: ['Base Pipe 49"', 'Full Pipe 36"', 'Full Pipe 49"'],
    moreVariants: 0,
  },
  {
    id: 5,
    name: "Premium Dog Food",
    category: "Dog Food",
    image: productImg,
    variants: ["1kg", "5kg", "10kg"],
    moreVariants: 1,
  },
  {
    id: 6,
    name: "Cat Grooming Kit",
    category: "Grooming",
    image: productImg,
    variants: ["Basic", "Standard", "Premium"],
    moreVariants: 0,
  },
  {
    id: 7,
    name: "Pet Chew Bone",
    category: "Pet Toys",
    image: productImg,
    variants: ["Small", "Medium", "Large"],
    moreVariants: 0,
  },
  {
    id: 8,
    name: "Adjustable Collar",
    category: "Accessories",
    image: productImg,
    variants: ["S", "M", "L", "XL"],
    moreVariants: 0,
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-16 bg-gray-50" id="featured">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">
          Featured Products
        </h2>
        <p className="text-center text-gray-500 mb-10">
          A selection of our best-selling pet products.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="group bg-gradient-to-br from-pink-50 to-blue-50 rounded-2xl shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden border border-transparent hover:border-pink-200"
            >
              {/* Category Badge */}
              <div className="px-5 pt-4">
                <span className="text-xs font-medium text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>

              {/* Product Image */}
              <div className="h-48 flex items-center justify-center p-4 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="px-5 pb-5">
                {/* Product Name */}
                <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-pink-500 transition-colors">
                  {product.name}
                </h3>

                {/* Variant Tags */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {product.variants.map((variant, idx) => (
                    <span
                      key={idx}
                      className="text-xs text-gray-700 bg-white border border-pink-100 px-2.5 py-1 rounded-md"
                    >
                      {variant}
                    </span>
                  ))}
                </div>

                {/* More Variants */}
                {product.moreVariants > 0 && (
                  <p className="text-xs text-pink-500 mb-4">
                    +{product.moreVariants} more
                  </p>
                )}

                {/* View Details */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-pink-100">
                  <span className="text-sm font-medium text-gray-600 group-hover:text-pink-500 transition-colors">
                    View Details for Pricing
                  </span>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 flex items-center justify-center group-hover:from-pink-600 group-hover:to-blue-600 transition-all">
                    <ArrowRight className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
