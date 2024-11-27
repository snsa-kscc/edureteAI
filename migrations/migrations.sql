-- Create usage table
CREATE TABLE IF NOT EXISTS usage (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_tokens INTEGER NOT NULL,
  completion_tokens INTEGER NOT NULL,
  total_tokens INTEGER NOT NULL,
  cost DECIMAL(10,4) NOT NULL,
  timestamp TIMESTAMP NOT NULL
);

-- Create quotas table
CREATE TABLE IF NOT EXISTS quotas (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  model TEXT NOT NULL,
  total_tokens_used INTEGER NOT NULL DEFAULT 0,
  total_cost DECIMAL(10,4) NOT NULL DEFAULT 0,
  quota_limit DECIMAL(10,2) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_usage_user_id ON usage(user_id);
CREATE INDEX idx_usage_user_model ON usage(user_id, model);
CREATE INDEX idx_usage_timestamp ON usage(timestamp);
CREATE INDEX idx_quotas_user_model ON quotas(user_id, model);
