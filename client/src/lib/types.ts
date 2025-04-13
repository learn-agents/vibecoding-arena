export interface Agent {
  id: string;
  promptId: string;
  agentName: string;
  gifUrl: string;
  codeLink: string;
  originalGifUrl?: string; // Optional field for the original GIF URL when converted to video
  logoUrl?: string; // Optional field for agent logo SVG URL
}

export interface Prompt {
  id: string;
  text: string;
  description: string;
  carouselIndex: number;
  agents: Agent[];
}
