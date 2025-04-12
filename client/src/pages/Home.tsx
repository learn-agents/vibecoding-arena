import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromptCarousel from "@/components/PromptCarousel";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Prompt } from "@/lib/types";

export default function Home() {
  const { data: prompts, isLoading } = useQuery<Prompt[]>({
    queryKey: ['/api/prompts'],
  });

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans text-foreground">
      <Header />
      
      <main className="py-8 px-4 md:px-8 lg:px-16 flex-grow">
        <div className="max-w-7xl mx-auto">
          {/* Introduction */}
          <section className="mb-10 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4">
              AI Coding Agents Showcase
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-7">
              Compare how different AI agents interpret and build applications from identical prompts. 
              Browse through examples and get inspired by different approaches.
            </p>
          </section>
          
          {/* GitHub Link */}
          <div className="flex justify-center mb-6">
            <a href="https://github.com" target="_blank" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
              <i className="fab fa-github text-xl"></i>
              <span>View on GitHub</span>
            </a>
          </div>
          
          {/* Divider before first prompt */}
          <div className="mb-10 border-b border-border"></div>

          {/* Grid Layout */}
          {isLoading ? (
            // Skeleton loading state
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col overflow-hidden rounded-lg">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-4 bg-background">
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : prompts && prompts.length > 0 ? (
            prompts.map((prompt: Prompt, index: number) => (
              <PromptCarousel 
                key={prompt.id} 
                prompt={prompt} 
                isLast={index === prompts.length - 1} 
              />
            ))
          ) : (
            <div className="text-center p-10">
              <svg 
                className="w-12 h-12 mx-auto text-muted-foreground" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium">No prompts found</h3>
              <p className="mt-2 text-muted-foreground">
                We couldn't find any prompts. Please check back later.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
