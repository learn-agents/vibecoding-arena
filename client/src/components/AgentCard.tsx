import { useState, useEffect, useRef } from "react";
import { Agent } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface AgentCardProps {
  agent: Agent;
  promptId: string;
}

export default function AgentCard({ agent, promptId }: AgentCardProps) {
  const { toast } = useToast();
  const [isHovering, setIsHovering] = useState(false);
  const [loading, setLoading] = useState(true);
  const shareId = `${promptId}-${agent.id}`;
  
  // Reference to the GIF element and its playback state
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Used to track if we need to "restart" the GIF playback
  const wasPlayingRef = useRef(false);
  
  // Keep track of the GIF's URL for reloading it with a new URL to pause/play
  const [gifUrl, setGifUrl] = useState(agent.gifUrl);
  
  // Handle mouse events
  const handleMouseEnter = () => {
    setIsHovering(true);
    
    // If the image was previously playing, we need to set the URL back to the original
    if (imgRef.current && !wasPlayingRef.current) {
      // Use the original URL to start playing
      setGifUrl(agent.gifUrl);
      wasPlayingRef.current = true;
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    
    // We don't immediately pause the GIF - that will happen on the next render
    wasPlayingRef.current = false;
  };

  // Effect to handle GIF pausing/playing based on hover state
  useEffect(() => {
    if (!loading) {
      if (!isHovering && wasPlayingRef.current) {
        // Wait a moment to ensure we get the current frame, not the first frame
        const timeoutId = setTimeout(() => {
          // Append a '#' to pause the GIF at the current frame
          // This is a trick that stops animated GIFs by making the browser treat it as a fragment identifier
          setGifUrl(`${agent.gifUrl}#`);
          wasPlayingRef.current = false;
        }, 50);
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [isHovering, loading, agent.gifUrl]);

  // Handle image loading
  useEffect(() => {
    // Create an image to preload the GIF
    const img = new Image();
    img.onload = () => {
      setLoading(false);
      
      // Start with the "paused" version (adding # to URL)
      if (!isHovering) {
        setGifUrl(`${agent.gifUrl}#`);
      }
    };
    img.onerror = () => {
      console.error("Error loading image");
      setLoading(false);
    };
    img.src = agent.gifUrl;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [agent.gifUrl, isHovering]);

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

  return (
    <div 
      className="group relative flex flex-col overflow-visible bg-transparent transition-all duration-300 h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card image container */}
      <div className="relative flex-none aspect-video rounded-subtle overflow-hidden">
        {/* Loading placeholder */}
        {loading && (
          <div className="w-full h-full bg-gray-200 animate-pulse"></div>
        )}
        
        {!loading && (
          /* The GIF - using a key to force re-render when URL changes */
          <img 
            ref={imgRef}
            key={gifUrl} // This forces a re-render when the URL changes
            src={gifUrl}
            alt={`${agent.agentName} solution`}
            className="w-full h-full object-cover rounded-subtle"
          />
        )}
        
        {/* Gradient overlay at the bottom - only render when hovering */}
        {isHovering && (
          <div 
            className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 z-10 opacity-100"
          ></div>
        )}
        
        {/* Action buttons that only appear on hover in the bottom-right corner */}
        {isHovering && (
          <div className="absolute bottom-4 right-4 flex space-x-3 z-30 transition-all duration-300">
            <a 
              href={agent.codeLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-full flex items-center justify-center"
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
              className="w-8 h-8 rounded-full flex items-center justify-center"
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
        )}
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