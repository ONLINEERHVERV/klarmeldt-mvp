CREATE TABLE inspection_data (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  completed       BOOLEAN NOT NULL DEFAULT false,
  inspection_date DATE,
  pass_rate       NUMERIC(4,1) NOT NULL DEFAULT 0,
  conducted_by    UUID REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT one_inspection_per_project UNIQUE (project_id)
);
