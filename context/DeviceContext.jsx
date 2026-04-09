import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { api } from "../utils/api";
import { clearDevice, loadDevice, saveDevice } from "../utils/deviceStorage";
import { useAuth } from "./AuthContext";

const DeviceContext = createContext();

const pickDeviceId = (value) => {
  if (!value || typeof value !== "object") return null;

  return (
    value._id ||
    value.id ||
    value.deviceId ||
    value.device?._id ||
    value.device?.id ||
    value.device?.deviceId ||
    null
  );
};

const normalizeDevicePayload = (value) => {
  if (!value || typeof value !== "object") return null;

  if (value.device && typeof value.device === "object") {
    return value.device;
  }

  return value;
};

export const DeviceProvider = ({ children }) => {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [deviceId, setDeviceId] = useState(null);
  const [device, setDevice] = useState(null);
  const [isLoadingDevice, setIsLoadingDevice] = useState(true);
  const [deviceError, setDeviceError] = useState(null);

  const persistDevice = useCallback(async (nextDeviceId, nextDevice) => {
    if (!nextDeviceId || !nextDevice) return;

    setDeviceId(String(nextDeviceId));
    setDevice(nextDevice);
    await saveDevice(String(nextDeviceId), nextDevice);
  }, []);

  const clearDeviceState = useCallback(
    async ({ clearStorage = false } = {}) => {
      setDeviceId(null);
      setDevice(null);
      setDeviceError(null);

      if (clearStorage) {
        await clearDevice();
      }
    },
    [],
  );

  const refreshDevice = useCallback(
    async (idOverride) => {
      const idToFetch = idOverride || deviceId;
      if (!idToFetch) return null;

      try {
        setDeviceError(null);
        const response = await api.get(`/devices/${idToFetch}`);

        const payload = response?.data;
        const normalizedDevice = normalizeDevicePayload(payload);
        const normalizedId =
          pickDeviceId(payload) || pickDeviceId(normalizedDevice) || idToFetch;

        if (!normalizedDevice || !normalizedId) {
          throw new Error("Invalid device response from server.");
        }

        await persistDevice(normalizedId, normalizedDevice);
        return normalizedDevice;
      } catch (error) {
        setDeviceError(
          error?.response?.data?.message ||
            error.message ||
            "Unable to fetch device.",
        );

        if (error?.response?.status === 404) {
          await clearDeviceState({ clearStorage: true });
        }

        return null;
      }
    },
    [clearDeviceState, deviceId, persistDevice],
  );

  const setCurrentDevice = useCallback(
    async (payload) => {
      const normalizedDevice = normalizeDevicePayload(payload);
      const normalizedId =
        pickDeviceId(payload) || pickDeviceId(normalizedDevice);

      if (!normalizedDevice || !normalizedId) {
        throw new Error("Device payload is missing a device id.");
      }

      await persistDevice(normalizedId, normalizedDevice);
      setDeviceError(null);
      return normalizedDevice;
    },
    [persistDevice],
  );

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      if (isAuthLoading) return;

      if (!user) {
        if (isMounted) {
          setDeviceId(null);
          setDevice(null);
          setDeviceError(null);
          setIsLoadingDevice(false);
        }
        return;
      }

      if (isMounted) setIsLoadingDevice(true);

      const stored = await loadDevice();
      if (!isMounted) return;

      if (stored.deviceId && stored.device) {
        setDeviceId(String(stored.deviceId));
        setDevice(stored.device);
      }

      if (stored.deviceId) {
        await refreshDevice(stored.deviceId);
      }

      if (isMounted) setIsLoadingDevice(false);
    };

    hydrate();

    return () => {
      isMounted = false;
    };
  }, [isAuthLoading, refreshDevice, user]);

  const value = useMemo(
    () => ({
      device,
      deviceId,
      isLoadingDevice,
      deviceError,
      hasDevice: Boolean(deviceId && device),
      setCurrentDevice,
      refreshDevice,
      clearDevice: () => clearDeviceState({ clearStorage: true }),
    }),
    [
      clearDeviceState,
      device,
      deviceError,
      deviceId,
      isLoadingDevice,
      refreshDevice,
      setCurrentDevice,
    ],
  );

  return (
    <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
  );
};

export const useDevice = () => useContext(DeviceContext);
