import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

// Define type for social links data
interface SocialLinks {
  project: {
    x: string;
    github: string;
  };
  authors: Array<{
    name: string;
    x: string;
  }>;
}

export default function Header() {
  // State for category dropdown - acts as a full-screen overlay now
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  
  // Prevent body scroll when dropdown is open
  useEffect(() => {
    if (categoryDropdownOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [categoryDropdownOpen]);

  // Fetch social links to get the GitHub repository URL
  const { data } = useQuery<SocialLinks>({
    queryKey: ['/api/social-links'],
    retry: false,
  });

  // Construct the CONTRIBUTE.md URL from the GitHub repo URL
  const contributeUrl = data && data.project && data.project.github
    ? `${data.project.github}/blob/master/CONTRIBUTE.md` 
    : "#";

  // Toggle the category dropdown
  const toggleCategoryDropdown = () => {
    setCategoryDropdownOpen(!categoryDropdownOpen);
  };

  return (
    <>
      {/* Main Header - only visible when dropdown is closed */}
      {!categoryDropdownOpen && (
        <header className="py-6 px-4 md:px-8 lg:px-16 border-b border-border relative z-20">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Left side with logo and text */}
            <div className="flex items-center">
              <Link to="/">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <img src="/favicon.ico" alt="Robot Icon" className="w-8 h-8" />
                  <h1 className="text-xl md:text-2xl font-semibold">Vibe Arena</h1>
                </div>
              </Link>
            </div>
            
            {/* Category Button - on desktop and mobile */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleCategoryDropdown}
                className="flex items-center justify-between space-x-2 px-4 py-2 bg-gray-light text-black hover:bg-gray-200 transition-all cursor-pointer rounded-md"
              >
                <span>By Category</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Full Screen Dropdown Menu Overlay */}
      {categoryDropdownOpen && (
        <div className="fixed inset-0 bg-gray-light z-50 overflow-y-auto">
          {/* Header with close button */}
          <div className="px-4 py-4 md:px-8 lg:px-16 flex justify-between items-center border-b border-gray-300">
            <h2 className="text-xl font-bold">By Category</h2>
            <button 
              onClick={toggleCategoryDropdown}
              className="p-2 focus:outline-none"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Menu content */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
            <ul className="divide-y divide-gray-200 text-lg">
              <li>
                <Link to="/" onClick={() => setCategoryDropdownOpen(false)} className="block w-full">
                  <div className="py-4 hover:bg-white px-4 -mx-4 transition-colors">
                    Simple
                  </div>
                </Link>
              </li>
              <li>
                <div className="py-4 text-gray-500 cursor-not-allowed px-4">
                  Hard
                </div>
              </li>
              <li>
                <div className="py-4 text-gray-500 cursor-not-allowed px-4">
                  Games
                </div>
              </li>
              <li>
                <div className="py-4 text-gray-500 cursor-not-allowed px-4">
                  4Devs
                </div>
              </li>
            </ul>

            <div className="border-t border-gray-200 mt-6 pt-6">
              <ul className="divide-y divide-gray-200 text-lg">
                <li>
                  <Link to="/about" onClick={() => setCategoryDropdownOpen(false)} className="block w-full">
                    <div className="py-4 hover:bg-white px-4 -mx-4 transition-colors">
                      About
                    </div>
                  </Link>
                </li>
                <li>
                  <a 
                    href={contributeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={() => setCategoryDropdownOpen(false)}
                    className="block w-full"
                  >
                    <div className="py-4 hover:bg-white px-4 -mx-4 transition-colors">
                      Submit Prompt
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
