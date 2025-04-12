import AgentCard from "./AgentCard";
import { Prompt } from "@/lib/types";

interface PromptCarouselProps {
  prompt: Prompt;
}

export default function PromptCarousel({ prompt }: PromptCarouselProps) {
  // In the new layout, each card represents a prompt and shows only its first agent
  const mainAgent = prompt.agents[0];
  
  return (
    <div className="h-full">
      {/* We're now showing only the main agent for each prompt in the card */}
      {mainAgent && (
        <AgentCard key={mainAgent.id} agent={mainAgent} promptId={prompt.id} />
      )}
    </div>
  );
}
