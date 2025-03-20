import { pgTable, serial, text, integer, timestamp, decimal, boolean } from "drizzle-orm/pg-core";

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

export const message_counts = pgTable("message_counts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  totalMessages: integer("total_messages").notNull().default(0),
  premiumModelMessages: integer("premium_model_messages").notNull().default(0),
  subscriptionTier: text("subscription_tier").notNull().default("free"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripePriceId: text("stripe_price_id"),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
  tier: text("tier").notNull().default("free"), // "free", "paid", "paid_plus"
  status: text("status").notNull().default("inactive"), // "active", "canceled", "past_due", "inactive"
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
