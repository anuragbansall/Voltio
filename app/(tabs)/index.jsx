import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import AuthGate from "../../components/AuthGate.jsx";
import DeviceInfoCard from "../../components/DeviceInfoCard";
import { useAuth } from "../../context/AuthContext.jsx";
import { useBattery } from "../../context/BatteryContext";
import { connectSocket, getSocket } from "../../services/socket.js";
import { api } from "../../utils/api.js";

export default function Index() {
  const { isLoadingBattery } = useBattery();
  const { user, token, logout, isLoading } = useAuth();

  const [deviceList, setDeviceList] = useState([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);
  const [error, setError] = useState(null);

  const fetchDevices = async () => {
    setIsLoadingDevices(true);
    try {
      const response = await api.get("/devices");
      setDeviceList(response.data);
    } catch (error) {
      console.error("Error fetching devices:", error?.message || error);
      setError("Failed to load devices. Please try again.");
    } finally {
      setIsLoadingDevices(false);
    }
  };

  useEffect(() => {
    if (isLoading || !user || !token) {
      setDeviceList([]);
      setError(null);
      setIsLoadingDevices(false);
      return;
    }

    fetchDevices();
  }, [isLoading, token, user]);

  // {"__v": 0, "_id": "69d81f7437f8bed13faa5810", "batteryLevel": 51, "isCharging": false, "lastActive": "2026-04-09T22:31:30.701Z", "name": "Anurag lal", "type": "laptop", "userId": "69d6d0af84f351c7fae785f4"}

  // 🔌 Setup socket + listeners
  useEffect(() => {
    if (isLoading || !user || !token) {
      return undefined;
    }

    let isMounted = true;
    let socket;

    const setupSocket = async () => {
      socket = (await connectSocket()) || getSocket();

      console.log("Socket connection established:", socket?.connected);

      if (!isMounted) {
        console.error(
          "Component unmounted before socket connection was established",
        );
        return;
      }

      if (!socket) {
        console.error("Failed to establish socket connection");
        return;
      }

      socket.on("device-update", (data) => {
        console.log("--- Device update received:", data);
        console.log("--- Current device list:", deviceList);

        setDeviceList((prevList) =>
          prevList.map((device) =>
            device._id === data.deviceId ? { ...device, ...data } : device,
          ),
        );
      });
    };

    setupSocket();

    return () => {
      isMounted = false;
      socket?.off("device-update");
    };
  }, [isLoading, token, user, deviceList]);

  // 📊 Derived stats
  const onlineDevices = deviceList?.length;
  const chargingDevices = deviceList?.filter((d) => d.isCharging).length;

  if (isLoading || isLoadingBattery || isLoadingDevices) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <AuthGate>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.kicker}>Connected fleet</Text>
          <Text style={styles.title}>My Devices</Text>
          <Text style={styles.subtitle}>
            Real-time power status and health at a glance.
          </Text>
        </View>

        <Pressable style={styles.actionButton} onPress={fetchDevices}>
          <Ionicons name="sparkles-outline" size={18} color="#071014" />
          <Text style={styles.actionButtonText}>Refresh</Text>
        </Pressable>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{onlineDevices}</Text>
          <Text style={styles.statLabel}>Devices online</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{chargingDevices}</Text>
          <Text style={styles.statLabel}>Charging now</Text>
        </View>
      </View>

      {/* Device List */}
      <FlatList
        data={deviceList}
        renderItem={({ item }) => <DeviceInfoCard device={item} />}
        keyExtractor={(item, index) =>
          item?._id || item?.id || `${item?.name || "device"}-${index}`
        }
        style={styles.devicesList}
        contentContainerStyle={styles.devicesListContent}
        showsVerticalScrollIndicator={false}
      />
    </AuthGate>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#11141A",
  },
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
    marginTop: 10,
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
