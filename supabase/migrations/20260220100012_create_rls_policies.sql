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
