import { Link } from "wouter";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
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
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State for category dropdown in mobile menu
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  
  // State for category dropdown in desktop
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Close category dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Fetch social links to get the GitHub repository URL
  const { data } = useQuery<SocialLinks>({
    queryKey: ['/api/social-links'],
    retry: false,
  });

  // Construct the CONTRIBUTE.md URL from the GitHub repo URL
  const contributeUrl = data && data.project && data.project.github
    ? `${data.project.github}/blob/master/CONTRIBUTE.md` 
    : "#";

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Reset category dropdown state when closing the menu
    if (mobileMenuOpen) {
      setMobileCategoryOpen(false);
    }
  };

  // Handle category dropdown toggle on desktop
  const toggleCategoryDropdown = () => {
    setCategoryDropdownOpen(!categoryDropdownOpen);
  };
  
  // Handle category dropdown toggle on mobile
  const toggleMobileCategory = () => {
    setMobileCategoryOpen(!mobileCategoryOpen);
  };

  return (
    <>
      {/* Main Header */}
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
          
          {/* Center section with category dropdown - hidden on small screens */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Category Dropdown */}
            <div className="relative" ref={categoryDropdownRef}>
              <button 
                onClick={toggleCategoryDropdown}
                className="flex items-center justify-between space-x-2 px-4 py-2 w-56 bg-gray-light text-black hover:bg-gray-200 transition-all cursor-pointer rounded-md"
              >
                <span>By Category</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md overflow-hidden z-50 w-56">
                  <ul className="divide-y divide-gray-100">
                    <li>
                      <Link to="/" className="block w-full">
                        <div className="px-4 py-3 hover:bg-gray-100 cursor-pointer">
                          Simple
                        </div>
                      </Link>
                    </li>
                    <li>
                      <div className="px-4 py-3 text-gray-500 cursor-not-allowed">
                        Hard
                      </div>
                    </li>
                    <li>
                      <div className="px-4 py-3 text-gray-500 cursor-not-allowed">
                        Games
                      </div>
                    </li>
                    <li>
                      <div className="px-4 py-3 text-gray-500 cursor-not-allowed">
                        4Devs
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* Right side with About and Submit Prompt - hidden on small screens */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/about">
              <span className="inline-block px-4 py-2 rounded-md text-black hover:bg-black hover:text-white transition-all cursor-pointer">
                About
              </span>
            </Link>
            
            <a href={contributeUrl} target="_blank" rel="noopener noreferrer">
              <span className="inline-block px-4 py-2 rounded-md text-black hover:bg-black hover:text-white transition-all cursor-pointer">
                Submit Prompt
              </span>
            </a>
          </div>
          
          {/* Hamburger menu button for small and medium screens - only show when menu is closed */}
          {!mobileMenuOpen && (
            <button 
              className="lg:hidden p-2 focus:outline-none" 
              onClick={toggleMobileMenu}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          )}
        </div>
      </header>

      {/* Desktop navigation - always visible on large screens */}
      <nav className="hidden lg:block border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between px-4 md:px-8 lg:px-16">
          <div className="py-3">
            {/* Navigation links would go here for desktop version if needed */}
          </div>
        </div>
      </nav>
      
      {/* Mobile/tablet menu overlay - only visible when menu is open */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[73px] bg-white z-10 flex flex-col overflow-y-auto">
          {/* Close button positioned at the top-right */}
          <button 
            className="absolute top-4 right-6 p-2 focus:outline-none" 
            onClick={toggleMobileMenu}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="mt-0">
            <nav className="flex flex-col text-black text-lg font-semibold border-t border-gray-200">
              {/* Category section with dropdown */}
              <div>
                <button 
                  onClick={toggleMobileCategory}
                  className="flex items-center justify-between w-full py-4 text-black bg-gray-light px-8 text-xl"
                >
                  <span>By Category</span>
                  <ChevronDown className={`h-5 w-5 transition-transform ${mobileCategoryOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Conditional rendering of category items */}
                {mobileCategoryOpen && (
                  <div className="w-full bg-white shadow-inner">
                    <ul className="divide-y divide-gray-100">
                      <li>
                        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                          <div className="px-8 py-3 hover:bg-gray-100">
                            Simple
                          </div>
                        </Link>
                      </li>
                      <li>
                        <div className="px-8 py-3 text-gray-500 cursor-not-allowed">
                          Hard
                        </div>
                      </li>
                      <li>
                        <div className="px-8 py-3 text-gray-500 cursor-not-allowed">
                          Games
                        </div>
                      </li>
                      <li>
                        <div className="px-8 py-3 text-gray-500 cursor-not-allowed">
                          4Devs
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Other menu items - structured the same way for consistency */}
              <ul className="mt-0 divide-y divide-gray-100">
                <li>
                  <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                    <div className="px-8 py-3 hover:bg-gray-100">
                      About
                    </div>
                  </Link>
                </li>
                <li>
                  <a 
                    href={contributeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full"
                  >
                    <div className="px-8 py-3 hover:bg-gray-100">
                      Submit Prompt
                    </div>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
