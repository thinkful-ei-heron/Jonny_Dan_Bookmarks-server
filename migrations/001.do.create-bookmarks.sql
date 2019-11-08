create table bookmarks (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    rating INTEGER CHECK (rating > 0 AND rating <= 5)
);