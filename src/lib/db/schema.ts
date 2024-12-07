export const schema = `
CREATE TABLE IF NOT EXISTS cv_documents (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  content TEXT NOT NULL,
  file_type TEXT NOT NULL,
  upload_date TEXT NOT NULL,
  embedding BLOB,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cv_documents_user_id ON cv_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_cv_documents_upload_date ON cv_documents(upload_date);
`;