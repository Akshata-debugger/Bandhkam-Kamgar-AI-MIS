# Database setup

1. Open MySQL Workbench and connect to your local MySQL server.
2. Open and run `01_schema.sql`. It creates the `bandhkam_kamgar_db` database and every table.
3. Optionally run `02_seed_master_data.sql` to add starter categories.
4. Copy `backend/.env.example` to `backend/.env` and replace `DB_PASSWORD` with your local MySQL password.
5. From the `backend` folder, run `npm run test:db`. It verifies that a complete application can be inserted and retrieved, then rolls back the test data.

`backend/.env` is private and must never be committed to GitHub.
