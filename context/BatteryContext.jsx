import * as Battery from "expo-battery";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const BatteryContext = createContext();

export const BatteryProvider = ({ children }) => {
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [isCharging, setIsCharging] = useState(false);
  const [isLoadingBattery, setIsLoadingBattery] = useState(true);

  useEffect(() => {
    let isMounted = true;

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
        setBatteryLevel(Math.round(event.batteryLevel * 100));
        console.log(
          "Battery level updated:",
          Math.round(event.batteryLevel * 100) + "%",
        );
      }
    });

    // 🔁 Charging state listener
    const stateSub = Battery.addBatteryStateListener((event) => {
      setIsCharging(
        event.batteryState === Battery.BatteryState.CHARGING ||
          event.batteryState === Battery.BatteryState.FULL,
      );
      console.log(
        "Battery state updated:",
        event.batteryState === Battery.BatteryState.CHARGING
          ? "Charging"
          : event.batteryState === Battery.BatteryState.FULL
            ? "Full"
            : "Not Charging",
      );
    });

    return () => {
      isMounted = false;
      levelSub?.remove();
      stateSub?.remove();
    };
  }, []);

  const value = useMemo(
    () => ({ batteryLevel, isCharging, isLoadingBattery }),
    [batteryLevel, isCharging, isLoadingBattery],
  );

  return (
    <BatteryContext.Provider value={value}>{children}</BatteryContext.Provider>
  );
};

export const useBattery = () => useContext(BatteryContext);
