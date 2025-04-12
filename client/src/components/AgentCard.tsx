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
    <div 
      className="group relative flex flex-col overflow-visible bg-transparent transition-all duration-300 h-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Card image container */}
      <div className="relative flex-none aspect-video rounded-none overflow-hidden">
        {/* Loading placeholder */}
        {loading && (
          <div className="w-full h-full bg-gray-200 animate-pulse"></div>
        )}
        
        {/* Static image (shown when not hovering) */}
        {!loading && staticImageSrc && (
          <img 
            src={staticImageSrc}
            alt={`${agent.agentName} result (static)`}
            className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 rounded-none ${
              isHovering ? 'opacity-0' : 'opacity-100'
            }`}
          />
        )}
        
        {/* Animated GIF (only rendered when hovering) */}
        {!loading && isHovering && (
          <img 
            key={`animated-${agent.id}-${Date.now()}`} // Force new instance on each hover
            src={agent.gifUrl}
            alt={`${agent.agentName} result (animated)`}
            className="w-full h-full object-cover absolute inset-0 transition-opacity duration-300 opacity-100 rounded-none"
          />
        )}
        
        {/* Gradient overlay at the bottom when hovering */}
        <div 
          className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 z-10 ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}
        ></div>
        
        {/* Action buttons that appear on hover in the bottom-right corner */}
        <div 
          className={`absolute bottom-4 right-4 flex space-x-3 z-30 transition-all duration-300 ${
            isHovering ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <a 
            href={agent.codeLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
            aria-label="View code by this agent"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
          
          <button 
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
            onClick={handleShare}
            aria-label="Share this agent's solution"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Agent name under the card */}
      <div className="p-3 pt-2">
        <div className="text-sm font-medium text-foreground/90">
          {agent.agentName}
        </div>
      </div>
    </div>
  );
}
