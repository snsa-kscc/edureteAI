-- Migration to add subscription pending cancellation and tier change tracking
-- Add cancelAtPeriodEnd column with default value of false
ALTER TABLE subscriptions 
ADD COLUMN cancel_at_period_end BOOLEAN DEFAULT FALSE;

-- Add pendingTier column (nullable)
ALTER TABLE subscriptions
ADD COLUMN pending_tier TEXT;

-- Update existing subscriptions to have appropriate values
UPDATE subscriptions
SET cancel_at_period_end = FALSE, 
    pending_tier = NULL
WHERE cancel_at_period_end IS NULL;
