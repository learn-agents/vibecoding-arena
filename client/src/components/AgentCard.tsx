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
  const [isVideo, setIsVideo] = useState(false);
  const shareId = `${promptId}-${agent.id}`;
  
  // References for media elements
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Check if the media source is a video (MP4/WebM) or GIF
  useEffect(() => {
    const isVideoSource = agent.gifUrl.endsWith('.mp4') || 
                          agent.gifUrl.endsWith('.webm') || 
                          agent.gifUrl.startsWith('/videos/');
    setIsVideo(isVideoSource);
  }, [agent.gifUrl]);
  
  // Handle mouse events for hover
  const handleMouseEnter = () => {
    setIsHovering(true);
    
    // Play video if it's a video element
    if (isVideo && videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error("Error playing video:", err);
      });
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    
    // Pause video if it's a video element
    if (isVideo && videoRef.current) {
      videoRef.current.pause();
    }
  };

  // Preload the media (either video or GIF)
  useEffect(() => {
    if (isVideo) {
      // For video, we'll let the video element handle loading
      setLoading(false);
    } else {
      // For GIF, preload with Image
      const img = new Image();
      img.onload = () => {
        setLoading(false);
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
    }
  }, [agent.gifUrl, isVideo]);

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

  // Handle video load error (fallback to GIF if possible)
  const handleVideoError = () => {
    console.error(`Error loading video: ${agent.gifUrl}`);
    
    // Check if we have an original GIF URL to fall back to
    if (agent.originalGifUrl) {
      setIsVideo(false);
      
      // Preload the fallback GIF
      const img = new Image();
      img.onload = () => {
        setLoading(false);
      };
      img.onerror = () => {
        console.error("Error loading fallback image");
        setLoading(false);
      };
      img.src = agent.originalGifUrl;
    } else {
      setLoading(false);
    }
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
        
        {/* Media content: either video or GIF */}
        {!loading && (
          <>
            {isVideo ? (
              // Video element for better control
              <video 
                ref={videoRef}
                src={agent.gifUrl}
                className="w-full h-full object-cover rounded-subtle"
                loop
                playsInline
                muted
                preload="auto"
                onError={handleVideoError}
                onLoadedData={() => setLoading(false)}
                // Initialize paused if not hovering
                autoPlay={false}
              />
            ) : (
              // GIF with conditional animation for browsers that support it
              <img 
                ref={imgRef}
                src={agent.gifUrl}
                alt={`${agent.agentName} solution`}
                className="w-full h-full object-cover rounded-subtle"
                style={{ 
                  animationPlayState: isHovering ? 'running' : 'paused',
                  WebkitAnimationPlayState: isHovering ? 'running' : 'paused',
                  filter: isHovering ? 'none' : 'url(#paused-gif)'
                }}
              />
            )}
          </>
        )}
        
        {/* SVG filter to help improve GIF pausing across browsers */}
        {!isVideo && (
          <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
              <filter id="paused-gif">
                <feGaussianBlur stdDeviation="0.01" />
              </filter>
            </defs>
          </svg>
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