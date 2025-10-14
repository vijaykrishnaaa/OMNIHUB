import React from 'react';
import { Info, Briefcase, Mail } from 'lucide-react';

const HomePage = () => {
  return (
    <div>
      <div className="text-white text-center py-24 md:py-32">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to OmniHub
        </h1>
        <p className="text-xl text-gray-400 mb-12">
          Your personalized entertainment universe.
        </p>

      </div>
      <div className="bg-gray-800 text-white p-8 md:p-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">What is OmniHub?</h2>
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-orange-500/20 p-4 rounded-full mb-4">
                <Info size={32} className="text-orange-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">About Us</h3>
              <p className="text-gray-400">
                OmniHub is a central platform for creators and enthusiasts to share and discover diverse content, from videos and books to expert knowledge.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-orange-500/20 p-4 rounded-full mb-4">
                <Briefcase size={32} className="text-orange-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Our Services</h3>
              <p className="text-gray-400">
                We provide tools for creators to upload and manage their content, and a dynamic feed for users to explore movies, books, and articles.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-orange-500/20 p-4 rounded-full mb-4">
                <Mail size={32} className="text-orange-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Contact Us</h3>
              <p className="text-gray-400">
                Have questions or feedback? Reach out to our team at <a href="mailto:contact@omnihub.com" className="text-orange-400 hover:underline">contact@omnihub.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;