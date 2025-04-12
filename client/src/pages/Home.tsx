import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromptCarousel from "@/components/PromptCarousel";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function Home() {
  const { toast } = useToast();
  const { data: prompts, isLoading } = useQuery({
    queryKey: ['/api/prompts'],
  });

  useEffect(() => {
    // Handle URL sharing logic
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const sharedItemId = hashParams.get("item");
    
    if (sharedItemId) {
      setTimeout(() => {
        toast({
          title: "Viewing shared item",
          description: `You're viewing a shared item with ID: ${sharedItemId}`,
        });
        
        // Clear the hash to avoid showing the toast on refresh
        window.history.replaceState(null, "", window.location.pathname);
      }, 1000);
    }
  }, [toast]);

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans text-foreground">
      <Header />
      
      <main className="py-8 px-4 md:px-8 lg:px-16 flex-grow">
        <div className="max-w-7xl mx-auto">
          {/* Introduction */}
          <section className="mb-12 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4">
              Compare AI Coding Agents Side-by-Side
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto mb-3">
              See how different AI agents interpret and build applications from identical prompts. 
              Browse through examples, get inspired, and share your favorites.
            </p>
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
              <span>Scroll horizontally with mouse wheel or arrow keys to see more</span>
            </div>
          </section>

          {/* Carousels */}
          {isLoading ? (
            // Skeleton loading state
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="mb-16">
                <div className="mb-6">
                  <Skeleton className="h-7 w-3/4 mb-2" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
                <div className="flex space-x-6 overflow-x-hidden">
                  {Array(4).fill(0).map((_, j) => (
                    <Skeleton key={j} className="h-64 w-80 rounded-lg" />
                  ))}
                </div>
              </div>
            ))
          ) : (
            prompts?.map((prompt) => (
              <PromptCarousel key={prompt.id} prompt={prompt} />
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
