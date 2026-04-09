import AsyncStorage from "@react-native-async-storage/async-storage";

const DEVICE_ID_KEY = "device_id";
const DEVICE_DATA_KEY = "device_data";

export const saveDevice = async (deviceId, device) => {
  try {
    if (!deviceId || !device) return;

    await AsyncStorage.multiSet([
      [DEVICE_ID_KEY, String(deviceId)],
      [DEVICE_DATA_KEY, JSON.stringify(device)],
    ]);
  } catch (e) {
    console.error("Error saving device:", e);
  }
};

export const loadDevice = async () => {
  try {
    const entries = await AsyncStorage.multiGet([
      DEVICE_ID_KEY,
      DEVICE_DATA_KEY,
    ]);
    const map = Object.fromEntries(entries);

    const deviceId = map[DEVICE_ID_KEY] || null;
    const device = map[DEVICE_DATA_KEY]
      ? JSON.parse(map[DEVICE_DATA_KEY])
      : null;

    return { deviceId, device };
  } catch (e) {
    console.error("Error loading device:", e);
    return { deviceId: null, device: null };
  }
};

export const clearDevice = async () => {
  try {
    await AsyncStorage.multiRemove([DEVICE_ID_KEY, DEVICE_DATA_KEY]);
  } catch (e) {
    console.error("Error clearing device:", e);
  }
};
