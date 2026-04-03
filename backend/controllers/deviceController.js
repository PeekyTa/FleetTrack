import Device from '../models/Device.js';

export const getDevices = async (req, res) => {
  try {
    const devices = await Device.findAll();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDevice = async (req, res) => {
  const { name, device_identifier, status } = req.body;

  try {
    const result = await Device.create(name, device_identifier, status);
    const newDevice = await Device.findById(result.insertId);
    res.status(201).json(newDevice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDevice = async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;

  try {
    const device = await Device.findById(id);
    if (!device) return res.status(404).json({ message: 'Device not found' });

    await Device.update(id, name, status);
    const updatedDevice = await Device.findById(id);
    res.json(updatedDevice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDevice = async (req, res) => {
  const { id } = req.params;

  try {
    const device = await Device.findById(id);
    if (!device) return res.status(404).json({ message: 'Device not found' });

    await Device.delete(id);
    res.json({ message: 'Device removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDeviceStats = async (req, res) => {
  try {
    const stats = await Device.getDeviceStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
