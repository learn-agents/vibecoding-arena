import { useState } from "react";
import { Agent } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

interface AgentCardProps {
  agent: Agent;
  promptId: string;
}

export default function AgentCard({ agent, promptId }: AgentCardProps) {
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const shareId = `${promptId}-${agent.id}`;

  const handleShare = () => {
    const url = `${window.location.origin}/#item=${shareId}`;
    
    navigator.clipboard.writeText(url)
      .then(() => {
        toast({
          title: "Link copied!",
          description: "The link has been copied to your clipboard.",
        });
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
        toast({
          title: "Failed to copy link",
          description: "Please try again later.",
          variant: "destructive",
        });
      });
  };

  const getAgentBgColor = (name: string) => {
    const colors: Record<string, string> = {
      v0: "bg-primary",
      Replit: "bg-[#F26207]",
      Lovable: "bg-[#FF3366]",
      Bolt: "bg-[#3388FF]",
    };
    return colors[name] || "bg-primary";
  };

  return (
    <Card className="overflow-hidden w-80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        {!isLoaded && (
          <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
        )}
        <img 
          src={agent.gifUrl}
          alt={`${agent.agentName} result`}
          className={`w-full h-48 object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          style={{ aspectRatio: "16/9" }}
        />
        <div className={`absolute top-3 left-3 ${getAgentBgColor(agent.agentName)} text-white text-sm font-medium px-3 py-1 rounded-full`}>
          {agent.agentName}
        </div>
      </div>
      <div className="p-4 flex justify-between items-center">
        <button 
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center"
          onClick={handleShare}
        >
          <i className="fas fa-share-alt mr-2"></i> Share
        </button>
        <a 
          href={agent.codeLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          View Code <i className="fas fa-arrow-right ml-1"></i>
        </a>
      </div>
    </Card>
  );
}
