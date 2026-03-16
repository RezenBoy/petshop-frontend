import { Link } from "react-router-dom";
import categoryImg from "../../assets/categories/dog_food.jpg";

const categories = [
  {
    id: 1,
    name: "Dog Food",
    image: categoryImg,
    description: "Premium nutrition for your loyal companions",
  },
  {
    id: 2,
    name: "Cat Food",
    image: categoryImg,
    description: "Healthy & delicious meals for cats",
  },
  {
    id: 3,
    name: "Bird Supplies",
    image: categoryImg,
    description: "Seeds, cages & everything birds love",
  },
  {
    id: 4,
    name: "Pet Toys",
    image: categoryImg,
    description: "Fun & engaging toys for all pets",
  },
  {
    id: 5,
    name: "Grooming",
    image: categoryImg,
    description: "Shampoos, brushes & care essentials",
  },
  {
    id: 6,
    name: "Accessories",
    image: categoryImg,
    description: "Collars, leashes, beds & more",
  },
];

const CategorySection = () => {
  return (
    <section className="py-16 bg-white" id="categories">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">
          Shop by Category
        </h2>
        <p className="text-center text-gray-500 mb-10">
          Find everything your pet needs in one place
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              to={`/shop?category=${cat.name}`}
              key={cat.id}
              className="group bg-gradient-to-br from-pink-50 to-blue-50 rounded-2xl p-8 text-center
                         hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border border-transparent hover:border-pink-200"
            >
              <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full group-hover:scale-110 transition-transform duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {cat.name}
              </h3>
              <p className="text-gray-500 text-sm">{cat.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
