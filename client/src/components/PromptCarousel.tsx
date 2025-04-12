import { useRef, useState, useEffect } from "react";
import AgentCard from "./AgentCard";
import { Prompt } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PromptCarouselProps {
  prompt: Prompt;
}

export default function PromptCarousel({ prompt }: PromptCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Handle horizontal scrolling with mouse wheel
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const handleWheel = (e: WheelEvent) => {
      // If there's content to scroll and user is using the mouse wheel
      if (container.scrollWidth > container.clientWidth) {
        // Always prevent the default vertical scroll when over our carousel
        e.preventDefault();
        
        // Determine the scroll amount (use deltaY for most mouse wheels)
        const scrollAmount = e.deltaY !== 0 ? e.deltaY : e.deltaX;
        
        // Apply the scroll with a smoother speed multiplier
        container.scrollLeft += scrollAmount * 0.8;
        
        // Update scroll position for indicators
        handleScroll();
      }
    };
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);
  
  // Add keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process keyboard events when the carousel is visible in viewport
      if (!scrollContainerRef.current) return;
      
      const rect = scrollContainerRef.current.getBoundingClientRect();
      const isVisible = 
        rect.top < window.innerHeight && 
        rect.bottom > 0;
      
      if (!isVisible) return;
      
      // Check if the user is pressing the arrow keys and not in an input element
      const tagName = (document.activeElement?.tagName || '').toLowerCase();
      const isInputFocused = tagName === 'input' || tagName === 'textarea';
      
      if (isInputFocused) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setScrollPosition(scrollLeft / (scrollWidth - clientWidth));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    if (scrollContainerRef.current) {
      const x = e.pageX - (scrollContainerRef.current.offsetLeft || 0);
      const walk = (x - startX) * 2; // Scroll speed
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    if (scrollContainerRef.current) {
      const x = e.touches[0].pageX - (scrollContainerRef.current.offsetLeft || 0);
      const walk = (x - startX) * 2;
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  // Add methods for navigation buttons
  const scrollPrev = () => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({ left: -containerWidth * 0.8, behavior: 'smooth' });
    }
  };

  const scrollNext = () => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({ left: containerWidth * 0.8, behavior: 'smooth' });
    }
  };

  // Calculate if we can scroll in either direction
  const canScrollPrev = scrollPosition > 0;
  const canScrollNext = scrollPosition < 0.99 && scrollContainerRef.current ? 
    scrollContainerRef.current.scrollWidth > scrollContainerRef.current.clientWidth : false;

  return (
    <section className="mb-16">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{prompt.text}</h3>
        <p className="text-muted-foreground">{prompt.description}</p>
      </div>
      <div className="relative group">
        {/* Navigation buttons */}
        <button 
          onClick={scrollPrev}
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background border border-border shadow-md flex items-center justify-center z-20 transition-opacity duration-300",
            canScrollPrev ? "opacity-80 hover:opacity-100" : "opacity-0 cursor-default pointer-events-none",
            "md:opacity-0 md:group-hover:opacity-80"
          )}
          aria-label="Scroll left"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={scrollNext}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background border border-border shadow-md flex items-center justify-center z-20 transition-opacity duration-300",
            canScrollNext ? "opacity-80 hover:opacity-100" : "opacity-0 cursor-default pointer-events-none",
            "md:opacity-0 md:group-hover:opacity-80"
          )}
          aria-label="Scroll right"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Visual indicators of more content */}
        <div className={cn(
          "absolute top-0 right-0 h-full w-20 bg-gradient-to-r from-transparent to-background z-10 pointer-events-none",
          canScrollNext ? "opacity-100" : "opacity-0"
        )}></div>
        <div className={cn(
          "absolute top-0 left-0 h-full w-5 bg-gradient-to-l from-transparent to-background z-10 pointer-events-none",
          canScrollPrev ? "opacity-100" : "opacity-0"
        )}></div>
        
        {/* Scroll container */}
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto pb-4 hide-scrollbar" 
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
        >
          <div className="flex space-x-6" style={{ minWidth: "max-content" }}>
            {prompt.agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} promptId={prompt.id} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Pagination dots */}
      <div className="flex justify-center mt-4">
        <div className="flex space-x-2">
          {prompt.agents.map((_, index) => (
            <span 
              key={index} 
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                index === Math.floor(scrollPosition * prompt.agents.length) 
                  ? "w-8 bg-primary" 
                  : "w-2 bg-gray-300"
              )}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
}
