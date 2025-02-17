import { Mail, Facebook, Twitter, Instagram, Github } from "lucide-react";

const Foot = () => {
  return (
    <footer className="w-full text-white py-5 mt-5">
      <div className="w-full flex flex-col md:flex-row items-start justify-between px-8 max-w-7xl mx-auto">
        {/* Contact Section */}
        <div className="flex flex-col space-y-4 mb-8 md:mb-0">
          <h2 className="text-xl font-bold mb-2">Contact Us</h2>
          <a
            href="mailto:DevAdventures01@gmail.com"
            className="flex items-center hover:text-blue-400 transition-colors"
          >
            <Mail className="w-4 h-4 mr-2" />
            DevAdventures01@gmail.com
          </a>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-blue-400 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Main Footer Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Us Section */}
          <div className="flex flex-col space-y-3">
            <h2 className="text-xl font-bold mb-2">About us</h2>
            <a href="#" className="hover:text-blue-400 transition-colors">
              History
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Team Members
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Feedback
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Careers
            </a>
          </div>

          {/* Tutorials Section */}
          <div className="flex flex-col space-y-3">
            <h2 className="text-xl font-bold mb-2">Tutorials</h2>
            <a href="#" className="hover:text-blue-400 transition-colors">
              C++ Basics
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Python Basics
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Algorithms & Data Structures
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Web Development
            </a>
          </div>

          {/* Legal Section */}
          <div className="flex flex-col space-y-3">
            <h2 className="text-xl font-bold mb-2">Legal</h2>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Sharing
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="w-full border-t border-gray-700 mt-6">
        <div className="max-w-7xl mx-auto px-8 py-1">
          <p className="text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} DeVAdventures. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Foot;
