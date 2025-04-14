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
        <div className="flex items-center space-x-2">
          <Link to="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <img src="/favicon.ico" alt="Robot Icon" className="w-8 h-8" />
              <h1 className="text-xl md:text-2xl font-semibold">Vibe Coding Arena</h1>
            </div>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/">
            <span className="inline-block px-4 py-2 rounded-md border-2 border-black text-black hover:bg-black hover:text-white transition-all cursor-pointer">
              Simple
            </span>
          </Link>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/hard">
                  <span className="inline-block px-4 py-2 rounded-md border-2 border-gray-400 text-gray-500 transition-all cursor-pointer">
                    Hard
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>In development</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/games">
                  <span className="inline-block px-4 py-2 rounded-md border-2 border-gray-400 text-gray-500 transition-all cursor-pointer">
                    Games
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>In development</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/for-devs">
                  <span className="inline-block px-4 py-2 rounded-md border-2 border-gray-400 text-gray-500 transition-all cursor-pointer">
                    4Devs
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>In development</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Link to="/about">
            <span className="inline-block px-4 py-2 rounded-md border-2 border-black text-black hover:bg-black hover:text-white transition-all cursor-pointer">
              About
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
