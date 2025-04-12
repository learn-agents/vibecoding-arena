import { useState, useEffect } from "react";
import { Agent } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

interface AgentCardProps {
  agent: Agent;
  promptId: string;
}

export default function AgentCard({ agent, promptId }: AgentCardProps) {
  const { toast } = useToast();
  const [isHovering, setIsHovering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [staticImageSrc, setStaticImageSrc] = useState<string | null>(null);
  const shareId = `${promptId}-${agent.id}`;
  
  // Get static image on component mount
  useEffect(() => {
    // For this example, we'll create a static first frame by:
    // 1. Creating a canvas element
    // 2. Loading the GIF but not appending it to the DOM
    // 3. Drawing the first frame to the canvas
    // 4. Getting the canvas data URL as the static image
    
    // This is a simplified approach, in a real-world application,
    // you would typically have the backend generate a static thumbnail
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    // When the image loads, draw it to a canvas and capture the first frame
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Draw the first frame of the GIF onto the canvas
        ctx.drawImage(img, 0, 0);
        
        // Get the canvas data as a URL
        try {
          // Use the canvas data URL as our static image
          const staticImageData = canvas.toDataURL('image/png');
          setStaticImageSrc(staticImageData);
        } catch (e) {
          // If we can't get the data URL (e.g., due to CORS), fall back to the original
          console.error("Could not get static image:", e);
          setStaticImageSrc(agent.gifUrl);
        }
      }
      setLoading(false);
    };
    
    // Handle image load errors
    img.onerror = () => {
      console.error("Error loading image for static capture");
      setStaticImageSrc(agent.gifUrl);
      setLoading(false);
    };
    
    // Start loading the image
    img.src = agent.gifUrl;
    
    // Cleanup function
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [agent.gifUrl]);

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
      <div className="relative group flex-none h-52">
        {/* Loading placeholder */}
        {loading && (
          <div className="w-full h-52 bg-gray-200 animate-pulse"></div>
        )}
        
        {/* Static image (shown when not hovering) */}
        {!loading && staticImageSrc && (
          <img 
            src={staticImageSrc}
            alt={`${agent.agentName} result (static)`}
            className={`w-full h-52 object-cover absolute inset-0 transition-opacity duration-300 ${
              isHovering ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ aspectRatio: "16/9" }}
          />
        )}
        
        {/* Animated GIF (only rendered when hovering) */}
        {!loading && isHovering && (
          <img 
            key={`animated-${agent.id}-${Date.now()}`} // Force new instance on each hover
            src={agent.gifUrl}
            alt={`${agent.agentName} result (animated)`}
            className="w-full h-52 object-cover absolute inset-0 transition-opacity duration-300 opacity-100"
            style={{ aspectRatio: "16/9" }}
          />
        )}
        
        {/* Agent name badge */}
        <div className={`absolute top-3 left-3 ${getAgentBgColor(agent.agentName)} text-white text-sm font-medium px-3 py-1 rounded-full z-20`}>
          {agent.agentName}
        </div>
        
        {/* Play indicator that appears on hover */}
        <div 
          className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 z-10 ${
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
      
      {/* Card footer with share and view code buttons */}
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
