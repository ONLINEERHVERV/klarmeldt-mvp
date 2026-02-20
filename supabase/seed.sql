-- ============================================================
-- KLARMELDT SEED DATA
-- ============================================================
-- Self-contained: creates auth users, profiles, and all demo data.
-- Run this in Supabase SQL Editor after running migration.sql.
-- ============================================================

-- ============================================================
-- 1. CREATE AUTH USERS (directly in auth.users)
--    The handle_new_user trigger auto-creates profiles.
-- ============================================================

-- Admin: Pieter Secuur
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'pieter@goldschmidt.dk',
  crypt('demo1234', gen_salt('bf')),
  now(),
  '{"full_name": "Pieter Secuur", "role": "admin"}'::jsonb,
  'authenticated',
  'authenticated',
  now(), now()
);

-- Admin: Frederico Santos
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'frederico@goldschmidt.dk',
  crypt('demo1234', gen_salt('bf')),
  now(),
  '{"full_name": "Frederico Santos", "role": "admin"}'::jsonb,
  'authenticated',
  'authenticated',
  now(), now()
);

-- Contractor user: Phillip Lundholm (Maler Gruppen)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000101',
  '00000000-0000-0000-0000-000000000000',
  'phillip@malergruppen.dk',
  crypt('demo1234', gen_salt('bf')),
  now(),
  '{"full_name": "Phillip Lundholm", "role": "haandvaerker"}'::jsonb,
  'authenticated',
  'authenticated',
  now(), now()
);

-- Contractor user: Idris (Electi Gulvservice)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000102',
  '00000000-0000-0000-0000-000000000000',
  'info@jigulvservice.dk',
  crypt('demo1234', gen_salt('bf')),
  now(),
  '{"full_name": "Idris", "role": "haandvaerker"}'::jsonb,
  'authenticated',
  'authenticated',
  now(), now()
);

-- Contractor user: Lars Pedersen (Tømrer Pedersen)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000103',
  '00000000-0000-0000-0000-000000000000',
  'lars@tp.dk',
  crypt('demo1234', gen_salt('bf')),
  now(),
  '{"full_name": "Lars Pedersen", "role": "haandvaerker"}'::jsonb,
  'authenticated',
  'authenticated',
  now(), now()
);

-- Contractor user: Ahmed Hassan (El-Eksperten)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000104',
  '00000000-0000-0000-0000-000000000000',
  'ahmed@elek.dk',
  crypt('demo1234', gen_salt('bf')),
  now(),
  '{"full_name": "Ahmed Hassan", "role": "haandvaerker"}'::jsonb,
  'authenticated',
  'authenticated',
  now(), now()
);

-- Contractor user: Maria Sørensen (ProClean)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000105',
  '00000000-0000-0000-0000-000000000000',
  'maria@proclean.dk',
  crypt('demo1234', gen_salt('bf')),
  now(),
  '{"full_name": "Maria Sørensen", "role": "haandvaerker"}'::jsonb,
  'authenticated',
  'authenticated',
  now(), now()
);

-- Also insert into auth.identities (required by Supabase Auth for email login)
INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
SELECT id, id, json_build_object('sub', id, 'email', email)::jsonb, 'email', id, now(), now(), now()
FROM auth.users
WHERE id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000101',
  '00000000-0000-0000-0000-000000000102',
  '00000000-0000-0000-0000-000000000103',
  '00000000-0000-0000-0000-000000000104',
  '00000000-0000-0000-0000-000000000105'
);

-- ============================================================
-- 2. CONTRACTORS
--    user_id links to auth users created above
-- ============================================================

INSERT INTO contractors (id, user_id, name, contact_person, email, phone, trade_key, rate_dkk, lang, rating, completed_jobs, error_rate, on_time_rate) VALUES
  ('c0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Maler Gruppen ApS',      'Phillip Lundholm', 'phillip@malergruppen.dk', '29384756', 'maler',     425.00, 'da', 4.7, 34, 3.2,  94.0),
  ('c0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000102', 'Electi Gulvservice ApS',  'Idris',            'info@jigulvservice.dk',   '41413341', 'gulv',      475.00, 'da', 4.5, 22, 5.1,  88.0),
  ('c0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000103', 'Tømrer Pedersen',         'Lars Pedersen',    'lars@tp.dk',              '51234567', 'tomrer',    450.00, 'da', 3.8, 28, 11.4, 79.0),
  ('c0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000104', 'El-Eksperten',            'Ahmed Hassan',     'ahmed@elek.dk',           '60123456', 'el',        495.00, 'en', 4.9, 15, 1.2,  97.0),
  ('c0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000105', 'ProClean',                'Maria Sørensen',   'maria@proclean.dk',       '42345678', 'rengoring', 350.00, 'da', 4.6, 41, 2.8,  95.0);

-- ============================================================
-- 3. PROJECTS
-- ============================================================

INSERT INTO projects (id, address, zip, status, property_name, unit, area_m2, rooms, floor, move_out_date, start_date, deadline_date, inspection_at, created_by, tenant_years, created_at) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Klosterparken 14, 2. th',  '4100 Ringsted', 'igangvaerende', 'Klosterparken', '14-2th', 78, 3, 2, '2025-11-01', '2025-11-03', '2025-11-14', '2025-11-14T10:00:00+01:00', '00000000-0000-0000-0000-000000000001', 4, '2025-10-15T09:37:00+02:00'),
  ('a0000000-0000-0000-0000-000000000002', 'Klosterparken 8, 1. tv',   '4100 Ringsted', 'kommende',      'Klosterparken', '8-1tv',  65, 2, 1, '2025-12-01', '2025-12-02', '2025-12-13', '2025-12-13T09:00:00+01:00', '00000000-0000-0000-0000-000000000002', 7, '2025-10-28T14:12:00+01:00'),
  ('a0000000-0000-0000-0000-000000000003', 'Frederiksbro 22, 3. mf',   '3400 Hillerød', 'kommende',      'Frederiksbro',  '22-3mf', 92, 4, 3, '2026-01-01', '2026-01-02', '2026-01-16', '2026-01-16T10:00:00+01:00', '00000000-0000-0000-0000-000000000001', 2, '2025-11-05T08:50:00+01:00'),
  ('a0000000-0000-0000-0000-000000000004', 'Klosterparken 3, st. th',  '4100 Ringsted', 'afsluttet',     'Klosterparken', '3-stth', 55, 2, 0, '2025-10-01', '2025-10-02', '2025-10-11', '2025-10-11T13:00:00+02:00', '00000000-0000-0000-0000-000000000001', 3, '2025-09-10T10:00:00+02:00');

-- ============================================================
-- 4. TASKS
-- ============================================================

-- Project 1: Klosterparken 14 (igangværende)
INSERT INTO tasks (id, project_id, trade_key, description, status, assigned_to, estimated_hours, room, notes, sort_order) VALUES
  ('b0000000-0000-0000-0000-000000000101', 'a0000000-0000-0000-0000-000000000001', 'maler',     'Malerarbejde – vægge og lofter i alle rum',       'igang',    'c0000000-0000-0000-0000-000000000001', 16, 'Stue',          'Ekstra lag i køkken pga. fedtpletter', 1),
  ('b0000000-0000-0000-0000-000000000102', 'a0000000-0000-0000-0000-000000000001', 'maler',     'Maling af karme og fodpaneler',                    'igang',    'c0000000-0000-0000-0000-000000000001', 4,  'Entré',         '',                                     2),
  ('b0000000-0000-0000-0000-000000000103', 'a0000000-0000-0000-0000-000000000001', 'tomrer',    'Udskift dørgreb i entré + montér 3 dørstop',       'afventer', 'c0000000-0000-0000-0000-000000000003', 3,  'Entré',         '',                                     3),
  ('b0000000-0000-0000-0000-000000000104', 'a0000000-0000-0000-0000-000000000001', 'tomrer',    'Reparér listværk i soveværelse',                   'afventer', 'c0000000-0000-0000-0000-000000000003', 2,  'Soveværelse 1', 'Lister er knækket ved vindue',         4),
  ('b0000000-0000-0000-0000-000000000105', 'a0000000-0000-0000-0000-000000000001', 'gulv',      'Slibning og lakering af trægulv',                  'afventer', 'c0000000-0000-0000-0000-000000000002', 8,  'Stue',          'Dybe ridser ved vindue',               5),
  ('b0000000-0000-0000-0000-000000000106', 'a0000000-0000-0000-0000-000000000001', 'gulv',      'Slibning af gulv i soveværelse',                   'afventer', 'c0000000-0000-0000-0000-000000000002', 4,  'Soveværelse 1', '',                                     6),
  ('b0000000-0000-0000-0000-000000000107', 'a0000000-0000-0000-0000-000000000001', 'el',        'Kontrollér stikkontakter + udskift spots i bad',   'afventer', 'c0000000-0000-0000-0000-000000000004', 2,  'Badeværelse',   '',                                     7),
  ('b0000000-0000-0000-0000-000000000108', 'a0000000-0000-0000-0000-000000000001', 'rengoring', 'Hovedrengøring efter håndværkere',                  'afventer', 'c0000000-0000-0000-0000-000000000005', 4,  NULL,            '',                                     8);

-- Project 2: Klosterparken 8 (kommende)
INSERT INTO tasks (id, project_id, trade_key, description, status, assigned_to, estimated_hours, room, notes, sort_order) VALUES
  ('b0000000-0000-0000-0000-000000000201', 'a0000000-0000-0000-0000-000000000002', 'maler',     'Malerarbejde i alle rum',      'afventer', 'c0000000-0000-0000-0000-000000000001', 14, NULL,   '', 1),
  ('b0000000-0000-0000-0000-000000000202', 'a0000000-0000-0000-0000-000000000002', 'gulv',      'Gulvslibning i entré og stue', 'afventer', 'c0000000-0000-0000-0000-000000000002', 6,  'Stue', '', 2),
  ('b0000000-0000-0000-0000-000000000203', 'a0000000-0000-0000-0000-000000000002', 'rengoring', 'Hovedrengøring',               'afventer', 'c0000000-0000-0000-0000-000000000005', 3,  NULL,   '', 3);

-- Project 4: Klosterparken 3 (afsluttet)
INSERT INTO tasks (id, project_id, trade_key, description, status, assigned_to, estimated_hours, room, notes, sort_order) VALUES
  ('b0000000-0000-0000-0000-000000000301', 'a0000000-0000-0000-0000-000000000004', 'maler',     'Malerarbejde – vægge', 'godkendt', 'c0000000-0000-0000-0000-000000000001', 10, NULL, '', 1),
  ('b0000000-0000-0000-0000-000000000302', 'a0000000-0000-0000-0000-000000000004', 'rengoring', 'Hovedrengøring',       'godkendt', 'c0000000-0000-0000-0000-000000000005', 3,  NULL, '', 2);

-- ============================================================
-- 5. TIME LOGS
-- ============================================================

INSERT INTO time_logs (task_id, logged_by, hours, description, logged_date) VALUES
  ('b0000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000101', 11.5, 'Malerarbejde i stue, køkken, soveværelser', '2025-11-05'),
  ('b0000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000101', 2.0,  'Karme og fodpaneler i entré',               '2025-11-04'),
  ('b0000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000101', 9.5,  'Malerarbejde afsluttet',                    '2025-10-08'),
  ('b0000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000105', 3.0,  'Hovedrengøring afsluttet',                  '2025-10-10');

-- ============================================================
-- 6. MESSAGES
-- ============================================================

INSERT INTO messages (project_id, sender_id, text, created_at) VALUES
  ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Hej alle – projektet er oprettet. Maler starter mandag d. 3/11.',                  '2025-10-15T10:00:00+02:00'),
  ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Modtaget! Vi er klar mandag morgen kl. 7.',                                         '2025-10-15T11:23:00+02:00'),
  ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'Fint – regner med at starte onsdag d. 5/11 efter maler er færdig i stuen.',         '2025-10-15T14:05:00+02:00');

-- ============================================================
-- 7. LIABILITY ITEMS
-- ============================================================

-- Project 1
INSERT INTO liability_items (project_id, party, description, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'lejer',   'Ridser i gulv ved vindue (stue)', 1),
  ('a0000000-0000-0000-0000-000000000001', 'lejer',   'Rengøring af ovn',                2),
  ('a0000000-0000-0000-0000-000000000001', 'udlejer', 'Malerarbejde (normal slitage)',    1),
  ('a0000000-0000-0000-0000-000000000001', 'udlejer', 'Udskiftning af dørgreb',          2),
  ('a0000000-0000-0000-0000-000000000001', 'udlejer', 'Reparation af listværk',          3);

-- Project 4
INSERT INTO liability_items (project_id, party, description, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000004', 'lejer',   'Rengøring af ovn', 1),
  ('a0000000-0000-0000-0000-000000000004', 'udlejer', 'Maling (slitage)',  1);

-- ============================================================
-- 8. INSPECTION DATA
-- ============================================================

INSERT INTO inspection_data (project_id, completed, inspection_date, pass_rate, conducted_by) VALUES
  ('a0000000-0000-0000-0000-000000000004', true, '2025-10-11', 100.0, '00000000-0000-0000-0000-000000000001');

INSERT INTO inspection_rooms (inspection_id, room_name, status) VALUES
  ((SELECT id FROM inspection_data WHERE project_id = 'a0000000-0000-0000-0000-000000000004'), 'Stue',          'godkendt'),
  ((SELECT id FROM inspection_data WHERE project_id = 'a0000000-0000-0000-0000-000000000004'), 'Køkken',        'godkendt'),
  ((SELECT id FROM inspection_data WHERE project_id = 'a0000000-0000-0000-0000-000000000004'), 'Soveværelse 1', 'godkendt'),
  ((SELECT id FROM inspection_data WHERE project_id = 'a0000000-0000-0000-0000-000000000004'), 'Badeværelse',   'godkendt');

-- ============================================================
-- DEMO LOGIN CREDENTIALS
-- ============================================================
-- All passwords: demo1234
--
-- Admin:       pieter@goldschmidt.dk
-- Admin:       frederico@goldschmidt.dk
-- Håndværker:  phillip@malergruppen.dk
-- Håndværker:  info@jigulvservice.dk
-- Håndværker:  lars@tp.dk
-- Håndværker:  ahmed@elek.dk
-- Håndværker:  maria@proclean.dk
