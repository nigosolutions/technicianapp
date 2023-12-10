import * as React from "react";
import { Provider, Text } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Dashboard from "./app/screens/Dashboard";
import Login from "./app/screens/Login";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WorkOrder from "./app/screens/WONav";
import Schedule from "./app/screens/Schedule";
import Ionicons from "react-native-vector-icons/Ionicons";
import SettingsNav from "./app/screens/SettingsNav";
import ChangePassword from "./app/screens/ChangePassword";
import { enGB, registerTranslation } from "react-native-paper-dates";
import SelectComponent from "./app/components/SelectComponent";
registerTranslation("en", enGB);

const MainNav = createNativeStackNavigator();

const MyComponent = () => {
  const Tab = createBottomTabNavigator();
  function MyTab() {
    return (
      <Tab.Navigator
        id="MyTab"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Dashboard") {
              iconName = focused ? "grid" : "grid-outline";
            } else if (route.name === "Work Orders") {
              iconName = focused ? "briefcase" : "briefcase-outline";
            } else if (route.name === "Schedule") {
              iconName = focused ? "calendar" : "calendar-outline";
            } else if (route.name === "Requests") {
              iconName = focused ? "mail-open" : "mail-open-outline";
            } else if (route.name === "Settings") {
              iconName = focused ? "settings" : "settings-outline";
            }
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <Ionicons name={iconName} size={size} color={color} />
                <Text
                  style={{
                    width: "100%",
                    margin: 3,
                    color: color,
                  }}
                  variant="bodySmall"
                >
                  {route.name}
                </Text>
              </View>
            );
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            borderRadius: 15,
            margin: 10,
            marginTop: 5,
            padding: 20,
            height: 85,
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={SelectComponent} />
        <Tab.Screen name="Work Orders" component={WorkOrder} />
        <Tab.Screen name="Schedule" component={Schedule} />
        <Tab.Screen name="Settings" component={SettingsNav} />
      </Tab.Navigator>
    );
  }

  return (
    <Provider>
      <StatusBar />
      <NavigationContainer>
        <MainNav.Navigator>
          <MainNav.Screen
            name="Tab"
            component={MyTab}
            options={{ headerShown: false }}
          />
          <MainNav.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <MainNav.Screen
            name="FirstLogin"
            component={ChangePassword}
            options={{
              headerBackVisible: false,
              headerTitle: "First Login Change Password",
            }}
          />
        </MainNav.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default MyComponent;
