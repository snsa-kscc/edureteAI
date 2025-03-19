CREATE TABLE IF NOT EXISTS message_counts (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  total_messages INTEGER NOT NULL DEFAULT 0,
  premium_model_messages INTEGER NOT NULL DEFAULT 0,
  subscription_tier TEXT NOT NULL DEFAULT 'free',
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_message_counts_user_id ON message_counts(user_id);
