export default function Header() {
  return (
    <header className="py-6 px-4 md:px-8 lg:px-16 border-b border-border">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"></path>
          </svg>
          <h1 className="text-xl md:text-2xl font-semibold">Vibe Coding Arena</h1>
        </div>
        <div>
          <a href="https://github.com" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
            <i className="fab fa-github text-xl"></i>
          </a>
        </div>
      </div>
    </header>
  );
}
