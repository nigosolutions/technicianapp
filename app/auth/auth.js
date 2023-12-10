import AsyncStorage from "@react-native-async-storage/async-storage";

module.exports = {
  getUser: async function () {
    try {
      const user = await AsyncStorage.getItem("ignis-user");
      if (!user || user === "undefined") return null;
      else return JSON.parse(user);
    } catch (e) {
      // save error
      console.log(e);
    }
  },

  setBiometrics: async function ({ client_id, username, password }) {
    try {
      await AsyncStorage.setItem("local-client", client_id);
      await AsyncStorage.setItem("local-username", username);
      await AsyncStorage.setItem("local-password", password);
      await AsyncStorage.setItem("local-status", "true");
    } catch (e) {
      // save error
      alert(e);
      console.log(e);
    }
  },

  getBiometrics: async function () {
    const client_id = await AsyncStorage.getItem("local-client");
    const username = await AsyncStorage.getItem("local-username");
    const password = await AsyncStorage.getItem("local-password");
    if (
      !client_id ||
      client_id === "undefined" ||
      !username ||
      username === "undefined" ||
      !password
    )
      return null;
    else return { client_id, username, password };
  },

  getRegisteredUser: async function () {
    const client_id = await AsyncStorage.getItem("local-client");
    const username = await AsyncStorage.getItem("local-username");

    if (
      !client_id ||
      client_id === "undefined" ||
      !username ||
      username === "undefined"
    )
      return null;
    else return { client_id, username };
  },
  getBiometricStatus: async function () {
    const status = await AsyncStorage.getItem("local-status");
    if (status === "true") return true;
    else return false;
  },

  resetBiometrics: function () {
    AsyncStorage.removeItem("local-status");
    AsyncStorage.removeItem("local-client");
    AsyncStorage.removeItem("local-username");
    AsyncStorage.removeItem("local-password");
  },
  getToken: async function () {
    const token = await AsyncStorage.getItem("ignis-token");
    if (!token || token === "undefined") return null;
    else return token;
  },

  setUserSession: async function ({ user, token }) {
    try {
      await AsyncStorage.setItem("ignis-user", JSON.stringify(user));
      await AsyncStorage.setItem("ignis-token", token);
    } catch (e) {
      // save error
      alert(e);
      console.log(e);
    }
  },

  resetUserSession: function () {
    AsyncStorage.removeItem("ignis-user");
    AsyncStorage.removeItem("ignis-token");
  },
};
