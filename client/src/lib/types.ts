export interface Agent {
  id: string;
  promptId: string;
  agentName: string;
  gifUrl: string;
  codeLink: string;
  originalGifUrl?: string; // Optional field for the original GIF URL when converted to video
  createdAt?: string; // Date when the agent/website was created
  siteLink?: string; // Link to the actual website created by the agent
}

export interface Prompt {
  id: string;
  text: string;
  description: string;
  carouselIndex: number;
  fullPromptLink?: string; // URL to the full prompt details
  agents: Agent[];
}
