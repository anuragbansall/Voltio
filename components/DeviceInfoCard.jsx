import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import DeviceImage from "./DeviceImage";

export default function DeviceInfoCard({ device }) {
  return (
    <TouchableOpacity style={style.card}>
      <DeviceImage type={device.type} isCharging={true} size={80} />

      <View>
        <Text style={style.name}>{device.name}</Text>
        {device.isCharging && <Text style={style.charging}>Charging</Text>}
        <Text style={style.lastSeen}>
          Last seen:{" "}
          {new Date(parseInt(device.lastSeen)).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
      </View>

      <View style={style.batteryContainer}>
        <Text style={style.batteryLevel}>{device.batteryLevel}%</Text>
      </View>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    backgroundColor: "#1E1F23",
    borderRadius: 8,
    marginTop: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
  },
  charging: {
    fontSize: 16,
    color: "#dadada",
  },
  lastSeen: {
    fontSize: 14,
    color: "#888",
  },
  batteryContainer: {
    marginTop: 8,
    backgroundColor: "#242528",
    padding: 8,
    borderRadius: 4,
  },
  batteryLevel: {
    fontSize: 14,
    color: "#fff",
  },
});
