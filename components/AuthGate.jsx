import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const emptyForm = {
  username: "",
  email: "",
  password: "",
};

export default function AuthGate({ children }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(emptyForm);
  const [statusMessage, setStatusMessage] = useState(
    "Sign in or create an account to continue.",
  );

  const isAuthenticated = true; // TODO: Replace with real authentication logic

  const updateField = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
  };

  const handleSubmit = () => {
    const username = form.username.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (mode === "register" && (!username || !email || !password)) {
      setStatusMessage("Enter a username, email, and password.");
      return;
    }

    if (mode === "login" && (!email || !password)) {
      setStatusMessage("Enter your email and password.");
      return;
    }

    if (mode === "register") {
      //TODO: In a real app, you'd make a request to your backend here.
    }

    if (mode === "login") {
      // TODO: In a real app, you'd make a request to your backend here.
    }

    setStatusMessage(
      mode === "register"
        ? "Account created! You can now log in."
        : "Logged in successfully!",
    );
    resetForm();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.backgroundGlow} />
      <View style={styles.backgroundGlowSecondary} />
      <View style={styles.shell}>
        {!isAuthenticated ? (
          <View style={styles.card}>
            <View style={styles.heroRow}>
              <View style={styles.heroBadge}>
                <Ionicons name="flash-outline" size={20} color="#071014" />
              </View>

              <View style={styles.heroCopy}>
                <Text style={styles.kicker}>Voltio access</Text>
                <Text style={styles.title}>
                  {mode === "register" ? "Create account" : "Welcome back"}
                </Text>
                <Text style={styles.heroSubtitle}>
                  A clean, secure dashboard for tracking your devices.
                </Text>
              </View>

              <View style={styles.segmentedControl}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setMode("login")}
                  style={[
                    styles.segment,
                    mode === "login" && styles.segmentActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.segmentLabel,
                      mode === "login" && styles.segmentLabelActive,
                    ]}
                  >
                    Login
                  </Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => setMode("register")}
                  style={[
                    styles.segment,
                    mode === "register" && styles.segmentActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.segmentLabel,
                      mode === "register" && styles.segmentLabelActive,
                    ]}
                  >
                    Register
                  </Text>
                </Pressable>
              </View>
            </View>

            <Text style={styles.description}>{statusMessage}</Text>

            <View style={styles.form}>
              {mode === "register" ? (
                <TextInput
                  autoCapitalize="none"
                  placeholder="Username"
                  placeholderTextColor="#6E737C"
                  style={styles.input}
                  value={form.username}
                  onChangeText={(value) => updateField("username", value)}
                />
              ) : null}

              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                placeholder="Email"
                placeholderTextColor="#6E737C"
                style={styles.input}
                value={form.email}
                onChangeText={(value) => updateField("email", value)}
              />

              <TextInput
                autoCapitalize="none"
                autoComplete="password"
                placeholder="Password"
                placeholderTextColor="#6E737C"
                secureTextEntry
                style={styles.input}
                value={form.password}
                onChangeText={(value) => updateField("password", value)}
              />

              <Pressable onPress={handleSubmit} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>
                  {mode === "register" ? "Create account" : "Log in"}
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.content}>{children}</View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#05070A",
  },
  shell: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: "rgba(14,17,22,0.92)",
    borderColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderRadius: 28,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 18 },
    elevation: 10,
  },
  heroRow: {
    gap: 18,
    marginBottom: 16,
  },
  heroBadge: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7EF0D6",
  },
  heroCopy: {
    gap: 8,
  },
  kicker: {
    color: "#7EF0D6",
    fontSize: 12,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  title: {
    color: "#F4F6F8",
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "800",
  },
  heroSubtitle: {
    color: "#97A0AD",
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 320,
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 18,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 14,
  },
  segmentActive: {
    backgroundColor: "#7EF0D6",
  },
  segmentLabel: {
    color: "#97A0AD",
    fontSize: 14,
    fontWeight: "700",
  },
  segmentLabelActive: {
    color: "#071014",
  },
  description: {
    color: "#A6AFBC",
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 10,
  },
  form: {
    gap: 12,
    marginTop: 6,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderRadius: 18,
    color: "#F4F6F8",
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: "#B9F9E8",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    marginTop: 4,
    shadowColor: "#7EF0D6",
    shadowOpacity: 0.24,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  primaryButtonText: {
    color: "#071014",
    fontSize: 16,
    fontWeight: "800",
  },
  content: {
    marginTop: 20,
    flex: 1,
    width: "100%",
    paddingBottom: 110,
  },
  backgroundGlow: {
    position: "absolute",
    top: -80,
    right: -70,
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: "rgba(126,240,214,0.15)",
  },
  backgroundGlowSecondary: {
    position: "absolute",
    bottom: -90,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: "rgba(82,132,255,0.12)",
  },
});
