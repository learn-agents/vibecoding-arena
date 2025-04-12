import AgentCard from "./AgentCard";
import { Prompt } from "@/lib/types";

interface PromptCarouselProps {
  prompt: Prompt;
}

export default function PromptCarousel({ prompt }: PromptCarouselProps) {
  return (
    <section className="mb-16">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column - Prompt text */}
        <div className="md:w-1/3">
          <h3 className="text-xl font-semibold mb-2 [text-wrap:balance]">{prompt.text}</h3>
          <p className="text-muted-foreground">{prompt.description}</p>
        </div>
        
        {/* Right column - Gallery of GIFs */}
        <div className="md:w-2/3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {prompt.agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} promptId={prompt.id} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
