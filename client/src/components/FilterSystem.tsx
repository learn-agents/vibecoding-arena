import React, { useState, useEffect, useRef } from 'react';
import { Separator } from "../components/ui/separator";
import { cn } from '../lib/utils';
import { Agent, Prompt } from '../lib/types';
import { useQuery } from '@tanstack/react-query';

interface FilterSystemProps {
  onFilterChange: (selectedPrompts: string[], selectedAgents: string[]) => void;
}

export default function FilterSystem({ onFilterChange }: FilterSystemProps) {
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [uniqueAgentNames, setUniqueAgentNames] = useState<string[]>([]);

  // Fetch prompts data
  const { data: prompts } = useQuery<Prompt[]>({
    queryKey: ['/api/prompts'],
  });

  // Extract unique agent names once prompts data is loaded
  useEffect(() => {
    if (prompts) {
      const agentNamesSet = new Set<string>();
      
      prompts.forEach(prompt => {
        prompt.agents.forEach(agent => {
          agentNamesSet.add(agent.agentName);
        });
      });
      
      setUniqueAgentNames(Array.from(agentNamesSet));
    }
  }, [prompts]);

  // Handle prompt selection toggle
  const togglePrompt = (promptId: string) => {
    setSelectedPrompts(prev => {
      // Check if the prompt is already selected
      if (prev.includes(promptId)) {
        // If selected, remove it
        return prev.filter(id => id !== promptId);
      } else {
        // If not selected, add it
        return [...prev, promptId];
      }
    });
  };

  // Handle agent selection toggle
  const toggleAgent = (agentName: string) => {
    setSelectedAgents(prev => {
      // Check if the agent is already selected
      if (prev.includes(agentName)) {
        // If selected, remove it
        return prev.filter(name => name !== agentName);
      } else {
        // If not selected, add it
        return [...prev, agentName];
      }
    });
  };

  // Notify parent component when filters change
  useEffect(() => {
    onFilterChange(selectedPrompts, selectedAgents);
  }, [selectedPrompts, selectedAgents, onFilterChange]);

  return (
    <div className="mb-8 p-4 rounded-md border border-gray-200">
      <div className="flex flex-col md:flex-row">
        {/* Prompts Column */}
        <div className="flex-1 mb-4 md:mb-0">
          <h4 className="text-sm font-semibold uppercase mb-2 text-gray-600">Prompts</h4>
          <div className="grid grid-cols-2 auto-rows-auto gap-2">
            {prompts?.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => togglePrompt(prompt.id)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap",
                  selectedPrompts.includes(prompt.id)
                    ? "bg-black text-white" 
                    : "bg-white text-black border border-gray-300 hover:bg-gray-100"
                )}
              >
                {prompt.id}
              </button>
            ))}
          </div>
        </div>

        {/* Vertical Divider (visible on desktop) */}
        <div className="hidden md:block">
          <Separator orientation="vertical" className="mx-6 h-auto" />
        </div>

        {/* Horizontal Divider (visible on mobile) */}
        <div className="md:hidden mb-4">
          <Separator className="my-2" />
        </div>

        {/* Agents Column */}
        <div className="flex-1">
          <h4 className="text-sm font-semibold uppercase mb-2 text-gray-600">Agents</h4>
          <div className="flex flex-wrap gap-2">
            {uniqueAgentNames.map((agentName) => (
              <button
                key={agentName}
                onClick={() => toggleAgent(agentName)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm transition-colors min-w-0 max-w-full",
                  selectedAgents.includes(agentName)
                    ? "bg-black text-white" 
                    : "bg-white text-black border border-gray-300 hover:bg-gray-100"
                )}
                style={{ 
                  flexBasis: 'calc(33.333% - 0.5rem)',
                  flexGrow: 0,
                  flexShrink: 1
                }}
              >
                <span style={{ 
                  fontFamily: "'Space Mono', monospace",
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {agentName.charAt(0).toUpperCase() + agentName.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}