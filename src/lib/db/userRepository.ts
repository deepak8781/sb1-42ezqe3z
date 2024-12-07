import { db } from './client';
import type { User } from '../auth/types';

export class UserRepository {
  async createUser(user: User): Promise<void> {
    await db.execute({
      sql: `INSERT INTO users (id, email, name, created_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
            email = excluded.email,
            name = excluded.name`,
      args: [
        user.id,
        user.email,
        user.name,
        new Date().toISOString()
      ]
    });
  }

  async getUser(id: string): Promise<User | null> {
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE id = ?',
      args: [id]
    });

    if (!result.rows.length) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      email: row.email,
      name: row.name
    };
  }
}