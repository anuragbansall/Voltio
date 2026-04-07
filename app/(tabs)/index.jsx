import { FlatList, StyleSheet, Text } from "react-native";

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

export default function index() {
  return (
    <AuthGate>
      <Text style={styles.title}>My Devices</Text>

      <FlatList
        data={devices}
        renderItem={({ item }) => <DeviceInfoCard device={item} />}
        keyExtractor={(item) => item.name}
        style={styles.devicesList}
      />
    </AuthGate>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "500",
    marginBottom: 4,
  },
  devicesList: {
    marginTop: 24,
  },
});
