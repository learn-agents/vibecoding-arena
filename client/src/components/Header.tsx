import { Link } from "wouter";

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
        <div>
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
