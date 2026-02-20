CREATE TABLE projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address         TEXT NOT NULL,
  zip             TEXT NOT NULL,
  status          project_status NOT NULL DEFAULT 'kommende',
  property_name   TEXT NOT NULL,
  unit            TEXT NOT NULL,
  area_m2         NUMERIC(6,1) NOT NULL,
  rooms           SMALLINT NOT NULL,
  floor           SMALLINT NOT NULL DEFAULT 0,
  move_out_date   DATE NOT NULL,
  start_date      DATE NOT NULL,
  deadline_date   DATE NOT NULL,
  inspection_at   TIMESTAMPTZ,
  created_by      UUID NOT NULL REFERENCES profiles(id),
  tenant_years    SMALLINT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT valid_date_range CHECK (start_date >= move_out_date AND deadline_date >= start_date)
);
