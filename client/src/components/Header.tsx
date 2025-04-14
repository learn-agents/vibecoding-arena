import { Link } from "wouter";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  
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
  };
  
  // Toggle category dropdown
  const toggleCategory = () => {
    setCategoryOpen(!categoryOpen);
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
          
          {/* Center section with category buttons - hidden on mobile and tablet */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/">
              <span className="inline-block px-4 py-2 rounded-md text-black hover:bg-black hover:text-white transition-all cursor-pointer">
                Simple
              </span>
            </Link>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-block px-4 py-2 rounded-md text-gray-500 transition-all cursor-not-allowed">
                    Hard
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>In development</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-block px-4 py-2 rounded-md text-gray-500 transition-all cursor-not-allowed">
                    Games
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>In development</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-block px-4 py-2 rounded-md text-gray-500 transition-all cursor-not-allowed">
                    4Devs
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>In development</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Right side with About and Submit Prompt - hidden on mobile and tablet */}
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
          
          {/* Mobile/Tablet hamburger menu button */}
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

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-white z-10 overflow-y-auto"
        >
          <div className="pt-24">
            <nav className="flex flex-col">
              {/* Category dropdown */}
              <div className="border-b border-gray-200">
                <button 
                  onClick={toggleCategory}
                  className="w-full py-4 px-4 flex justify-between items-center bg-menu-gray hover:bg-gray-200 transition-colors"
                >
                  <span className="text-xl font-medium text-gray-700">By Category</span>
                  {categoryOpen ? (
                    <ChevronUp className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-600" />
                  )}
                </button>
                
                {/* Category items */}
                {categoryOpen && (
                  <div className="pb-4 flex flex-col">
                    <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                      <span className="block py-3 px-4 pl-8 text-black">Simple</span>
                    </Link>
                    <span className="block py-3 px-4 pl-8 text-gray-400 cursor-not-allowed">Hard</span>
                    <span className="block py-3 px-4 pl-8 text-gray-400 cursor-not-allowed">Games</span>
                    <span className="block py-3 px-4 pl-8 text-gray-400 cursor-not-allowed">4Devs</span>
                  </div>
                )}
              </div>
              
              {/* Other menu items */}
              <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                <div className="py-4 px-4 border-b border-gray-200 text-xl font-medium">
                  About
                </div>
              </Link>
              
              <a 
                href={contributeUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="py-4 px-4 border-b border-gray-200 text-xl font-medium">
                  Submit Prompt
                </div>
              </a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
