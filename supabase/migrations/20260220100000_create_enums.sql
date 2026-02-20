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
