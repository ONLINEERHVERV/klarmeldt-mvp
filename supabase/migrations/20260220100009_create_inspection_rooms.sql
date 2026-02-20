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
