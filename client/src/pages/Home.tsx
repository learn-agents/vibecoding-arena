import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromptCarousel from "@/components/PromptCarousel";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Prompt } from "@/lib/types";

// Project categories for the new layout
const PROJECT_CATEGORIES = [
  {
    id: "portfolio",
    title: "Simple portfolio site with CRUD",
  },
  {
    id: "cat-food",
    title: "Landing page for cat food",
  }
];

export default function Home() {
  const { toast } = useToast();
  const { data: prompts, isLoading } = useQuery<Prompt[]>({
    queryKey: ['/api/prompts'],
  });
  
  // State for search/filter functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [groupedPrompts, setGroupedPrompts] = useState<Record<string, Prompt[]>>({});
  
  // Group prompts by category when they load
  useEffect(() => {
    if (!prompts) return;
    
    // For simplicity, we'll assign each prompt to a category
    // In a real implementation, prompts would have a category field
    const grouped: Record<string, Prompt[]> = {};
    
    // Assign first half of prompts to first category, second half to second category
    prompts.forEach((prompt, index) => {
      const categoryId = index < prompts.length / 2 ? PROJECT_CATEGORIES[0].id : PROJECT_CATEGORIES[1].id;
      
      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }
      
      grouped[categoryId].push(prompt);
    });
    
    setGroupedPrompts(grouped);
  }, [prompts]);
  
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
          {isLoading ? (
            // Skeleton loading state for the new category-based layout
            <div className="space-y-16">
              {PROJECT_CATEGORIES.map((category) => (
                <div key={category.id} className="space-y-4">
                  <h2 className="text-2xl font-medium">{category.title}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className="flex flex-col overflow-hidden rounded-lg border border-border">
                        <Skeleton className="aspect-video w-full" />
                        <div className="p-4 bg-background">
                          <Skeleton className="h-5 w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm.trim() ? (
            // Search results view - unchanged
            filteredPrompts.length > 0 ? (
              <div>
                <h2 className="text-xl font-medium mb-4">Search Results</h2>
                {filteredPrompts.map((prompt: Prompt) => (
                  <PromptCarousel key={prompt.id} prompt={prompt} />
                ))}
              </div>
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
            )
          ) : (
            // New category-based layout
            <div className="space-y-16">
              {PROJECT_CATEGORIES.map((category) => (
                <div key={category.id} className="space-y-4">
                  <h2 className="text-2xl font-medium">{category.title}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {groupedPrompts[category.id]?.map((prompt) => (
                      <div key={prompt.id} className="flex flex-col overflow-hidden rounded-lg border border-border">
                        <PromptCarousel prompt={prompt} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
