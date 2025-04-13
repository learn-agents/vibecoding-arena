import { useState, useEffect, useRef } from "react";
import { Agent } from "@/lib/types";

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
                onTimeUpdate={handleTimeUpdate}
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
            className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#222]/50 to-transparent transition-opacity duration-300 z-10 opacity-100"
          ></div>
        )}
        
        {/* Code link button that appears on hover in the bottom-right corner */}
        {isHovering && (
          <div className="absolute bottom-2 right-2 flex gap-0 z-30 transition-all duration-300">
            <a 
              href={agent.codeLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-7 h-8 rounded-full flex items-center justify-center"
              aria-label="View code by this agent"
            >
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 14 14"
              >
                <path d="M10.8101 1.96222L0.726954 12.0453L1.66171 12.9801L11.7448 2.89698L11.9344 9.4447L13.208 9.07311L13.0134 2.35278C12.9877 1.46249 12.2434 0.718185 11.3531 0.692412L4.80762 0.502924L4.43487 1.77539L10.8101 1.96222Z" fill="white" stroke="white" strokeWidth="0.542084"></path>
              </svg>
            </a>
          </div>
        )}
      </div>
      
      {/* Agent name under the card */}
      <div className="p-3 pt-2">
        <div className="text-sm font-medium text-foreground/90" style={{ fontFamily: "'Space Mono', monospace" }}>
          {agent.agentName.charAt(0).toUpperCase() + agent.agentName.slice(1)}
        </div>
      </div>
    </div>
  );
}