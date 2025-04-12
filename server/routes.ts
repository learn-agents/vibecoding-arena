import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // GET all prompts with their agent results
  app.get("/api/prompts", async (_req, res) => {
    try {
      const promptsWithAgents = await storage.getAllPromptsWithAgents();
      res.json(promptsWithAgents);
    } catch (error) {
      console.error("Error fetching prompts:", error);
      res.status(500).json({ message: "Failed to fetch prompts" });
    }
  });

  // GET a specific prompt by ID
  app.get("/api/prompts/:id", async (req, res) => {
    try {
      const prompt = await storage.getPromptById(req.params.id);
      
      if (!prompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }
      
      const agents = await storage.getAgentResultsByPromptId(prompt.id);
      
      res.json({
        ...prompt,
        agents,
      });
    } catch (error) {
      console.error(`Error fetching prompt ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch prompt" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
