import * as Battery from "expo-battery";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const BatteryContext = createContext();

export const BatteryProvider = ({ children }) => {
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const [isLoadingBattery, setIsLoadingBattery] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initBatteryState = async () => {
      try {
        const state = await Battery.getPowerStateAsync();
        if (!isMounted) {
          return;
        }

        setBatteryLevel(Math.round(state.batteryLevel * 100));
        setIsCharging(state.batteryState === Battery.BatteryState.CHARGING);
      } finally {
        if (isMounted) {
          setIsLoadingBattery(false);
        }
      }
    };

    initBatteryState();

    const levelSub = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      setBatteryLevel(Math.round(batteryLevel * 100));
    });

    const stateSub = Battery.addBatteryStateListener(({ batteryState }) => {
      setIsCharging(batteryState === Battery.BatteryState.CHARGING);
    });

    return () => {
      isMounted = false;
      levelSub.remove();
      stateSub.remove();
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
