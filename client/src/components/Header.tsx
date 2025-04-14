import { Link } from "wouter";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Header() {
  return (
    <header className="py-6 px-4 md:px-8 lg:px-16 border-b border-border">
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
        
        {/* Center section with category buttons */}
        <div className="flex items-center space-x-4">
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
        
        {/* Right side with About and Submit Prompt (reordered) */}
        <div className="flex items-center space-x-4">
          <Link to="/about">
            <span className="inline-block px-4 py-2 rounded-md text-black hover:bg-black hover:text-white transition-all cursor-pointer">
              About
            </span>
          </Link>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-block px-4 py-2 rounded-md text-gray-500 transition-all cursor-not-allowed">
                  Submit Prompt
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>In development</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}
