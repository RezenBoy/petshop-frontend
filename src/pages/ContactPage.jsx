import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Footer from "../components/common/user/Footer";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        if (value.trim().length > 20) return "Name is too long (max 20 characters)";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
        return "";
      case "subject":
        if (!value.trim()) return "Subject is required";
        return "";
      case "message":
        if (!value.trim()) return "Message is required";
        if (value.trim().length < 10) return "Message must be at least 10 characters";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Validate on change to clear errors as user types
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([name, value]) => {
      const error = validateField(name, value);
      if (error) newErrors[name] = error;
    });
    return newErrors;
  };

  const API = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateAll();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Your message has been sent successfully!");
        setFormData({ fullName: "", email: "", subject: "", message: "" });
        setErrors({});
      } else {
        alert("Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-light via-primary to-secondary-soft">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">
          Contact{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
            Pashora
          </span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Info Section */}
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-primary-light flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">We'd love to hear from you!</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Whether you have a question about our products, need help with your order, or just want to share
                your pet's story — we're here for you!
              </p>
              <div className="space-y-4">
                {[
                  { icon: Mail, text: "help@pashora.com" },
                  { icon: Phone, text: "+91 98765 43210" },
                  { icon: MapPin, text: "123 Pet Street, Animal City, India" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-gradient-to-r from-primary to-primary-light text-white shadow-md flex-shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-gray-700 text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-gray-600 text-sm"><strong>Office Hours:</strong> Mon–Sat, 9:00 AM – 6:00 PM</p>
              <p className="text-gray-600 text-sm mt-1">We typically reply within 24 hours!</p>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-primary-light">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {[
                { label: "Full Name", name: "fullName", type: "text", placeholder: "Enter your full name" },
                { label: "Email Address", name: "email", type: "email", placeholder: "Enter your email" },
                { label: "Subject", name: "subject", type: "text", placeholder: "Subject of your message" },
              ].map(({ label, name, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm transition-colors ${errors[name] ? "border-red-400 bg-red-50" : "border-gray-300"
                      }`}
                  />
                  {errors[name] && (
                    <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
                  )}
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none resize-none text-sm transition-colors ${errors.message ? "border-red-400 bg-red-50" : "border-gray-300"
                    }`}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;




