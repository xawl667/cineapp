CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username    VARCHAR(50) UNIQUE NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  avatar      VARCHAR(255),
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS films (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tmdb_id     INTEGER UNIQUE NOT NULL,
  titre       VARCHAR(255) NOT NULL,
  synopsis    TEXT,
  affiche     VARCHAR(255),
  note        DECIMAL(3,1),
  annee       INTEGER,
  genres      TEXT[],
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS favoris (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  film_id     UUID REFERENCES films(id) ON DELETE CASCADE,
  created_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, film_id)
);

CREATE TABLE IF NOT EXISTS watchlist (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  film_id     UUID REFERENCES films(id) ON DELETE CASCADE,
  created_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, film_id)
);

CREATE TABLE IF NOT EXISTS watched (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  film_id     UUID REFERENCES films(id) ON DELETE CASCADE,
  rating      INTEGER CHECK (rating BETWEEN 1 AND 5),
  review      TEXT,
  watched_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, film_id)
);

CREATE TABLE IF NOT EXISTS mood_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  mood        VARCHAR(50) NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);


