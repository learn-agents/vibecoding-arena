import { useState, useEffect, useRef } from "react";
import { Agent } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import html2canvas from "html2canvas";

interface AgentCardProps {
  agent: Agent;
  promptId: string;
}

export default function AgentCard({ agent, promptId }: AgentCardProps) {
  const { toast } = useToast();
  const [isHovering, setIsHovering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [staticImageSrc, setStaticImageSrc] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [lastFrameCaptured, setLastFrameCaptured] = useState(false);
  const animatedImgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameCaptureFailed = useRef(false);
  const shareId = `${promptId}-${agent.id}`;
  
  // Get static image on component mount
  // Capture current GIF frame when hover ends
  const captureCurrentFrame = async () => {
    if (!isHovering || !animatedImgRef.current) return;
    
    try {
      // Create a container for proper rendering
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.top = '0';
      tempContainer.style.left = '0';
      tempContainer.style.width = `${animatedImgRef.current.offsetWidth}px`;
      tempContainer.style.height = `${animatedImgRef.current.offsetHeight}px`;
      tempContainer.style.overflow = 'hidden';
      tempContainer.style.pointerEvents = 'none';
      tempContainer.style.opacity = '0';
      
      // Clone the animated image
      const clonedImg = animatedImgRef.current.cloneNode(true) as HTMLImageElement;
      clonedImg.style.position = 'absolute';
      clonedImg.style.top = '0';
      clonedImg.style.left = '0';
      clonedImg.style.width = '100%';
      clonedImg.style.height = '100%';
      clonedImg.style.objectFit = 'cover';
      
      // Add to DOM temporarily (required for html2canvas to work)
      tempContainer.appendChild(clonedImg);
      document.body.appendChild(tempContainer);
      
      // Take the screenshot
      const canvas = await html2canvas(tempContainer, {
        useCORS: true,
        backgroundColor: null,
        scale: 1,
        logging: false,
        allowTaint: true, // Allow cross-origin images
      });
      
      // Remove temp container
      document.body.removeChild(tempContainer);
      
      // Get data URL and set as static image
      const dataUrl = canvas.toDataURL('image/png');
      setStaticImageSrc(dataUrl);
      setHasInteracted(true);
      setLastFrameCaptured(true);
      frameCaptureFailed.current = false;
    } catch (error) {
      console.error('Error capturing current frame:', error);
      frameCaptureFailed.current = true;
    }
  };

  // Handle mouse enter/leave
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  
  const handleMouseLeave = async () => {
    // First capture the current frame while the GIF is still visible
    await captureCurrentFrame();
    // Only after capture is complete, set hovering to false
    setIsHovering(false);
  };

  // Get initial static image on component mount
  useEffect(() => {
    // Check if a previous session exists in sessionStorage
    const sessionKey = `gif-frame-${agent.id}`;
    const savedFrame = sessionStorage.getItem(sessionKey);
    
    // If we've already captured a frame during this browser session, use it
    if (savedFrame) {
      setStaticImageSrc(savedFrame);
      setHasInteracted(true);
      setLastFrameCaptured(true);
      setLoading(false);
      return;
    }
    
    // Only continue if we haven't already interacted
    if (hasInteracted) return;
    
    // Otherwise load the initial frame (first frame of GIF)
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
  }, [agent.gifUrl, agent.id, hasInteracted]);
  
  // Save captured frame to session storage when it changes
  useEffect(() => {
    if (lastFrameCaptured && staticImageSrc) {
      const sessionKey = `gif-frame-${agent.id}`;
      try {
        sessionStorage.setItem(sessionKey, staticImageSrc);
      } catch (e) {
        console.error('Error saving frame to session storage:', e);
      }
    }
  }, [staticImageSrc, lastFrameCaptured, agent.id]);

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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card image container */}
      <div ref={containerRef} className="relative flex-none aspect-video rounded-subtle overflow-hidden">
        {/* Loading placeholder */}
        {loading && (
          <div className="w-full h-full bg-gray-200 animate-pulse"></div>
        )}
        
        {/* Static image (shown when not hovering) */}
        {!loading && staticImageSrc && (
          <img 
            src={staticImageSrc}
            alt={`${agent.agentName} result (static)`}
            className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 rounded-subtle ${
              isHovering ? 'opacity-0' : 'opacity-100'
            }`}
          />
        )}
        
        {/* Animated GIF (only rendered when hovering) */}
        {!loading && isHovering && (
          <img 
            ref={animatedImgRef}
            key={`animated-${agent.id}-${Date.now()}`} // Force new instance on each hover
            src={agent.gifUrl}
            alt={`${agent.agentName} result (animated)`}
            className="w-full h-full object-cover absolute inset-0 transition-opacity duration-300 opacity-100 rounded-subtle animated-gif"
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
