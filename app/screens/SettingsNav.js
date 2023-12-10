import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Settings from "./Settings";
import ChangePassword from "./ChangePassword";
const SNav = createNativeStackNavigator();
function SettingsNav(props) {
  return (
    <SNav.Navigator>
      <SNav.Screen
        name="SettingsHome"
        component={Settings}
        options={{
          title: "Settings",
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <SNav.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          title: "Change Password",
          gestureEnabled: false,
        }}
      />
    </SNav.Navigator>
  );
}

export default SettingsNav;
