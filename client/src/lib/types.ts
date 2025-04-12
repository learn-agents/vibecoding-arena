export interface Agent {
  id: string;
  promptId: string;
  agentName: string;
  gifUrl: string;
  codeLink: string;
}

export interface Prompt {
  id: string;
  text: string;
  description: string;
  carouselIndex: number;
  agents: Agent[];
}
