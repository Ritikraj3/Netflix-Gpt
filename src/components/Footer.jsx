import React from "react";
import { Globe } from "lucide-react"; // optional icon for language selector

const Footer = () => {
  const footerLinks = [
    ["FAQ", "Investor Relations", "Privacy", "Speed Test"],
    ["Help Centre", "Jobs", "Cookie Preferences", "Legal Notices"],
    ["Account", "Ways to Watch", "Corporate Information", "Only on Netflix"],
    ["Media Centre", "Terms of Use", "Contact Us"]
  ];

  return (
    <footer className="bg-black text-gray-400 text-sm px-4 sm:px-10 md:px-20 py-10">
      {/* Support Number */}
      <p className="mb-6">Questions? Call 000-800-040-1843</p>

      {/* Link Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        {footerLinks.map((column, idx) => (
          <ul key={idx} className="space-y-2">
            {column.map((item, i) => (
              <li key={i} className="hover:underline cursor-pointer">{item}</li>
            ))}
          </ul>
        ))}
      </div>

      {/* Language Selector */}
      <div className="mb-4">
        <button className="flex items-center gap-2 border border-gray-500 px-4 py-1 rounded text-white text-sm hover:bg-white/10 transition">
          <Globe className="w-4 h-4" />
          English
        </button>
      </div>

      {/* Region */}
      <p className="text-gray-400">Netflix India</p>
    </footer>
  );
};

export default Footer;
