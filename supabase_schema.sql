-- Create initial tables
CREATE TABLE plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  capacity NUMERIC,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE plant_configurations (
  plant_id UUID PRIMARY KEY REFERENCES plants(id) ON DELETE CASCADE,
  operating_hours_per_day NUMERIC DEFAULT 24,
  production_capacity_per_hour NUMERIC,
  working_days_per_year NUMERIC DEFAULT 365,
  shutdown_window_days NUMERIC,
  maintenance_budget NUMERIC,
  electricity_cost_per_kwh NUMERIC,
  fuel_cost_per_ton NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  manufacturer TEXT,
  serial_number TEXT,
  installation_date DATE,
  power_rating NUMERIC,
  criticality TEXT,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE sensors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  sensor_type TEXT NOT NULL,
  unit TEXT,
  minimum NUMERIC,
  maximum NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE telemetry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_id UUID REFERENCES sensors(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ DEFAULT now(),
  value NUMERIC NOT NULL
);
CREATE INDEX idx_telemetry_sensor_time ON telemetry(sensor_id, timestamp DESC);

CREATE TABLE maintenance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  maintenance_type TEXT NOT NULL,
  description TEXT,
  performed_at TIMESTAMPTZ DEFAULT now(),
  cost NUMERIC,
  downtime_hours NUMERIC,
  status TEXT DEFAULT 'Ended'
);

CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT,
  estimated_loss NUMERIC,
  repair_cost NUMERIC,
  recommended_before TIMESTAMPTZ,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  severity TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE simulation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  delay_days NUMERIC NOT NULL,
  predicted_failure TIMESTAMPTZ,
  predicted_cost NUMERIC,
  predicted_downtime NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT,
  pdf_url TEXT,
  generated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow authenticated users full access for now)
CREATE POLICY "Enable ALL for authenticated users" ON plants FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable ALL for authenticated users" ON plant_configurations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable ALL for authenticated users" ON equipment FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable ALL for authenticated users" ON sensors FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable ALL for authenticated users" ON telemetry FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable ALL for authenticated users" ON maintenance_records FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable ALL for authenticated users" ON recommendations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable ALL for authenticated users" ON alerts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable ALL for authenticated users" ON simulation_sessions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable ALL for authenticated users" ON reports FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- 11. Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. Machine Timelines
CREATE TABLE machine_timelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  state TEXT NOT NULL,
  start_time TIMESTAMPTZ DEFAULT now(),
  end_time TIMESTAMPTZ,
  notes TEXT
);

-- 13. Plant KPIs
CREATE TABLE plant_kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ DEFAULT now(),
  availability NUMERIC,
  performance NUMERIC,
  quality NUMERIC,
  oee NUMERIC
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE machine_timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_kpis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable ALL for authenticated users" ON profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable ALL for authenticated users" ON machine_timelines FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable ALL for authenticated users" ON plant_kpis FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create a trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $`$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'Admin');
  RETURN new;
END;
$`$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
