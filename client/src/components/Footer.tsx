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
          <div className="text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} All rights reserved</p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>This is a showcase for comparing AI coding capabilities.</p>
        </div>
      </div>
    </footer>
  );
}
