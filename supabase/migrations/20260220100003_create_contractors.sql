CREATE TABLE contractors (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  contact_person  TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT NOT NULL,
  trade_key       TEXT NOT NULL REFERENCES trades(key),
  rate_dkk        NUMERIC(8,2) NOT NULL,
  lang            lang_code NOT NULL DEFAULT 'da',
  rating          NUMERIC(2,1) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  completed_jobs  INTEGER NOT NULL DEFAULT 0,
  error_rate      NUMERIC(4,1) NOT NULL DEFAULT 0,
  on_time_rate    NUMERIC(4,1) NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
