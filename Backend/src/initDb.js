import pool from './config/db.js'

export async function initDb() {
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

    CREATE TABLE IF NOT EXISTS public.users (
      id uuid DEFAULT gen_random_uuid() NOT NULL,
      username character varying(50) NOT NULL,
      email character varying(255) NOT NULL,
      password character varying(255) NOT NULL,
      avatar character varying(255),
      created_at timestamp without time zone DEFAULT now(),
      bio text,
      CONSTRAINT users_pkey PRIMARY KEY (id),
      CONSTRAINT users_email_key UNIQUE (email),
      CONSTRAINT users_username_key UNIQUE (username)
    );

    CREATE TABLE IF NOT EXISTS public.films (
      id uuid DEFAULT gen_random_uuid() NOT NULL,
      tmdb_id integer NOT NULL,
      titre character varying(255) NOT NULL,
      synopsis text,
      affiche character varying(255),
      note numeric(3,1),
      annee integer,
      genres text[],
      created_at timestamp without time zone DEFAULT now(),
      CONSTRAINT films_pkey PRIMARY KEY (id),
      CONSTRAINT films_tmdb_id_key UNIQUE (tmdb_id)
    );

    CREATE TABLE IF NOT EXISTS public.favoris (
      id uuid DEFAULT gen_random_uuid() NOT NULL,
      user_id uuid,
      film_id uuid,
      created_at timestamp without time zone DEFAULT now(),
      CONSTRAINT favoris_pkey PRIMARY KEY (id),
      CONSTRAINT favoris_user_id_film_id_key UNIQUE (user_id, film_id),
      CONSTRAINT favoris_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
      CONSTRAINT favoris_film_id_fkey FOREIGN KEY (film_id) REFERENCES public.films(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS public.watchlist (
      id uuid DEFAULT gen_random_uuid() NOT NULL,
      user_id uuid,
      film_id uuid,
      created_at timestamp without time zone DEFAULT now(),
      CONSTRAINT watchlist_pkey PRIMARY KEY (id),
      CONSTRAINT watchlist_user_id_film_id_key UNIQUE (user_id, film_id),
      CONSTRAINT watchlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
      CONSTRAINT watchlist_film_id_fkey FOREIGN KEY (film_id) REFERENCES public.films(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS public.watched (
      id uuid DEFAULT gen_random_uuid() NOT NULL,
      user_id uuid,
      film_id uuid,
      rating integer,
      review text,
      watched_at timestamp without time zone DEFAULT now(),
      CONSTRAINT watched_pkey PRIMARY KEY (id),
      CONSTRAINT watched_user_id_film_id_key UNIQUE (user_id, film_id),
      CONSTRAINT watched_rating_check CHECK ((rating >= 1) AND (rating <= 5)),
      CONSTRAINT watched_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
      CONSTRAINT watched_film_id_fkey FOREIGN KEY (film_id) REFERENCES public.films(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS public.mood_sessions (
      id uuid DEFAULT gen_random_uuid() NOT NULL,
      user_id uuid,
      mood character varying(50) NOT NULL,
      created_at timestamp without time zone DEFAULT now(),
      CONSTRAINT mood_sessions_pkey PRIMARY KEY (id),
      CONSTRAINT mood_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS public.follows (
      id uuid DEFAULT gen_random_uuid() NOT NULL,
      follower_id uuid,
      following_id uuid,
      created_at timestamp without time zone DEFAULT now(),
      CONSTRAINT follows_pkey PRIMARY KEY (id),
      CONSTRAINT follows_follower_id_following_id_key UNIQUE (follower_id, following_id),
      CONSTRAINT follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.users(id) ON DELETE CASCADE,
      CONSTRAINT follows_following_id_fkey FOREIGN KEY (following_id) REFERENCES public.users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS public.activities (
      id uuid DEFAULT gen_random_uuid() NOT NULL,
      user_id uuid,
      type character varying(50) NOT NULL,
      film_id uuid,
      created_at timestamp without time zone DEFAULT now(),
      CONSTRAINT activities_pkey PRIMARY KEY (id),
      CONSTRAINT activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
      CONSTRAINT activities_film_id_fkey FOREIGN KEY (film_id) REFERENCES public.films(id) ON DELETE CASCADE
    );
  `)
  console.log('✅ Tables créées avec succès')
}