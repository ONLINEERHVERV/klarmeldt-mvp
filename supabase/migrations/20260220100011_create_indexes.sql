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
