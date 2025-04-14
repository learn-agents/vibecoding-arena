import { useState, useEffect, useRef, useMemo } from "react";
import { Agent } from "@/lib/types";
import { Globe } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface AgentCardProps {
  agent: Agent;
  promptId: string;
}

export default function AgentCard({ agent, promptId }: AgentCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isVideo, setIsVideo] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  // References for media elements
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Determine the source URL to use
  // If gifUrl is available, use it; otherwise, fall back to originalGifUrl
  const mediaUrl = useMemo(() => {
    return agent.gifUrl || agent.originalGifUrl || "";
  }, [agent.gifUrl, agent.originalGifUrl]);
  
  // Check if the media source is a video (MP4/WebM) or image
  useEffect(() => {
    if (!mediaUrl) return;
    
    const isVideoSource = mediaUrl.endsWith('.mp4') || 
                          mediaUrl.endsWith('.webm') || 
                          mediaUrl.startsWith('/videos/');
    setIsVideo(isVideoSource);
  }, [mediaUrl]);
  
  // Handle mouse events for hover
  const handleMouseEnter = () => {
    setIsHovering(true);
    
    // Play video if it's a video element - continue from where it left off
    if (isVideo && videoRef.current) {
      // Set the current time before playing to resume from where it was paused
      if (currentTime > 0) {
        videoRef.current.currentTime = currentTime;
      }
      
      videoRef.current.play().catch(err => {
        console.error("Error playing video:", err);
      });
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    
    // Pause video if it's a video element and save its current time
    if (isVideo && videoRef.current) {
      // Save the current timestamp for later resumption
      setCurrentTime(videoRef.current.currentTime);
      videoRef.current.pause();
    }
  };

  // Save video time periodically while playing
  useEffect(() => {
    if (isVideo && videoRef.current && isHovering) {
      const interval = setInterval(() => {
        if (videoRef.current) {
          setCurrentTime(videoRef.current.currentTime);
        }
      }, 250); // Update every 250ms while playing
      
      return () => clearInterval(interval);
    }
  }, [isVideo, isHovering]);

  // Reset currentTime when the video loops back to beginning
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime < 0.1 && currentTime > 0) {
      // The video has likely looped, reset our saved time
      setCurrentTime(0);
    }
  };

  // Preload the media (either video or image)
  useEffect(() => {
    if (isVideo) {
      // For video, we'll let the video element handle loading
      setLoading(false);
    } else {
      // For image, preload with Image
      const img = new Image();
      img.onload = () => {
        setLoading(false);
      };
      img.onerror = () => {
        console.error("Error loading image");
        setLoading(false);
      };
      img.src = mediaUrl;
      
      return () => {
        img.onload = null;
        img.onerror = null;
      };
    }
  }, [mediaUrl, isVideo]);

  // Handle video load error (fallback to image if possible)
  const handleVideoError = () => {
    console.error(`Error loading video: ${mediaUrl}`);
    
    // Check if we have an original image URL to fall back to
    // (This should only happen if we're already using gifUrl and there's an error)
    if (agent.originalGifUrl && agent.gifUrl === mediaUrl) {
      setIsVideo(false);
      
      // Preload the fallback image
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
      {/* Modal for full-screen preview */}
      <Dialog>
        <DialogTrigger asChild>
          {/* Card image container */}
          <div className="relative flex-none aspect-video rounded-subtle overflow-hidden cursor-pointer">
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
                    src={mediaUrl}
                    className="w-full h-full object-cover rounded-subtle"
                    loop
                    playsInline
                    muted
                    preload="auto"
                    onError={handleVideoError}
                    onLoadedData={() => setLoading(false)}
                    onTimeUpdate={handleTimeUpdate}
                    // Initialize paused if not hovering
                    autoPlay={false}
                  />
                ) : (
                  // Image with conditional animation for browsers that support it
                  <img 
                    ref={imgRef}
                    src={mediaUrl}
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
            
            {/* Browser icon that appears on hover */}
            {isHovering && (
              <div className="absolute bottom-2 right-2 flex items-center justify-center z-30 transition-all duration-300 bg-black/40 rounded-full w-5 h-5">
                <Globe className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            
            {/* Display creation date on hover in the bottom right */}
            {isHovering && agent.createdAt && (
              <div className="absolute bottom-2 left-2 text-xs text-white/90 z-30 transition-all duration-300">
                {agent.createdAt}
              </div>
            )}
          </div>
        </DialogTrigger>
        
        {/* Modal content for preview */}
        <DialogContent className="w-[80vw] max-w-[80vw] h-[80vh] max-h-[80vh] p-0 border-none overflow-hidden bg-transparent">
          <div className="relative w-full h-full bg-black/90 flex items-center justify-center overflow-hidden">
            {isVideo ? (
              <video 
                src={mediaUrl}
                className="w-full h-full object-contain"
                controls
                autoPlay
                loop
                playsInline
              />
            ) : (
              <img 
                src={mediaUrl}
                alt={`${agent.agentName} solution full preview`}
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Agent name and code link under the card */}
      <div className="p-3 pt-2 flex justify-between items-center">
        <div className="text-sm font-medium text-foreground/90" style={{ fontFamily: "'Space Mono', monospace" }}>
          {agent.agentName.charAt(0).toUpperCase() + agent.agentName.slice(1)}
        </div>
        
        {/* External code link */}
        <a 
          href={agent.codeLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => e.stopPropagation()}
          aria-label="View code by this agent"
        >
          Code
        </a>
      </div>
    </div>
  );
}