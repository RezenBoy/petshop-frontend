// src/components/admin/PetCare.js
import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Scissors, Dog, Stethoscope, ClipboardList } from "lucide-react";

const PetCare = () => {
  const petCareOptions = [
    {
      title: "Add Service",
      description: "Create a new pet care service",
      icon: PlusCircle,
      link: "/admin/petcare/add",
      bgColor: "bg-pink-500",
    },
    {
      title: "Manage Services",
      description: "Edit or remove existing services",
      icon: ClipboardList,
      link: "/admin/petcare/manage",
      bgColor: "bg-blue-500",
    },
    {
      title: "Grooming",
      description: "Track and manage grooming services",
      icon: Scissors,
      link: "/admin/petcare/grooming",
      bgColor: "bg-purple-500",
    },
    {
      title: "Training",
      description: "Manage pet training programs",
      icon: Dog,
      link: "/admin/petcare/training",
      bgColor: "bg-green-500",
    },
    {
      title: "Veterinary",
      description: "Keep veterinary appointments and records",
      icon: Stethoscope,
      link: "/admin/petcare/veterinary",
      bgColor: "bg-red-500",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Pet Care Services</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {petCareOptions.map((item, index) => (
          <Link
            to={item.link}
            key={index}
            className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center hover:shadow-lg transition"
          >
            <div
              className={`w-14 h-14 flex items-center justify-center rounded-full ${item.bgColor} text-white mb-4`}
            >
              <item.icon className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="text-gray-500 text-sm text-center mt-2">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PetCare;
