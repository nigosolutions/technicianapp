import * as React from "react";
import { BottomNavigation, Text } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AssetTagging from "./app/screens/AssetTagging";
import Dashboard from "./app/screens/Dashboard";
import Login from "./app/screens/Login";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";

const MainNav = createNativeStackNavigator();

const DashboardRoute = () => <Dashboard />;

const WorkOrdersRoute = () => <AssetTagging />;

const SupportRoute = () => <Text>Recents</Text>;

const SettingsRoute = () => <Text>Notifications</Text>;

const MyComponent = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "dashboard",
      title: "Dashboard",
      focusedIcon: "view-dashboard",
      unfocusedIcon: "view-dashboard-outline",
    },
    {
      key: "workorders",
      title: "Work Orders",
      focusedIcon: "tools",
    },

    {
      key: "support",
      title: "Support",
      focusedIcon: "chat-question",
      unfocusedIcon: "chat-question-outline",
    },
    {
      key: "settings",
      title: "Settings",
      focusedIcon: "cog",
      unfocusedIcon: "cog-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    dashboard: DashboardRoute,
    workorders: WorkOrdersRoute,
    support: SupportRoute,
    settings: SettingsRoute,
  });

  return (
    <SafeAreaProvider>
      <StatusBar />
      <NavigationContainer>
        <MainNav.Navigator>
          <MainNav.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <MainNav.Screen name={"Tab"} options={{ headerShown: false }}>
            {() => (
              <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
              />
            )}
          </MainNav.Screen>
        </MainNav.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default MyComponent;
