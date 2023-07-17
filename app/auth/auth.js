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
