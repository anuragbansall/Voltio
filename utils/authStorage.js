import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

const listeners = new Set();
let authState = {
  token: null,
  user: null,
};

const notifyAuthListeners = () => {
  listeners.forEach((listener) => {
    listener(authState);
  });
};

export const subscribeAuth = (listener) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const saveAuth = async (token, user) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

    authState = { token, user };
    notifyAuthListeners();
  } catch (e) {
    console.error("Error saving auth:", e);
  }
};

export const loadAuth = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    const user = await AsyncStorage.getItem(USER_KEY);

    authState = {
      token,
      user: user ? JSON.parse(user) : null,
    };

    notifyAuthListeners();

    return authState;
  } catch (e) {
    console.error("Error loading auth:", e);
    return { token: null, user: null };
  }
};

export const clearAuth = async () => {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);

  authState = {
    token: null,
    user: null,
  };
  notifyAuthListeners();
};
