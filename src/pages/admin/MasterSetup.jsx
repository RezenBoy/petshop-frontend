import React from "react";
import { Building2, Settings, Shield, Globe } from "lucide-react";

const setupOptions = [
  {
    title: "Organization",
    description: "Manage organization details and structure",
    icon: Building2,
    color: "bg-primary text-surface",
  },
  {
    title: "System Settings",
    description: "Configure application and system preferences",
    icon: Settings,
    color: "bg-accent text-catBrown",
  },
  {
    title: "Roles & Permissions",
    description: "Manage user roles and access permissions",
    icon: Shield,
    color: "bg-secondary text-primary",
  },
  {
    title: "Localization",
    description: "Set language, timezone, and regional formats",
    icon: Globe,
    color: "bg-secondaryAccent text-catBrown",
  },
];

const MasterSetup = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-text mb-6">
        Master Setup
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {setupOptions.map((option, index) => (
          <div
            key={index}
            className="bg-surface rounded-xl shadow-sm border border-border hover:shadow-md hover:border-primary/40 transition p-6 cursor-pointer"
          >
            <div
              className={`${option.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
            >
              <option.icon className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold text-text">
              {option.title}
            </h2>
            <p className="text-sm text-textMuted mt-1">{option.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasterSetup;
