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
            <div className="relative w-full" ref={categoryDropdownRef}>
              <button 
                onClick={toggleCategoryDropdown}
                className="flex items-center justify-between space-x-1 px-4 py-2 w-56 bg-gray-light text-black hover:bg-gray-200 transition-all cursor-pointer"
              >
                <span>By Category</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md p-2 z-50 min-w-[200px]">
                  <Link to="/">
                    <div className="px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer">
                      Simple
                    </div>
                  </Link>
                  
                  <div className="px-4 py-2 text-gray-500 cursor-not-allowed">
                    Hard
                  </div>
                  
                  <div className="px-4 py-2 text-gray-500 cursor-not-allowed">
                    Games
                  </div>
                  
                  <div className="px-4 py-2 text-gray-500 cursor-not-allowed">
                    4Devs
                  </div>
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
          
          {/* Hamburger menu button for small and medium screens */}
          <button 
            className="lg:hidden p-2 focus:outline-none" 
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile/tablet menu overlay - only visible when menu is open */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-10 flex flex-col overflow-y-auto">
          {/* Close button positioned at the top-right */}
          <button 
            className="absolute top-6 right-6 p-2 focus:outline-none" 
            onClick={toggleMobileMenu}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>

          <nav className="flex flex-col space-y-12 text-black text-2xl font-semibold mt-24">
            {/* Category section with dropdown */}
            <div className="-mt-6">
              <button 
                onClick={toggleMobileCategory}
                className="flex items-center justify-between w-full py-4 text-black bg-gray-light px-4 w-screen"
              >
                <span className="ml-4">By Category</span>
                <ChevronDown className={`h-6 w-6 mr-4 transition-transform ${mobileCategoryOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Conditional rendering of category items */}
              {mobileCategoryOpen && (
                <div className="px-8 space-y-5 mt-6">
                  <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                    <span>Simple</span>
                  </Link>
                  
                  <div className="block text-gray-500 cursor-not-allowed">Hard</div>
                  
                  <div className="block text-gray-500 cursor-not-allowed">Games</div>
                  
                  <div className="block text-gray-500 cursor-not-allowed">4Devs</div>
                </div>
              )}
            </div>
            
            {/* Other menu items */}
            <div className="px-8 space-y-5">
              <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                <span>About</span>
              </Link>
              
              <a 
                href={contributeUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => setMobileMenuOpen(false)}
                className="block"
              >
                <span>Submit Prompt</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
