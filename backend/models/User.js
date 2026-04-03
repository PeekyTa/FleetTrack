import pool from '../config/db.js';

class User {
  static async create(name, email, password, role = 'user') {
    const [result] = await pool.execute(
      'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
    );
    return result;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM Users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT id, name, email, role, created_at FROM Users WHERE id = ?', [id]);
    return rows[0];
  }
}

export default User;
