import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL!);

export const initDB = async (): Promise<void> => {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      email         TEXT UNIQUE NOT NULL,
      password      TEXT NOT NULL,
      role          TEXT NOT NULL DEFAULT 'employee',
      avatar        TEXT,
      title         TEXT,
      department    TEXT,
      phone         TEXT,
      registered_at DATE DEFAULT CURRENT_DATE
    )
  `;

  await sql`
    INSERT INTO users (id, name, email, password, role, avatar, title, department)
    VALUES
      ('usr-001', 'Asiful Islam', 'asifulcse22@gmail.com', 'password123', 'admin',
       'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
       'Managing Director & Admin', 'Executive'),
      ('usr-002', 'Tanvir Ahmed', 'tanvir@businesspro.com', 'password123', 'employee',
       'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
       'Senior Developer', 'Engineering')
    ON CONFLICT (email) DO NOTHING
  `;

  console.log('✅ Database initialized & users seeded');
};

export default sql;