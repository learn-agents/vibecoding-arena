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
  
  // References for DOM elements
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Function to capture the current frame of the GIF
  const captureCurrentFrame = () => {
    if (!imgRef.current || !canvasRef.current || !containerRef.current) return;
    
    const canvas = canvasRef.current;
    const img = imgRef.current;
    const container = containerRef.current;
    
    // Ensure canvas dimensions match the container/image
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    // Draw the current frame of the GIF to the canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  };
  
  // Handle mouse events
  const handleMouseEnter = () => {
    setIsHovering(true);
    
    // Show the actual GIF (which will continue from where it was)
    if (imgRef.current) {
      imgRef.current.style.visibility = 'visible';
    }
    
    // Hide the frozen frame
    if (canvasRef.current) {
      canvasRef.current.style.visibility = 'hidden';
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    
    // Capture and freeze the current frame when mouse leaves
    captureCurrentFrame();
    
    // Hide the GIF
    if (imgRef.current) {
      imgRef.current.style.visibility = 'hidden';
    }
    
    // Show the frozen frame
    if (canvasRef.current) {
      canvasRef.current.style.visibility = 'visible';
    }
  };

  // Set up initial loading and handle GIF behavior
  useEffect(() => {
    // Create an image to preload the GIF
    const img = new Image();
    img.onload = () => {
      setLoading(false);
      
      // Initial setup - capture first frame after the GIF has loaded
      setTimeout(() => {
        if (imgRef.current && canvasRef.current) {
          // Start by showing the active GIF briefly
          imgRef.current.style.visibility = 'visible';
          canvasRef.current.style.visibility = 'hidden';
          
          // Then capture the current frame and freeze it
          setTimeout(() => {
            if (!isHovering) {
              captureCurrentFrame();
              
              // Hide the GIF and show the frozen frame
              if (imgRef.current) imgRef.current.style.visibility = 'hidden';
              if (canvasRef.current) canvasRef.current.style.visibility = 'visible';
            }
          }, 50); // Small delay to ensure first frame is rendered
        }
      }, 50);
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

  // Handle window resize to adjust canvas size
  useEffect(() => {
    const handleResize = () => {
      if (!isHovering) {
        captureCurrentFrame();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isHovering]);

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
      <div 
        className="relative flex-none aspect-video rounded-subtle overflow-hidden"
        ref={containerRef}
      >
        {/* Loading placeholder */}
        {loading && (
          <div className="w-full h-full bg-gray-200 animate-pulse"></div>
        )}
        
        {!loading && (
          <>
            {/* Canvas for frozen frame (visible when not hovering) */}
            <canvas 
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full object-cover rounded-subtle"
              style={{ visibility: 'hidden' }} // Initially hidden
            />
            
            {/* Original GIF (only visible and animated when hovering) */}
            <img 
              ref={imgRef}
              src={agent.gifUrl}
              alt={`${agent.agentName} solution`}
              className="w-full h-full object-cover rounded-subtle"
              style={{ visibility: 'visible' }} // Initially visible
            />
          </>
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