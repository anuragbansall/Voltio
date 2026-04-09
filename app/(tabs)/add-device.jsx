import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import AuthGate from "../../components/AuthGate";
import DeviceImage from "../../components/DeviceImage";
import { useBattery } from "../../context/BatteryContext";
import { useDevice } from "../../context/DeviceContext";
import { api } from "../../utils/api";

const emptyForm = {
  name: "",
  type: "",
};

const formatLastSeen = (rawDate) => {
  if (!rawDate) return "Just now";

  const parsed = Number.isFinite(Number(rawDate))
    ? new Date(Number(rawDate))
    : new Date(rawDate);

  if (Number.isNaN(parsed.getTime())) return "Just now";

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function AddDevice() {
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { batteryLevel, isCharging, isLoadingBattery } = useBattery();
  const {
    device,
    deviceId,
    hasDevice,
    isLoadingDevice,
    setCurrentDevice,
    refreshDevice,
    clearDevice,
  } = useDevice();

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleAddDevice = async () => {
    if (isSubmitting) return;

    const name = form.name.trim();
    const type = form.type.trim();

    if (!name || !type) {
      setError("Please enter both name and type.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = {
      name,
      type,
      batteryLevel: isLoadingBattery ? null : batteryLevel,
      isCharging: isLoadingBattery ? null : isCharging,
    };

    try {
      const response = await api.post("/devices", payload);
      await setCurrentDevice(response?.data);
      setForm(emptyForm);
    } catch (requestError) {
      console.error("Error adding device:", requestError);
      setError(
        requestError?.response?.data?.message ||
          requestError.message ||
          "An unexpected error occurred.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefreshDevice = async () => {
    setError(null);
    const refreshed = await refreshDevice();

    if (!refreshed) {
      setError("Unable to refresh your device right now.");
    }
  };

  const handleForgetDevice = async () => {
    setError(null);

    try {
      if (deviceId) {
        await api.delete(`/devices/${deviceId}`);
      }
      await clearDevice();
    } catch (requestError) {
      console.error("Error deleting device:", requestError);
      setError(
        requestError?.response?.data?.message ||
          requestError.message ||
          "Failed to delete device from server.",
      );
    }
  };

  const renderViewDevice = () => (
    <View style={styles.card}>
      <View style={styles.deviceHeader}>
        <View style={styles.imageWrap}>
          <DeviceImage
            type={device?.type || "laptop"}
            isCharging={Boolean(device?.isCharging)}
            size={72}
          />
        </View>

        <View style={styles.deviceCopy}>
          <Text style={styles.deviceName}>
            {device?.name || "Saved Device"}
          </Text>
          <Text style={styles.deviceType}>
            {device?.type || "Unknown type"}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaPill}>
          <Ionicons name="id-card-outline" size={14} color="#7EF0D6" />
          <Text style={styles.metaText}>{deviceId}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaPill}>
          <Ionicons name="battery-half-outline" size={14} color="#7EF0D6" />
          <Text style={styles.metaText}>
            {typeof device?.batteryLevel === "number"
              ? `${device.batteryLevel}%`
              : "Battery unknown"}
          </Text>
        </View>

        <View style={styles.metaPill}>
          <Ionicons
            name={device?.isCharging ? "flash-outline" : "flash-off-outline"}
            size={14}
            color="#7EF0D6"
          />
          <Text style={styles.metaText}>
            {device?.isCharging ? "Charging" : "On battery"}
          </Text>
        </View>
      </View>

      <Text style={styles.lastSeen}>
        Last seen{" "}
        {formatLastSeen(
          device?.lastSeen || device?.updatedAt || device?.createdAt,
        )}
      </Text>

      <View style={styles.actionsRow}>
        <Pressable style={styles.secondaryButton} onPress={handleRefreshDevice}>
          <Ionicons name="refresh-outline" size={16} color="#F4F7FA" />
          <Text style={styles.secondaryButtonText}>Refresh</Text>
        </Pressable>

        <Pressable style={styles.ghostButton} onPress={handleForgetDevice}>
          <Ionicons name="trash-outline" size={16} color="#FF8D8D" />
          <Text style={styles.ghostButtonText}>Forget</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <AuthGate>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.screen}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Text style={styles.kicker}>Device setup</Text>
            <Text style={styles.title}>
              {hasDevice ? "View Device" : "Add Device"}
            </Text>
            <Text style={styles.subtitle}>
              {hasDevice
                ? "A device is already linked on this phone."
                : "Create a device and save it locally for automatic restore."}
            </Text>
          </View>

          {isLoadingDevice ? (
            <View style={styles.card}>
              <ActivityIndicator color="#7EF0D6" />
              <Text style={styles.subtitle}>Checking saved device...</Text>
            </View>
          ) : hasDevice ? (
            renderViewDevice()
          ) : (
            <View style={styles.card}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  value={form.name}
                  onChangeText={(value) => updateField("name", value)}
                  placeholder="Device name"
                  placeholderTextColor="#6E7681"
                  style={styles.input}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Type</Text>
                <TextInput
                  value={form.type}
                  onChangeText={(value) => updateField("type", value)}
                  placeholder="Laptop, phone, tablet..."
                  placeholderTextColor="#6E7681"
                  style={styles.input}
                />
              </View>

              <Pressable
                style={[
                  styles.primaryButton,
                  isSubmitting && styles.primaryButtonDisabled,
                ]}
                onPress={handleAddDevice}
                disabled={isSubmitting}
              >
                <Ionicons name="add-circle-outline" size={18} color="#071014" />
                <Text style={styles.primaryButtonText}>
                  {isSubmitting ? "Adding..." : "Add Device"}
                </Text>
              </Pressable>
            </View>
          )}

          {!!error && <Text style={styles.error}>{error}</Text>}
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthGate>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingBottom: 120,
    gap: 20,
  },
  hero: {
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
    color: "#F4F7FA",
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "800",
  },
  subtitle: {
    color: "#98A1AE",
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 360,
  },
  card: {
    gap: 14,
    borderRadius: 24,
    padding: 16,
    backgroundColor: "rgba(17,20,26,0.92)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: "#F4F7FA",
    fontSize: 14,
    fontWeight: "700",
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#0D1218",
    color: "#F4F7FA",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  primaryButton: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#B9F9E8",
    borderRadius: 18,
    paddingVertical: 14,
    shadowColor: "#7EF0D6",
    shadowOpacity: 0.24,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: "#071014",
    fontSize: 15,
    fontWeight: "800",
  },
  error: {
    color: "#FF8D8D",
    fontSize: 13,
    fontWeight: "700",
  },
  deviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  imageWrap: {
    borderRadius: 18,
    overflow: "hidden",
  },
  deviceCopy: {
    flex: 1,
    gap: 4,
  },
  deviceName: {
    color: "#F4F7FA",
    fontSize: 18,
    fontWeight: "800",
  },
  deviceType: {
    color: "#98A1AE",
    fontSize: 13,
    textTransform: "capitalize",
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(126,240,214,0.08)",
    borderWidth: 1,
    borderColor: "rgba(126,240,214,0.14)",
  },
  metaText: {
    color: "#BCEFE1",
    fontSize: 12,
    fontWeight: "700",
  },
  lastSeen: {
    color: "#85909D",
    fontSize: 13,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 12,
    backgroundColor: "#1A2028",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  secondaryButtonText: {
    color: "#F4F7FA",
    fontSize: 13,
    fontWeight: "700",
  },
  ghostButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(255,141,141,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,141,141,0.2)",
  },
  ghostButtonText: {
    color: "#FF8D8D",
    fontSize: 13,
    fontWeight: "700",
  },
});
