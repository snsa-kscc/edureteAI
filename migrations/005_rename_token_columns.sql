-- Migration: Add new token columns for AI SDK v5 compatibility
-- Date: 2025-01-07
-- Description: Add input_tokens and output_tokens columns alongside existing prompt_tokens and completion_tokens
--              This allows for backward compatibility during the transition period

-- Add new columns for AI SDK v5 naming convention
ALTER TABLE usage ADD COLUMN IF NOT EXISTS input_tokens INTEGER;
ALTER TABLE usage ADD COLUMN IF NOT EXISTS output_tokens INTEGER;

-- Copy existing data from old columns to new columns
UPDATE usage SET 
  input_tokens = prompt_tokens,
  output_tokens = completion_tokens
WHERE input_tokens IS NULL OR output_tokens IS NULL;

-- Note: Keep both old and new columns for now to maintain backward compatibility
-- In a future migration, you can drop the old columns once fully migrated
