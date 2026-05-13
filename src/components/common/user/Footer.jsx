import React, { useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Phone, Mail, MapPin, ArrowUp, ExternalLink } from "lucide-react";

// ─── Constants ─────────────────────────────────────────────
const CURRENT_YEAR = new Date().getFullYear();

const QUICK_LINKS = [
  { label: "Categories", href: "/#categories", isAnchor: true },
  { label: "Featured Products", href: "/#featured", isAnchor: true },
  { label: "About Us", href: "/about", isAnchor: false },
  { label: "Contact", href: "/contact", isAnchor: false },
  { label: "Shop", href: "/shop", isAnchor: false },
];

const CONTACT_INFO = [
  { icon: Phone, text: "+91 98113 68649", href: "tel:+919811368649", label: "Call us" },
  { icon: Mail, text: "help@bowlfullbuddies.com", href: "mailto:help@bowlfullbuddies.com", label: "Email us" },
  { icon: MapPin, text: "123 Pet Street, New Delhi", href: "https://maps.google.com/?q=123+Pet+Street,+New+Delhi", label: "View location" },
];

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://facebook.com/bowlfullbuddies",
    color: "hover:bg-blue-600 hover:text-white",
    iconPath: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    label: "Twitter",
    href: "https://twitter.com/bowlfullbuddies",
    color: "hover:bg-sky-500 hover:text-white",
    iconPath: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/bowlfullbuddies",
    color: "hover:bg-pink-600 hover:text-white",
    iconPath: "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z",
  },
];

// ─── Sub-Components ──────────────────────────────────────

const SocialIcon = ({ href, label, color, iconPath }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Follow us on ${label}`}
    className={`h-9 w-9 flex items-center justify-center rounded-xl bg-slate-800 text-gray-400 transition-all duration-200 ${color}`}
  >
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d={iconPath} />
    </svg>
  </a>
);

const QuickLink = ({ label, href, isAnchor }) => {
  const navigate = useNavigate();

  const handleClick = useCallback((e) => {
    if (isAnchor) {
      e.preventDefault();
      // If already on home page, smooth scroll
      if (window.location.pathname === "/") {
        const element = document.querySelector(href.replace("/", ""));
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        // Navigate then scroll after render
        navigate("/");
        setTimeout(() => {
          const element = document.querySelector(href.replace("/", ""));
          element?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [href, isAnchor, navigate]);

  return (
    <li>
      <Link
        to={href}
        onClick={handleClick}
        className="text-gray-400 text-sm hover:text-pink-400 transition-colors inline-flex items-center gap-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded px-1 -mx-1"
      >
        <span className="group-hover:translate-x-0.5 transition-transform duration-200">
          {label}
        </span>
        {isAnchor && <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
      </Link>
    </li>
  );
};

const ContactItem = ({ icon: Icon, text, href, label }) => (
  <li>
    <a
      href={href}
      className="flex items-start gap-3 text-gray-400 text-sm hover:text-pink-400 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-lg p-1 -mx-1"
      aria-label={label}
    >
      <Icon className="h-4 w-4 flex-shrink-0 mt-0.5 text-pink-400 group-hover:scale-110 transition-transform" />
      <span className="leading-snug group-hover:text-pink-300 transition-colors">{text}</span>
    </a>
  </li>
);

const ScrollToTop = () => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", toggle, { passive: true });
    return () => window.removeEventListener("scroll", toggle);
  }, []);

  const scroll = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={scroll}
      className="fixed bottom-6 right-6 z-40 h-10 w-10 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
};

// ─── Main Component ──────────────────────────────────────
const Footer = () => {
  const socialSection = useMemo(() => (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        {SOCIAL_LINKS.map((link) => (
          <SocialIcon key={link.label} {...link} />
        ))}
      </div>
      <p className="text-gray-500 text-xs leading-relaxed">
        Follow us for pet care tips, new arrivals, and exclusive offers.
      </p>
    </div>
  ), []);

  return (
    <>
      <footer className="bg-slate-900 text-white w-full">
        {/* Gradient top border */}
        <div className="h-1 w-full bg-gradient-to-r from-pink-500 via-purple-400 to-blue-500" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">

            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-pink-400 fill-pink-400 flex-shrink-0" aria-hidden="true" />
                <span className="text-lg font-bold">Bowlfull Buddies</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Making pets and their families happier, one product at a time. Your trusted pet paradise since day one.
              </p>
              {/* Social — mobile/tablet */}
              <div className="mt-5 lg:hidden">
                {socialSection}
              </div>
            </div>

            {/* Quick Links */}
            <nav aria-label="Footer navigation">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                {QUICK_LINKS.map((link) => (
                  <QuickLink key={link.label} {...link} />
                ))}
              </ul>
            </nav>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
                Contact Info
              </h3>
              <ul className="space-y-3">
                {CONTACT_INFO.map((item) => (
                  <ContactItem key={item.text} {...item} />
                ))}
              </ul>
            </div>

            {/* Social — Desktop */}
            <div className="hidden lg:block">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
                Follow Us
              </h3>
              {socialSection}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
            <p className="text-gray-500 text-xs sm:text-sm">
              &copy; {CURRENT_YEAR} Bowlfull Buddies. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs sm:text-sm flex items-center gap-1">
              Made with
              <Heart className="h-3 w-3 text-pink-400 fill-pink-400 inline" aria-hidden="true" />
              by Rezen boi
            </p>
          </div>
        </div>
      </footer>

      <ScrollToTop />
    </>
  );
};

export default Footer;