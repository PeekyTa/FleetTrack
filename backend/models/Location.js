import pool from '../config/db.js';

class Location {
  static async create(device_id, latitude, longitude) {
    const [result] = await pool.execute(
      'INSERT INTO Locations (device_id, latitude, longitude) VALUES (?, ?, ?)',
      [device_id, latitude, longitude]
    );
    return result;
  }

  static async findHistoryByDeviceId(device_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM Locations WHERE device_id = ? ORDER BY timestamp DESC LIMIT 100',
      [device_id]
    );
    return rows;
  }

  static async findLatestByDeviceId(device_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM Locations WHERE device_id = ? ORDER BY timestamp DESC LIMIT 1',
      [device_id]
    );
    return rows[0];
  }

  static async findLatestForAll() {
    const [rows] = await pool.execute(`
      SELECT l.*, d.name as device_name
      FROM Locations l
      INNER JOIN (
        SELECT device_id, MAX(timestamp) as max_time
        FROM Locations
        GROUP BY device_id
      ) latest ON l.device_id = latest.device_id AND l.timestamp = latest.max_time
      JOIN Devices d ON l.device_id = d.id
    `);
    return rows;
  }
}

export default Location;
