import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../context/AuthContext";
import { BatteryProvider } from "../context/BatteryContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <BatteryProvider>
        <StatusBar style="light" translucent />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#05070A" },
          }}
        />
      </BatteryProvider>
    </AuthProvider>
  );
}
