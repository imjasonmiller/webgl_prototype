-- Remove in case of a previous instance
DROP DATABASE IF EXISTS webgl_prototype;
CREATE DATABASE webgl_prototype;
\c webgl_prototype;

-- Trigrams are used to speed up search
-- see https://www.postgresql.org/docs/10/static/pgtrgm.html
CREATE EXTENSION pg_trgm;

-- Pgcrypto for Blowfish password hashing
CREATE EXTENSION pgcrypto;

CREATE TYPE enum_locale AS ENUM (
  'en', 'hr', 'nl', 'pt'
);

CREATE TABLE users (
  user_name     TEXT NOT NULL PRIMARY KEY,
  user_pass     TEXT NOT NULL,
  user_locale   enum_locale NOT NULL DEFAULT 'en'
);

INSERT INTO users VALUES ('demo', crypt('ABC123', gen_salt('bf', 8)), 'en');

-- Usenames are indexed to speed up search
CREATE INDEX index_users_on_name_trigram ON users USING GIN(user_name gin_trgm_ops);
