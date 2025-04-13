import { 
  type Prompt, type AgentResult
} from "@shared/schema";
import { IStorage } from "./storage";
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { v4 as uuidv4 } from 'uuid';

interface YamlAgent {
  name: string;
  created_at: string;
  video_url: string;
  code_link: string;
  logo_url: string | null;
}

interface YamlPrompt {
  shortname: string;
  full_prompt: string;
  description: string;
  agents: YamlAgent[];
}

interface YamlData {
  prompts: YamlPrompt[];
}

export class YamlStorage implements IStorage {
  private prompts: Map<string, Prompt>;
  private agents: Map<string, AgentResult>;

  constructor() {
    this.prompts = new Map();
    this.agents = new Map();
    this.loadFromYaml();
  }

  private loadFromYaml() {
    try {
      // Read the YAML file from the root directory
      const yamlPath = path.join(process.cwd(), 'prompts-metadata.yaml');
      const fileContents = fs.readFileSync(yamlPath, 'utf8');
      const data = yaml.load(fileContents) as YamlData;
      
      if (!data || !data.prompts) {
        console.error('Invalid YAML file structure. Expected "prompts" array.');
        return;
      }

      // Process each prompt from the YAML file
      data.prompts.forEach((yamlPrompt, index) => {
        const promptData: Prompt = {
          id: yamlPrompt.shortname,
          text: yamlPrompt.full_prompt,
          description: yamlPrompt.description,
          carouselIndex: index,
        };

        this.prompts.set(yamlPrompt.shortname, promptData);
        
        // Process agents for this prompt
        yamlPrompt.agents.forEach(yamlAgent => {
          const agentId = uuidv4();
          const agentData: AgentResult = {
            id: agentId,
            promptId: yamlPrompt.shortname,
            agentName: yamlAgent.name,
            gifUrl: yamlAgent.video_url, // Map video_url to gifUrl for compatibility with existing schema
            codeLink: yamlAgent.code_link,
            originalGifUrl: null, // No original URLs are needed anymore
            logoUrl: yamlAgent.logo_url // Add logo URL if available
          };

          this.agents.set(agentId, agentData);
        });
      });

      console.log(`Loaded ${this.prompts.size} prompts and ${this.agents.size} agents from YAML file`);
    } catch (error) {
      console.error('Error loading prompts from YAML:', error);
    }
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