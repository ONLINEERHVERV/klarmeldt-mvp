CREATE TABLE tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  trade_key       TEXT NOT NULL REFERENCES trades(key),
  description     TEXT NOT NULL,
  status          task_status NOT NULL DEFAULT 'afventer',
  assigned_to     UUID REFERENCES contractors(id) ON DELETE SET NULL,
  estimated_hours NUMERIC(5,1) NOT NULL DEFAULT 0,
  room            TEXT,
  notes           TEXT NOT NULL DEFAULT '',
  sort_order      SMALLINT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
