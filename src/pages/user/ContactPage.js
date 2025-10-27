import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Footer from "../../components/common/user/Footer";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // send form data to backend
      const res = await fetch("http://localhost:8080/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Your message has been sent successfully!");
        setFormData({ fullName: "", email: "", subject: "", message: "" });
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">
          Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Bowlfull Buddies</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Info Section */}
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-pink-100 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">We’d love to hear from you!</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Whether you have a question about our products, need help with your order, or just want to share your pet’s story — 
                we’re here for you! Reach out and our friendly team will get back to you soon.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md">
                    <Mail className="h-5 w-5" />
                  </div>
                  <span className="text-gray-700">help@bowlfullbuddies.com</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md">
                    <Phone className="h-5 w-5" />
                  </div>
                  <span className="text-gray-700">+91 98765 43210</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span className="text-gray-700">123 Pet Street, Animal City, India</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-gray-600 text-sm">
                <strong>Office Hours:</strong> Mon–Sat, 9:00 AM – 6:00 PM
              </p>
              <p className="text-gray-600 text-sm">
                We typically reply within 24 hours!
              </p>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-pink-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  placeholder="Subject of your message"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none resize-none"
                  placeholder="Write your message here..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
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
