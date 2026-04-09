import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Account center</Text>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>
          View your account details and keep your profile information in sync.
        </Text>
      </View>

      <View style={styles.card}>
        <ProfileRow
          icon="person-outline"
          title="Username"
          detail={user?.username || "Not available"}
        />
        <ProfileRow
          icon="mail-outline"
          title="Email"
          detail={user?.email || "Not available"}
        />
        <ProfileRow
          icon="finger-print-outline"
          title="User ID"
          detail={user?._id || "Not available"}
          last
        />
      </View>

      <Pressable style={styles.primaryButton}>
        <Ionicons name="create-outline" size={18} color="#071014" />
        <Text style={styles.primaryButtonText}>Edit profile</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function ProfileRow({ icon, title, detail, last = false }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <View style={styles.rowIconWrap}>
        <Ionicons name={icon} size={18} color="#7EF0D6" />
      </View>

      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDetail}>{detail}</Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#5E6774" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 20,
    paddingBottom: 110,
    backgroundColor: "#05070A",
    padding: 20,
  },
  hero: {
    gap: 6,
  },
  kicker: {
    color: "#7EF0D6",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.8,
    textTransform: "uppercase",
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
    maxWidth: 340,
  },
  card: {
    backgroundColor: "rgba(17,20,26,0.92)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(126,240,214,0.09)",
    borderWidth: 1,
    borderColor: "rgba(126,240,214,0.12)",
  },
  rowCopy: {
    flex: 1,
    gap: 3,
  },
  rowTitle: {
    color: "#F4F7FA",
    fontSize: 16,
    fontWeight: "700",
  },
  rowDetail: {
    color: "#98A1AE",
    fontSize: 13,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#B9F9E8",
    borderRadius: 18,
    paddingVertical: 14,
    marginBottom: 12,
    shadowColor: "#7EF0D6",
    shadowOpacity: 0.24,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  primaryButtonText: {
    color: "#071014",
    fontSize: 15,
    fontWeight: "800",
  },
});
