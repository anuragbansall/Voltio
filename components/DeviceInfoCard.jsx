import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDevice } from "../context/DeviceContext";
import DeviceImage from "./DeviceImage";

function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (let key in intervals) {
    const interval = Math.floor(seconds / intervals[key]);
    if (interval > 0) {
      return `${interval} ${key}${interval > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
}

export default function DeviceInfoCard({ device }) {
  const { deviceId } = useDevice();

  const lastActiveDate = new Date(device.lastActive);

  return (
    <TouchableOpacity
      style={[
        style.card,
        device._id === deviceId && {
          borderColor: "#7ef0d57e",
          backgroundColor: "rgba(126,240,214,0.08)",
        },
      ]}
    >
      <View style={style.imageWrap}>
        <DeviceImage
          type={device.type.toLowerCase()}
          isCharging={true}
          size={76}
        />
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
          Last seen{" "}
          {isNaN(lastActiveDate.getTime())
            ? "unknown"
            : timeAgo(lastActiveDate)}
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
