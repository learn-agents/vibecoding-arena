import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromptCarousel from "@/components/PromptCarousel";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Prompt } from "@/lib/types";

export default function Home() {
  const { toast } = useToast();
  const { data: prompts, isLoading } = useQuery<Prompt[]>({
    queryKey: ['/api/prompts'],
  });
  
  // State for search/filter functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  
  // Update filtered prompts when the search term or prompts change
  useEffect(() => {
    if (!prompts) return;
    
    if (!searchTerm.trim()) {
      setFilteredPrompts(prompts);
      return;
    }
    
    const lowerCaseSearch = searchTerm.toLowerCase();
    const filtered = prompts.filter(prompt => 
      prompt.text.toLowerCase().includes(lowerCaseSearch) || 
      prompt.description.toLowerCase().includes(lowerCaseSearch) ||
      prompt.agents.some(agent => agent.agentName.toLowerCase().includes(lowerCaseSearch))
    );
    
    setFilteredPrompts(filtered);
  }, [searchTerm, prompts]);

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
          <section className="mb-16 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4">
              AI Coding Agents Showcase
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Compare how different AI agents interpret and build applications from identical prompts. 
              Browse through examples, get inspired, and share your favorites.
            </p>
            
            {/* Search input */}
            <div className="relative max-w-md mx-auto mb-8">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg 
                  className="w-5 h-5 text-muted-foreground" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </div>
              <input
                type="search"
                className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background shadow-sm"
                placeholder="Search prompts or agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </section>

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
          ) : filteredPrompts.length > 0 ? (
            filteredPrompts.map((prompt: Prompt) => (
              <PromptCarousel key={prompt.id} prompt={prompt} />
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
              <h3 className="mt-4 text-lg font-medium">No results found</h3>
              <p className="mt-2 text-muted-foreground">
                We couldn't find any prompts or agents matching your search. Try different keywords.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
