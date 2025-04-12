import { 
  prompts, agentResults, 
  type Prompt, type AgentResult,
  type InsertPrompt, type InsertAgentResult 
} from "@shared/schema";
import { mockPrompts } from "../client/src/data/mockData";
import { YamlStorage } from "./yamlStorage";
import fs from 'fs';
import path from 'path';

export interface IStorage {
  getPrompts(): Promise<Prompt[]>;
  getPromptById(id: string): Promise<Prompt | undefined>;
  getAgentResultsByPromptId(promptId: string): Promise<AgentResult[]>;
  getAllPromptsWithAgents(): Promise<any[]>;
}

export class MemStorage implements IStorage {
  private prompts: Map<string, Prompt>;
  private agents: Map<string, AgentResult>;

  constructor() {
    this.prompts = new Map();
    this.agents = new Map();
    
    // Initialize with mock data
    this.initMockData();
  }

  private initMockData() {
    mockPrompts.forEach(prompt => {
      // Insert prompt
      const promptData: Prompt = {
        id: prompt.id,
        text: prompt.text,
        description: prompt.description,
        carouselIndex: prompt.carouselIndex,
      };
      this.prompts.set(prompt.id, promptData);
      
      // Insert agent results
      prompt.agents.forEach(agent => {
        const agentData: AgentResult = {
          id: agent.id,
          promptId: agent.promptId,
          agentName: agent.agentName,
          gifUrl: agent.gifUrl,
          codeLink: agent.codeLink,
        };
        this.agents.set(agent.id, agentData);
      });
    });
  }

  async getPrompts(): Promise<Prompt[]> {
    return Array.from(this.prompts.values());
  }

  async getPromptById(id: string): Promise<Prompt | undefined> {
    return this.prompts.get(id);
  }

  async getAgentResultsByPromptId(promptId: string): Promise<AgentResult[]> {
    return Array.from(this.agents.values()).filter(
      (agent) => agent.promptId === promptId
    );
  }

  async getAllPromptsWithAgents(): Promise<any[]> {
    const result = [];
    
    for (const prompt of this.prompts.values()) {
      const agents = await this.getAgentResultsByPromptId(prompt.id);
      result.push({
        ...prompt,
        agents,
      });
    }
    
    // Sort by carouselIndex
    result.sort((a, b) => a.carouselIndex - b.carouselIndex);
    
    return result;
  }
}

// Check if YAML file exists and use YamlStorage if it does, otherwise fallback to MemStorage
const yamlPath = path.join(process.cwd(), 'prompts-metadata.yaml');
export const storage = fs.existsSync(yamlPath) 
  ? new YamlStorage() 
  : new MemStorage();
