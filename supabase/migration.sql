-- ============================================================
-- 20260220100000_create_enums.sql
-- ============================================================

-- Project status: kommende, igangvaerende, afsluttet
CREATE TYPE project_status AS ENUM ('kommende', 'igangvaerende', 'afsluttet');

-- Task status: afventer, igang, faerdig, godkendt, rettelse
CREATE TYPE task_status AS ENUM ('afventer', 'igang', 'faerdig', 'godkendt', 'rettelse');

-- User role
CREATE TYPE user_role AS ENUM ('admin', 'haandvaerker');

-- Liability party
CREATE TYPE liability_party AS ENUM ('lejer', 'udlejer');

-- Language preference
CREATE TYPE lang_code AS ENUM ('da', 'en');

-- Inspection room status
CREATE TYPE inspection_room_status AS ENUM ('godkendt', 'rettelse');


-- ============================================================
-- 20260220100001_create_trades.sql
-- ============================================================

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


-- ============================================================
-- 20260220100002_create_profiles.sql
-- ============================================================

CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  role        user_role NOT NULL DEFAULT 'haandvaerker',
  avatar_url  TEXT,
  phone       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'haandvaerker')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();


-- ============================================================
-- 20260220100003_create_contractors.sql
-- ============================================================

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


-- ============================================================
-- 20260220100004_create_projects.sql
-- ============================================================

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


-- ============================================================
-- 20260220100005_create_tasks.sql
-- ============================================================

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


-- ============================================================
-- 20260220100006_create_messages.sql
-- ============================================================

CREATE TABLE messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sender_id   UUID NOT NULL REFERENCES profiles(id),
  text        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================
-- 20260220100007_create_liability_items.sql
-- ============================================================

CREATE TABLE liability_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  party       liability_party NOT NULL,
  description TEXT NOT NULL,
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================
-- 20260220100008_create_inspection_data.sql
-- ============================================================

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


-- ============================================================
-- 20260220100009_create_inspection_rooms.sql
-- ============================================================

CREATE TABLE inspection_rooms (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id     UUID NOT NULL REFERENCES inspection_data(id) ON DELETE CASCADE,
  room_name         TEXT NOT NULL,
  status            inspection_room_status NOT NULL,
  comment           TEXT NOT NULL DEFAULT '',
  photo_url         TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT unique_room_per_inspection UNIQUE (inspection_id, room_name)
);


-- ============================================================
-- 20260220100010_create_time_logs.sql
-- ============================================================

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
CREATE OR REPLACE VIEW task_time_summary AS
SELECT
  task_id,
  COALESCE(SUM(hours), 0) AS total_hours,
  COUNT(*) AS log_count
FROM time_logs
GROUP BY task_id;


-- ============================================================
-- 20260220100011_create_indexes.sql
-- ============================================================

-- Projects
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_property ON projects(property_name);
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_projects_deadline ON projects(deadline_date);

-- Tasks
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_trade_key ON tasks(trade_key);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assigned_status ON tasks(assigned_to, status);

-- Messages
CREATE INDEX idx_messages_project_id ON messages(project_id, created_at);
CREATE INDEX idx_messages_sender ON messages(sender_id);

-- Liability items
CREATE INDEX idx_liability_project_id ON liability_items(project_id);

-- Inspection rooms
CREATE INDEX idx_inspection_rooms_inspection ON inspection_rooms(inspection_id);

-- Time logs
CREATE INDEX idx_time_logs_task ON time_logs(task_id);
CREATE INDEX idx_time_logs_user ON time_logs(logged_by);
CREATE INDEX idx_time_logs_date ON time_logs(logged_date);

-- Contractors
CREATE INDEX idx_contractors_trade ON contractors(trade_key);
CREATE INDEX idx_contractors_user ON contractors(user_id);

-- Profiles
CREATE INDEX idx_profiles_role ON profiles(role);

-- updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER set_updated_at BEFORE UPDATE ON trades FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON contractors FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON inspection_data FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- 20260220100012_create_rls_policies.sql
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE liability_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_logs ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- HELPER FUNCTIONS
-- =========================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION my_contractor_id()
RETURNS UUID AS $$
  SELECT id FROM contractors
  WHERE user_id = auth.uid()
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION contractor_has_project_access(p_project_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM tasks
    WHERE project_id = p_project_id
      AND assigned_to = my_contractor_id()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =========================================================
-- PROFILES
-- =========================================================

CREATE POLICY profiles_select_own ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY profiles_select_admin ON profiles
  FOR SELECT USING (is_admin());

CREATE POLICY profiles_update_own ON profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY profiles_update_admin ON profiles
  FOR UPDATE USING (is_admin());

-- =========================================================
-- TRADES (read-only for all authenticated users)
-- =========================================================

CREATE POLICY trades_select_all ON trades
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY trades_modify_admin ON trades
  FOR ALL USING (is_admin());

-- =========================================================
-- CONTRACTORS
-- =========================================================

CREATE POLICY contractors_select_admin ON contractors
  FOR SELECT USING (is_admin());

CREATE POLICY contractors_select_own ON contractors
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY contractors_modify_admin ON contractors
  FOR ALL USING (is_admin());

-- =========================================================
-- PROJECTS
-- =========================================================

CREATE POLICY projects_select_admin ON projects
  FOR SELECT USING (is_admin());

CREATE POLICY projects_select_contractor ON projects
  FOR SELECT USING (contractor_has_project_access(id));

CREATE POLICY projects_modify_admin ON projects
  FOR ALL USING (is_admin());

-- =========================================================
-- TASKS
-- =========================================================

CREATE POLICY tasks_select_admin ON tasks
  FOR SELECT USING (is_admin());

CREATE POLICY tasks_select_contractor ON tasks
  FOR SELECT USING (contractor_has_project_access(project_id));

CREATE POLICY tasks_insert_admin ON tasks
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY tasks_delete_admin ON tasks
  FOR DELETE USING (is_admin());

CREATE POLICY tasks_update_admin ON tasks
  FOR UPDATE USING (is_admin());

CREATE POLICY tasks_update_contractor ON tasks
  FOR UPDATE USING (assigned_to = my_contractor_id())
  WITH CHECK (assigned_to = my_contractor_id());

-- =========================================================
-- MESSAGES
-- =========================================================

CREATE POLICY messages_select_admin ON messages
  FOR SELECT USING (is_admin());

CREATE POLICY messages_select_contractor ON messages
  FOR SELECT USING (contractor_has_project_access(project_id));

CREATE POLICY messages_insert_admin ON messages
  FOR INSERT WITH CHECK (is_admin() AND sender_id = auth.uid());

CREATE POLICY messages_insert_contractor ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND contractor_has_project_access(project_id)
  );

-- =========================================================
-- LIABILITY ITEMS
-- =========================================================

CREATE POLICY liability_select_admin ON liability_items
  FOR SELECT USING (is_admin());

CREATE POLICY liability_select_contractor ON liability_items
  FOR SELECT USING (contractor_has_project_access(project_id));

CREATE POLICY liability_modify_admin ON liability_items
  FOR ALL USING (is_admin());

-- =========================================================
-- INSPECTION DATA
-- =========================================================

CREATE POLICY inspection_data_select_admin ON inspection_data
  FOR SELECT USING (is_admin());

CREATE POLICY inspection_data_select_contractor ON inspection_data
  FOR SELECT USING (contractor_has_project_access(project_id));

CREATE POLICY inspection_data_modify_admin ON inspection_data
  FOR ALL USING (is_admin());

-- =========================================================
-- INSPECTION ROOMS
-- =========================================================

CREATE POLICY inspection_rooms_select_admin ON inspection_rooms
  FOR SELECT USING (is_admin());

CREATE POLICY inspection_rooms_select_contractor ON inspection_rooms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM inspection_data id
      WHERE id.id = inspection_rooms.inspection_id
        AND contractor_has_project_access(id.project_id)
    )
  );

CREATE POLICY inspection_rooms_modify_admin ON inspection_rooms
  FOR ALL USING (is_admin());

-- =========================================================
-- TIME LOGS
-- =========================================================

CREATE POLICY time_logs_select_admin ON time_logs
  FOR SELECT USING (is_admin());

CREATE POLICY time_logs_select_own ON time_logs
  FOR SELECT USING (logged_by = auth.uid());

CREATE POLICY time_logs_insert_admin ON time_logs
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY time_logs_insert_contractor ON time_logs
  FOR INSERT WITH CHECK (
    logged_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_id
        AND tasks.assigned_to = my_contractor_id()
    )
  );

CREATE POLICY time_logs_delete_admin ON time_logs
  FOR DELETE USING (is_admin());


