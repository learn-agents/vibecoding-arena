export default function Header() {
  return (
    <header className="py-6 px-4 md:px-8 lg:px-16 border-b border-border">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="/favicon.ico" alt="Robot Icon" className="w-8 h-8" />
          <h1 className="text-xl md:text-2xl font-semibold">Vibe Coding Arena</h1>
        </div>
        <div>
          <a href="#about" className="px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            About Us
          </a>
        </div>
      </div>
    </header>
  );
}
