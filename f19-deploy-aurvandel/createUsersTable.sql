CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY,
last_name TEXT NOT NULL,
first_name TEXT NOT NULL,
email TEXT NOT NULL UNIQUE,
encrypted_password TEXT NOT NULL,
CONSTRAINT email_check CHECK (email LIKE "%_@___%")
);

-- ~ INSERT INTO users (last_name, first_name, email, encrypted_password)
-- ~ VALUES
-- ~ ("Watkins","Parker","parkergw@gmail.com","asdf")
-- ~ ;
