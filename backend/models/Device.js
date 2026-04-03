import pool from '../config/db.js';

class Device {
  static async create(name, device_identifier, status = 'active') {
    const [result] = await pool.execute(
      'INSERT INTO Devices (name, device_identifier, status) VALUES (?, ?, ?)',
      [name, device_identifier, status]
    );
    return result;
  }

  static async findAll() {
    const [rows] = await pool.execute('SELECT * FROM Devices ORDER BY created_at DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM Devices WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, name, status) {
    const [result] = await pool.execute(
      'UPDATE Devices SET name = ?, status = ? WHERE id = ?',
      [name, status, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM Devices WHERE id = ?', [id]);
    return result;
  }

  static async getDeviceStats() {
    const [rows] = await pool.execute(
      'SELECT status, count(*) as count FROM Devices GROUP BY status'
    );
    return rows;
  }
}

export default Device;
