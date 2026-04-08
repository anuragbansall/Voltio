import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0A0D11",
          borderTopColor: "rgba(255,255,255,0.08)",
          borderTopWidth: 1,
          paddingTop: 10,
          paddingBottom: 10,
          paddingHorizontal: 12,
          position: "absolute",
          elevation: 0,
        },
        tabBarActiveTintColor: "#7EF0D6",
        tabBarInactiveTintColor: "#6E7681",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
        tabBarBackground: () => null,
        tabBarItemStyle: {
          borderRadius: 16,
          marginHorizontal: 4,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Devices",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="laptop-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
