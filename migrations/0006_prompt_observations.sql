CREATE TABLE IF NOT EXISTS prompt_observations (
  player TEXT NOT NULL,
  prompt_id TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (player, prompt_id, prompt_text)
);
CREATE INDEX IF NOT EXISTS prompt_observations_window ON prompt_observations(created_at);
CREATE INDEX IF NOT EXISTS prompt_observations_prompt ON prompt_observations(prompt_id, prompt_text);

CREATE TABLE IF NOT EXISTS prompt_mtimes (
  prompt_id TEXT PRIMARY KEY,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS stats_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
