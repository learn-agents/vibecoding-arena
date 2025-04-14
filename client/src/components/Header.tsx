import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
  const isMobile = useIsMobile();
  
  // State for fullscreen menu triggered by hamburger icon
  const [menuOpen, setMenuOpen] = useState(false);
  
  // State for category dropdown within the menu
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  // Fetch social links to get the GitHub repository URL
  const { data } = useQuery<SocialLinks>({
    queryKey: ['/api/social-links'],
    retry: false,
  });

  // Construct the CONTRIBUTE.md URL from the GitHub repo URL
  const contributeUrl = data && data.project && data.project.github
    ? `${data.project.github}/blob/master/CONTRIBUTE.md` 
    : "#";

  // Toggle fullscreen menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    // Close category dropdown when closing menu
    if (menuOpen) {
      setCategoryDropdownOpen(false);
    }
  };

  // Toggle category dropdown
  const toggleCategoryDropdown = () => {
    setCategoryDropdownOpen(!categoryDropdownOpen);
  };

  // Link component for desktop navigation menu
  const NavigationMenuItemLink = ({
    to,
    external = false,
    onClick,
    children,
    className,
  }: {
    to: string;
    external?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
  }) => {
    if (external) {
      return (
        <NavigationMenuLink asChild>
          <a
            href={to}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClick}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
          >
            {children}
          </a>
        </NavigationMenuLink>
      );
    }
    
    return (
      <NavigationMenuLink asChild>
        <Link
          to={to}
          onClick={onClick}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
        >
          {children}
        </Link>
      </NavigationMenuLink>
    );
  };

  return (
    <>
      {/* Main Header - always visible */}
      <header className="py-6 px-4 md:px-8 lg:px-16 border-b border-border relative z-50">
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
          
          {/* Desktop Navigation - only visible on larger screens */}
          {!isMobile && (
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {/* Categories Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>By Category</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-1 p-2">
                      <li>
                        <NavigationMenuItemLink to="/">
                          <div className="text-sm font-medium">Simple</div>
                        </NavigationMenuItemLink>
                      </li>
                      <li>
                        <span className="block select-none space-y-1 rounded-md p-3 leading-none text-gray-500 cursor-not-allowed">
                          <div className="text-sm font-medium">Hard</div>
                        </span>
                      </li>
                      <li>
                        <span className="block select-none space-y-1 rounded-md p-3 leading-none text-gray-500 cursor-not-allowed">
                          <div className="text-sm font-medium">Games</div>
                        </span>
                      </li>
                      <li>
                        <span className="block select-none space-y-1 rounded-md p-3 leading-none text-gray-500 cursor-not-allowed">
                          <div className="text-sm font-medium">4Devs</div>
                        </span>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                {/* About Link */}
                <NavigationMenuItem>
                  <NavigationMenuItemLink to="/about">
                    About
                  </NavigationMenuItemLink>
                </NavigationMenuItem>
                
                {/* Submit Prompt Link */}
                <NavigationMenuItem>
                  <NavigationMenuItemLink to={contributeUrl} external>
                    Submit Prompt
                  </NavigationMenuItemLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
          
          {/* Hamburger Menu Button - only visible on mobile */}
          <button 
            className="md:hidden p-2 focus:outline-none relative z-50" 
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Full Screen Menu Overlay - only for mobile */}
      {isMobile && menuOpen && (
        <div className="fixed inset-0 bg-gray-light z-40 overflow-y-auto pt-24">
          {/* Menu content */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4">
            {/* Category section with dropdown */}
            <div className="border-b border-gray-300 pb-4">
              <button 
                onClick={toggleCategoryDropdown}
                className="flex items-center justify-between w-full p-4 text-black bg-white rounded-md shadow-sm text-lg font-medium"
              >
                <span>By Category</span>
                <ChevronDown className={`h-5 w-5 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Category dropdown items */}
              {categoryDropdownOpen && (
                <div className="mt-2 bg-white rounded-md shadow-sm overflow-hidden">
                  <ul className="divide-y divide-gray-100">
                    <li>
                      <Link to="/" onClick={() => {setMenuOpen(false); setCategoryDropdownOpen(false);}} className="block w-full">
                        <div className="p-4 hover:bg-gray-50">
                          Simple
                        </div>
                      </Link>
                    </li>
                    <li>
                      <div className="p-4 text-gray-500 cursor-not-allowed">
                        Hard
                      </div>
                    </li>
                    <li>
                      <div className="p-4 text-gray-500 cursor-not-allowed">
                        Games
                      </div>
                    </li>
                    <li>
                      <div className="p-4 text-gray-500 cursor-not-allowed">
                        4Devs
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            
            {/* Other menu items */}
            <div className="mt-4">
              <ul className="divide-y divide-gray-200 bg-white rounded-md shadow-sm overflow-hidden">
                <li>
                  <Link to="/about" onClick={() => setMenuOpen(false)} className="block w-full">
                    <div className="p-4 hover:bg-gray-50">
                      About
                    </div>
                  </Link>
                </li>
                <li>
                  <a 
                    href={contributeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={() => setMenuOpen(false)}
                    className="block w-full"
                  >
                    <div className="p-4 hover:bg-gray-50">
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
