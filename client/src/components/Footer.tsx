export default function Footer() {
  return (
    <footer className="py-6 px-4 md:px-8 lg:px-16 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Vibe Coding Arena. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
