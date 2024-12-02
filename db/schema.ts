import { pgTable, serial, text, integer, timestamp, decimal } from "drizzle-orm/pg-core";

export const usage = pgTable("usage", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  model: text("model").notNull(),
  modelFamily: text("model_family").notNull(),
  promptTokens: integer("prompt_tokens").notNull(),
  completionTokens: integer("completion_tokens").notNull(),
  totalTokens: integer("total_tokens").notNull(),
  cost: decimal("cost", { precision: 10, scale: 4 }).notNull(),
  timestamp: timestamp("timestamp").notNull(),
});

export const quotas = pgTable("quotas", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  modelFamily: text("model_family").notNull(),
  totalTokensUsed: integer("total_tokens_used").notNull().default(0),
  totalCost: decimal("total_cost", { precision: 10, scale: 4 }).notNull().default("0"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const limits = pgTable("limits", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  modelFamily: text("model_family").notNull(),
  quotaLimit: decimal("quota_limit", { precision: 10, scale: 2 }).notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
