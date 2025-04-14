import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Prompt table
export const prompts = pgTable("prompts", {
  id: text("id").primaryKey(),
  text: text("text").notNull(),
  description: text("description").notNull(),
  carouselIndex: integer("carousel_index").notNull(),
});

// Agent results table
export const agentResults = pgTable("agent_results", {
  id: text("id").primaryKey(),
  promptId: text("prompt_id").notNull().references(() => prompts.id),
  agentName: text("agent_name").notNull(),
  gifUrl: text("gif_url").notNull(),
  codeLink: text("code_link").notNull(),
  originalGifUrl: text("original_gif_url"),  // Optional field for the original GIF URL when converted to video
  createdAt: text("created_at"),  // When the agent/website was created
  siteLink: text("site_link"),    // Link to the actual website created by the agent
});

// Insert schemas
export const insertPromptSchema = createInsertSchema(prompts);
export const insertAgentResultSchema = createInsertSchema(agentResults);

// Types
export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type InsertAgentResult = z.infer<typeof insertAgentResultSchema>;
export type Prompt = typeof prompts.$inferSelect;
export type AgentResult = typeof agentResults.$inferSelect;
