export interface Agent {
  id: string;
  promptId: string;
  agentName: string;
  gifUrl: string;
  codeLink: string;
  originalGifUrl?: string; // Optional field for the original GIF URL when converted to video
}

export interface Prompt {
  id: string;
  text: string;
  description: string;
  carouselIndex: number;
  agents: Agent[];
}
