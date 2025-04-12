import { useRef, useState } from "react";
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

  return (
    <section className="mb-16">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{prompt.text}</h3>
        <p className="text-muted-foreground">{prompt.description}</p>
      </div>
      <div className="relative">
        <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-r from-transparent to-background z-10 pointer-events-none"></div>
        <div className="absolute top-0 left-0 h-full w-5 bg-gradient-to-l from-transparent to-background z-10 pointer-events-none"></div>
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
