CREATE TABLE tracks (
  id INTEGER NOT NULL PRIMARY KEY,
  title VARCHAR NOT NULL,
  artist VARCHAR NOT NULL,
  filepath TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT FALSE
)