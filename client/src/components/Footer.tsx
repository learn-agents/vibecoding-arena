export default function Footer() {
  return (
    <footer className="py-8 px-4 md:px-8 lg:px-16 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <img src="/favicon.ico" alt="Robot Icon" className="w-6 h-6" />
              <span className="text-foreground font-medium">Vibe Coding Arena</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Comparing AI coding capabilities</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <i className="fab fa-github"></i>
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <i className="fas fa-envelope"></i>
            </a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Vibe Coding Arena. All rights reserved.</p>
          <p className="mt-1">This is a showcase for comparing AI coding capabilities.</p>
        </div>
      </div>
    </footer>
  );
}
