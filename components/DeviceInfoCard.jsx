import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import DeviceImage from "./DeviceImage";
import { Ionicons } from "@expo/vector-icons";

export default function DeviceInfoCard({ device }) {
  return (
    <TouchableOpacity style={style.card}>
      <View style={style.imageWrap}>
        <DeviceImage type={device.type} isCharging={true} size={76} />
      </View>

      <View style={style.copy}>
        <View style={style.nameRow}>
          <Text style={style.name}>{device.name}</Text>
          <View style={style.batteryPill}>
            <Ionicons name="battery-half-outline" size={14} color="#7EF0D6" />
            <Text style={style.batteryLabel}>{device.batteryLevel}%</Text>
          </View>
        </View>

        {device.isCharging ? (
          <View style={style.chargingPill}>
            <Ionicons name="flash-outline" size={14} color="#071014" />
            <Text style={style.charging}>Charging</Text>
          </View>
        ) : (
          <Text style={style.idle}>On battery</Text>
        )}

        <Text style={style.lastSeen}>
          Last seen {" "}
          {new Date(parseInt(device.lastSeen)).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    backgroundColor: "rgba(17,20,26,0.92)",
    borderRadius: 24,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  imageWrap: {
    borderRadius: 20,
    overflow: "hidden",
  },
  copy: {
    flex: 1,
    gap: 8,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  name: {
    flex: 1,
    fontSize: 17,
    fontWeight: "800",
    color: "#F4F7FA",
  },
  batteryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(126,240,214,0.08)",
    borderWidth: 1,
    borderColor: "rgba(126,240,214,0.14)",
  },
  batteryLabel: {
    color: "#7EF0D6",
    fontSize: 12,
    fontWeight: "800",
  },
  chargingPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#7EF0D6",
  },
  charging: {
    fontSize: 12,
    color: "#071014",
    fontWeight: "800",
  },
  idle: {
    alignSelf: "flex-start",
    fontSize: 12,
    color: "#97A0AD",
    fontWeight: "700",
  },
  lastSeen: {
    fontSize: 13,
    color: "#85909D",
  },
});
