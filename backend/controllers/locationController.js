import Location from '../models/Location.js';

export const addLocation = async (req, res) => {
  const { device_id, latitude, longitude } = req.body;

  try {
    const result = await Location.create(device_id, latitude, longitude);
    res.status(201).json({ id: result.insertId, device_id, latitude, longitude });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLocationHistory = async (req, res) => {
  const { deviceId } = req.params;

  try {
    const history = await Location.findHistoryByDeviceId(deviceId);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLatestLocation = async (req, res) => {
  const { deviceId } = req.params;

  try {
    const location = await Location.findLatestByDeviceId(deviceId);
    if (!location) {
      return res.status(404).json({ message: 'No location found for this device' });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllLatestLocations = async (req, res) => {
  try {
    const locations = await Location.findLatestForAll();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
