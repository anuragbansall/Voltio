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
      <View style={styles.shell}>
        {!isAuthenticated ? (
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.kicker}>Voltio access</Text>
                <Text style={styles.title}>
                  {mode === "register" ? "Create account" : "Welcome back"}
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
    backgroundColor: "#0F1012",
  },
  shell: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: "#1A1B1F",
    borderColor: "#2A2C31",
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
  },
  headerRow: {
    gap: 16,
  },
  kicker: {
    color: "#7E848D",
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    color: "#F4F6F8",
    fontSize: 28,
    fontWeight: "700",
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#111215",
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: "#26282D",
  },
  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
  segmentActive: {
    backgroundColor: "#2B605B",
  },
  segmentLabel: {
    color: "#8A9098",
    fontSize: 14,
    fontWeight: "600",
  },
  segmentLabelActive: {
    color: "#F5FBFA",
  },
  description: {
    color: "#A2A8B0",
    fontSize: 15,
    lineHeight: 21,
  },
  form: {
    gap: 12,
    marginTop: 6,
  },
  input: {
    backgroundColor: "#111215",
    borderColor: "#2A2C31",
    borderWidth: 1,
    borderRadius: 14,
    color: "#F4F6F8",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: "#F4F6F8",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginTop: 4,
  },
  primaryButtonText: {
    color: "#0F1012",
    fontSize: 16,
    fontWeight: "700",
  },
  content: {
    marginTop: 20,
    flex: 1,
    width: "100%",
  },
});
