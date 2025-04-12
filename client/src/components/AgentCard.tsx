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
  const [currentTime, setCurrentTime] = useState(0);
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
      className="group relative flex flex-col overflow-hidden bg-transparent transition-all duration-300 h-full border border-border rounded-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card image container */}
      <div className="relative flex-grow aspect-video overflow-hidden">
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
                className="w-full h-full object-cover"
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
                className="w-full h-full object-cover"
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
      </div>
      
      {/* Agent name centered at the bottom of the card, matching the mockup */}
      <div className="p-3 flex items-center justify-center bg-background">
        <div className="text-base font-medium text-center">
          {agent.agentName}
        </div>
      </div>
    </div>
  );
}