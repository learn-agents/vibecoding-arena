import AgentCard from "./AgentCard";
import { Prompt } from "@/lib/types";

interface PromptCarouselProps {
  prompt: Prompt;
}

export default function PromptCarousel({ prompt }: PromptCarouselProps) {
  return (
    <section className="mb-16">
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">{prompt.text}</h3>
        <p className="text-muted-foreground max-w-3xl">{prompt.description}</p>
      </div>
      
      {/* Responsive Grid Layout - 3 columns max */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {prompt.agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} promptId={prompt.id} />
        ))}
      </div>
    </section>
  );
}
