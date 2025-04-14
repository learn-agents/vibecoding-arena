import Header from "../components/Header";
import Footer from "../components/Footer";
import PromptCarousel from "../components/PromptCarousel";
import FilterSystem from "../components/FilterSystem";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../components/ui/skeleton";
import { Prompt, Agent } from "../lib/types";
import { useState, useMemo } from "react";
import { FaGithub, FaXTwitter } from "react-icons/fa6";

interface SocialLinks {
  project: {
    x: string;
    github: string;
  };
  authors: Array<{
    name: string;
    x: string;
  }>;
}

export default function Home() {
  const { data: prompts, isLoading } = useQuery<Prompt[]>({
    queryKey: ['/api/prompts'],
  });

  // Fetch social media links
  const { data: socialLinks } = useQuery<SocialLinks>({
    queryKey: ['/api/social-links'],
  });

  // Filter state
  const [selectedPromptIds, setSelectedPromptIds] = useState<string[]>([]);
  const [selectedAgentNames, setSelectedAgentNames] = useState<string[]>([]);

  // Handle filter changes from the FilterSystem component
  const handleFilterChange = (promptIds: string[], agentNames: string[]) => {
    setSelectedPromptIds(promptIds);
    setSelectedAgentNames(agentNames);
  };

  // Filter prompts based on selection
  const filteredPrompts = useMemo(() => {
    if (!prompts) return [];
    
    // If no filters are selected, return all prompts
    if (selectedPromptIds.length === 0 && selectedAgentNames.length === 0) {
      return prompts;
    }

    // First, filter by prompts if prompt filters are selected
    let promptsToProcess = prompts;
    if (selectedPromptIds.length > 0) {
      promptsToProcess = prompts.filter(prompt => 
        selectedPromptIds.includes(prompt.id)
      );
    }

    // Then, if agent filters are selected, filter or process the agents
    if (selectedAgentNames.length > 0) {
      return promptsToProcess.map(prompt => {
        // Filter the agents within this prompt to only include selected agents
        const filteredAgents = prompt.agents.filter(agent => 
          selectedAgentNames.includes(agent.agentName)
        );
        
        // Return the prompt with filtered agents
        return { ...prompt, agents: filteredAgents };
      }).filter(prompt => prompt.agents.length > 0); // Only keep prompts that have matching agents
    }
    
    // If only prompt filters were applied, return those prompts with all their agents
    return promptsToProcess;
  }, [prompts, selectedPromptIds, selectedAgentNames]);

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
          
          {/* Social Media Links */}
          <div className="flex justify-center mb-6 gap-6">
            {socialLinks?.project && (
              <>
                {/* X (Twitter) Link */}
                <a 
                  href={socialLinks.project.x}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <FaXTwitter className="text-xl" />
                  <span className="sr-only">X (Twitter)</span>
                </a>
                
                {/* GitHub Link */}
                <a 
                  href={socialLinks.project.github}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <FaGithub className="text-xl" />
                  <span className="sr-only">GitHub</span>
                </a>
              </>
            )}
          </div>
          
          {/* Divider before filter system */}
          <div className="mb-10 border-b border-border"></div>
          
          {/* Filter System (after introduction section) */}
          {!isLoading && (
            <FilterSystem onFilterChange={handleFilterChange} />
          )}

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
          ) : filteredPrompts && filteredPrompts.length > 0 ? (
            filteredPrompts.map((prompt: Prompt, index: number) => (
              <PromptCarousel 
                key={prompt.id} 
                prompt={prompt} 
                isLast={index === filteredPrompts.length - 1} 
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
              <h3 className="mt-4 text-lg font-medium">
                {prompts && prompts.length > 0 
                  ? "No results match your filter criteria" 
                  : "No prompts found"}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {prompts && prompts.length > 0 
                  ? "Try adjusting your filters to see more results" 
                  : "We couldn't find any prompts. Please check back later."}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
