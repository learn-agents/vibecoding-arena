import { useState, useRef, useEffect } from "react";
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
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const shareId = `${promptId}-${agent.id}`;
  
  // Reference to the GIF element
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Use effect to control the GIF loading and playing
  useEffect(() => {
    if (!imgRef.current) return;
    
    if (isHovering && !isPlaying) {
      // Load the animated GIF when hovering starts
      const img = imgRef.current;
      const url = agent.gifUrl;
      
      // Force a reload of the image to restart animation
      img.src = '';
      img.src = url + (url.includes('?') ? '&' : '?') + 'play=' + new Date().getTime();
      setIsPlaying(true);
    } else if (!isHovering && isPlaying) {
      // Pause animation by setting to a dummy value that doesn't change the display
      setIsPlaying(false);
    }
  }, [isHovering, isPlaying, agent.gifUrl]);

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
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative group flex-none">
        {!isLoaded && (
          <div className="w-full h-52 bg-gray-200 animate-pulse"></div>
        )}
        <img 
          ref={imgRef}
          src={agent.gifUrl}
          alt={`${agent.agentName} result`}
          className={`w-full h-52 object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          style={{ aspectRatio: "16/9" }}
        />
        <div className={`absolute top-3 left-3 ${getAgentBgColor(agent.agentName)} text-white text-sm font-medium px-3 py-1 rounded-full z-10`}>
          {agent.agentName}
        </div>
        
        {/* Play indicator that appears on hover */}
        <div 
          className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="white" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="ml-1"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
        </div>
      </div>
      <div className="p-4 flex justify-between items-center mt-auto">
        <button 
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center"
          onClick={handleShare}
          aria-label="Share this agent's solution"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mr-1"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
          Share
        </button>
        <a 
          href={agent.codeLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center"
          aria-label="View code by this agent"
        >
          View Code
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="ml-1"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
    </Card>
  );
}
