import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../context/AuthContext";
import { BatteryProvider } from "../context/BatteryContext";
import { DeviceProvider } from "../context/DeviceContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <DeviceProvider>
        <BatteryProvider>
          <StatusBar style="light" translucent />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#05070A" },
            }}
          />
        </BatteryProvider>
      </DeviceProvider>
    </AuthProvider>
  );
}
