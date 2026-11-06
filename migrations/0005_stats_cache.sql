CREATE INDEX IF NOT EXISTS answers_created_at ON answers(created_at);
CREATE INDEX IF NOT EXISTS runs_completed_created ON runs(completed, created_at);
