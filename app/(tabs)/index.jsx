import { Ionicons } from "@expo/vector-icons";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import * as Battery from "expo-battery";
import { useEffect, useState } from "react";
import AuthGate from "../../components/AuthGate.jsx";
import DeviceInfoCard from "../../components/DeviceInfoCard";

const devices = [
  {
    type: "laptop",
    name: "Macbook Pro",
    isCharging: true,
    lastSeen: "1775599085641",
    batteryLevel: 50,
  },
  {
    type: "phone",
    name: "IPhone 15 Pro",
    isCharging: true,
    lastSeen: "1775599085641",
    batteryLevel: 80,
  },
  {
    type: "tablet",
    name: "Samsung Tab",
    isCharging: false,
    lastSeen: "1775599085641",
    batteryLevel: 20,
  },
];

const getBattery = async () => {
  const level = await Battery.getBatteryLevelAsync();
  const state = await Battery.getBatteryStateAsync();

  return {
    battery: Math.round(level * 100),
    isCharging: state === Battery.BatteryState.CHARGING,
  };
};

export default function index() {
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    const init = async () => {
      const state = await Battery.getPowerStateAsync();

      setBatteryLevel(Math.round(state.batteryLevel * 100));
      setIsCharging(state.batteryState === Battery.BatteryState.CHARGING);
    };

    init();

    // battery level listener
    const levelSub = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      setBatteryLevel(Math.round(batteryLevel * 100));
    });

    // charging listener
    const stateSub = Battery.addBatteryStateListener(({ batteryState }) => {
      setIsCharging(batteryState === Battery.BatteryState.CHARGING);
    });

    return () => {
      levelSub.remove();
      stateSub.remove();
    };
  }, []);

  return (
    <AuthGate>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.kicker}>Connected fleet</Text>
          <Text style={styles.title}>My Devices</Text>
          <Text style={styles.subtitle}>
            Real-time power status and health at a glance.
          </Text>
        </View>

        <Pressable style={styles.actionButton}>
          <Ionicons name="sparkles-outline" size={18} color="#071014" />
          <Text style={styles.actionButtonText}>Refresh</Text>
        </Pressable>
      </View>

      <Text style={styles.subtitle}>
        Current Battery Level: {batteryLevel}% Is Charging:{" "}
        {isCharging ? "Yes" : "No"}
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Devices online</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>2</Text>
          <Text style={styles.statLabel}>Charging now</Text>
        </View>
      </View>

      <FlatList
        data={devices}
        renderItem={({ item }) => <DeviceInfoCard device={item} />}
        keyExtractor={(item) => item.name}
        style={styles.devicesList}
        contentContainerStyle={styles.devicesListContent}
        showsVerticalScrollIndicator={false}
      />
    </AuthGate>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  headerCopy: {
    flex: 1,
    gap: 6,
  },
  kicker: {
    color: "#7EF0D6",
    fontSize: 12,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  title: {
    fontSize: 32,
    lineHeight: 36,
    color: "#F4F7FA",
    fontWeight: "800",
  },
  subtitle: {
    color: "#98A1AE",
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 320,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#B9F9E8",
    shadowColor: "#7EF0D6",
    shadowOpacity: 0.24,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  actionButtonText: {
    color: "#071014",
    fontSize: 13,
    fontWeight: "800",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    backgroundColor: "rgba(17,20,26,0.92)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  statValue: {
    color: "#F4F7FA",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 2,
  },
  statLabel: {
    color: "#98A1AE",
    fontSize: 13,
  },
  devicesList: {
    marginTop: 18,
  },
  devicesListContent: {
    paddingBottom: 120,
  },
});
