import * as Battery from "expo-battery";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { connectSocket, getSocket } from "../services/socket";
import { useDevice } from "./DeviceContext";

const BatteryContext = createContext();

export const BatteryProvider = ({ children }) => {
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [isCharging, setIsCharging] = useState(false);
  const [isLoadingBattery, setIsLoadingBattery] = useState(true);

  const batteryLevelRef = useRef(null);
  const isChargingRef = useRef(false);

  const { deviceId } = useDevice();

  useEffect(() => {
    batteryLevelRef.current = batteryLevel;
  }, [batteryLevel]);

  useEffect(() => {
    isChargingRef.current = isCharging;
  }, [isCharging]);

  useEffect(() => {
    let isMounted = true;

    const emitBatteryUpdate = (nextLevel, nextIsCharging) => {
      const socket = getSocket();

      if (!socket?.connected) {
        console.warn("Socket not available for emitting battery update");
        return;
      }

      if (!deviceId) return;

      socket.emit("battery-update", {
        deviceId,
        batteryLevel: nextLevel,
        isCharging: nextIsCharging,
      });
    };

    const updateState = (state) => {
      if (!isMounted) return;

      // Handle battery level safely
      if (state.batteryLevel >= 0) {
        setBatteryLevel(Math.round(state.batteryLevel * 100));
      }

      // FIX: include FULL state
      setIsCharging(
        state.batteryState === Battery.BatteryState.CHARGING ||
          state.batteryState === Battery.BatteryState.FULL,
      );
    };

    const init = async () => {
      try {
        await connectSocket();
        const state = await Battery.getPowerStateAsync();
        updateState(state);
      } catch (e) {
        console.warn("Battery error:", e);
      } finally {
        if (isMounted) setIsLoadingBattery(false);
      }
    };

    init();

    // 🔁 Battery level listener
    const levelSub = Battery.addBatteryLevelListener((event) => {
      if (event.batteryLevel >= 0) {
        const nextLevel = Math.round(event.batteryLevel * 100);

        setBatteryLevel(nextLevel);
        console.log("Battery level updated:", nextLevel + "%");

        emitBatteryUpdate(nextLevel, isChargingRef.current);
      }
    });

    // 🔁 Charging state listener
    const stateSub = Battery.addBatteryStateListener((event) => {
      const nextIsCharging =
        event.batteryState === Battery.BatteryState.CHARGING ||
        event.batteryState === Battery.BatteryState.FULL;

      setIsCharging(nextIsCharging);

      console.log(
        "Battery state updated:",
        event.batteryState === Battery.BatteryState.CHARGING
          ? "Charging"
          : event.batteryState === Battery.BatteryState.FULL
            ? "Full"
            : "Not Charging",
      );

      emitBatteryUpdate(batteryLevelRef.current, nextIsCharging);
    });

    return () => {
      isMounted = false;
      levelSub?.remove();
      stateSub?.remove();
    };
  }, [deviceId]);

  const value = useMemo(
    () => ({ batteryLevel, isCharging, isLoadingBattery }),
    [batteryLevel, isCharging, isLoadingBattery],
  );

  return (
    <BatteryContext.Provider value={value}>{children}</BatteryContext.Provider>
  );
};

export const useBattery = () => useContext(BatteryContext);
