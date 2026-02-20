CREATE TABLE trades (
  key         TEXT PRIMARY KEY,
  label       TEXT NOT NULL,
  color       TEXT NOT NULL,
  bg_color    TEXT NOT NULL,
  emoji       TEXT NOT NULL,
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO trades (key, label, color, bg_color, emoji, sort_order) VALUES
  ('maler',     'Maler',      '#3B82F6', '#EFF6FF', '🎨', 1),
  ('tomrer',    'Tømrer',     '#F59E0B', '#FFFBEB', '🪚', 2),
  ('gulv',      'Gulv',       '#10B981', '#ECFDF5', '🪵', 3),
  ('el',        'Elektriker', '#8B5CF6', '#F5F3FF', '⚡', 4),
  ('vvs',       'VVS',        '#EF4444', '#FEF2F2', '🔧', 5),
  ('rengoring', 'Rengøring',  '#EC4899', '#FDF2F8', '✨', 6),
  ('murer',     'Murer',      '#78716C', '#F5F5F4', '🧱', 7);
