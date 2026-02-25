CREATE TABLE time_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id     UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  logged_by   UUID NOT NULL REFERENCES profiles(id),
  hours       NUMERIC(5,2) NOT NULL CHECK (hours > 0),
  description TEXT NOT NULL DEFAULT '',
  logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
  started_at  TIMESTAMPTZ,
  ended_at    TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Computed view: total hours per task (replaces task.timeLogged)
CREATE OR REPLACE VIEW task_time_summary
WITH (security_invoker = on) AS
SELECT
  task_id,
  COALESCE(SUM(hours), 0) AS total_hours,
  COUNT(*) AS log_count
FROM time_logs
GROUP BY task_id;
