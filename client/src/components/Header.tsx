export default function Header() {
  return (
    <header className="py-6 px-4 md:px-8 lg:px-16 border-b border-border">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="/favicon.ico" alt="Robot Icon" className="w-8 h-8" />
          <h1 className="text-xl md:text-2xl font-semibold">Vibe Coding Arena</h1>
        </div>
        <div className="flex space-x-4">
          <a href="https://twitter.com" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
            <i className="fab fa-twitter text-xl"></i>
          </a>
          <a href="https://github.com" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
            <i className="fab fa-github text-xl"></i>
          </a>
          <a href="mailto:contact@example.com" className="text-muted-foreground hover:text-primary transition-colors">
            <i className="fas fa-envelope text-xl"></i>
          </a>
        </div>
      </div>
    </header>
  );
}
