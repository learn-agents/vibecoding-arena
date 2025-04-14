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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  // State for desktop category dropdown
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

  // Fetch social links to get the GitHub repository URL
  const { data } = useQuery<SocialLinks>({
    queryKey: ['/api/social-links'],
    retry: false,
  });

  // Construct the CONTRIBUTE.md URL from the GitHub repo URL
  const contributeUrl = data && data.project && data.project.github
    ? `${data.project.github}/blob/master/CONTRIBUTE.md` 
    : "#";

  // Handle category dropdown toggle on desktop
  const toggleCategoryDropdown = () => {
    setCategoryDropdownOpen(!categoryDropdownOpen);
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
          
          {/* Responsive menu for small and medium screens */}
          <div className="lg:hidden flex items-center space-x-1 md:space-x-2">
            {/* Category Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-gray-light hover:bg-gray-200 transition-colors py-2 px-3 md:px-4 rounded-md flex items-center space-x-1 text-sm md:text-base">
                <span>By Category</span>
                <ChevronDown className="h-3 w-3 md:h-4 md:w-4 ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 z-50">
                <Link to="/">
                  <DropdownMenuItem className="cursor-pointer">
                    Simple
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem disabled className="text-gray-500 cursor-not-allowed">
                  Hard
                </DropdownMenuItem>
                <DropdownMenuItem disabled className="text-gray-500 cursor-not-allowed">
                  Games
                </DropdownMenuItem>
                <DropdownMenuItem disabled className="text-gray-500 cursor-not-allowed">
                  4Devs
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* About Link */}
            <Link to="/about">
              <span className="inline-block px-3 md:px-4 py-2 rounded-md text-black hover:bg-black hover:text-white transition-all cursor-pointer text-sm md:text-base">
                About
              </span>
            </Link>
            
            {/* Submit Prompt Link */}
            <a href={contributeUrl} target="_blank" rel="noopener noreferrer" className="inline-block px-3 md:px-4 py-2 rounded-md text-black hover:bg-black hover:text-white transition-all cursor-pointer text-sm md:text-base whitespace-nowrap">
              Submit Prompt
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
