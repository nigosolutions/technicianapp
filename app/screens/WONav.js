import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WOHome from "./WOHome";
import WODetails from "./WODetails";
import WOITM from "./WOITM";
import WOITMExec from "./WOITMExec";
import Messages from "./Messages";
import { HeaderBackButton } from "@react-navigation/elements";
import WOITMView from "./WOITMView";
import AssetTagging from "./AssetTagging";
import AssetTaggingExec from "./AssetTaggingExec";
import AssetTaggingView from "./AssetTaggingView";
const WONav = createNativeStackNavigator();

function WorkOrder(props) {
  return (
    <WONav.Navigator>
      <WONav.Screen
        name="WOHome"
        component={WOHome}
        options={{
          title: "Work Orders",
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <WONav.Screen
        name="WODetails"
        component={WODetails}
        options={{
          title: "Details",
          gestureEnabled: false,
          headerLeft: () => (
            <HeaderBackButton
              label="Work Orders"
              onPress={() => props.navigation.navigate("WOHome")}
            />
          ),
        }}
      />
      <WONav.Screen
        name="WOITM"
        component={WOITM}
        options={{
          title: "Devices",
          gestureEnabled: false,
        }}
      />
      <WONav.Screen
        name="WOITMExec"
        component={WOITMExec}
        options={{
          title: "Execute",
          gestureEnabled: false,
        }}
      />
      <WONav.Screen
        name="WOITMView"
        component={WOITMView}
        options={{
          title: "View ITM",
          gestureEnabled: false,
        }}
      />
      <WONav.Screen
        name="Messages"
        component={Messages}
        options={{
          title: "Messages",
          gestureEnabled: false,
        }}
      />
      <WONav.Screen
        name="AssetTagging"
        component={AssetTagging}
        options={{
          title: "Asset Tagging",
          gestureEnabled: false,
        }}
      />
      <WONav.Screen
        name="AssetTaggingExec"
        component={AssetTaggingExec}
        options={{
          title: "Add Asset",
          gestureEnabled: false,
        }}
      />
      <WONav.Screen
        name="AssetTaggingView"
        component={AssetTaggingView}
        options={{
          title: "View Asset",
          gestureEnabled: false,
        }}
      />
    </WONav.Navigator>
  );
}

export default WorkOrder;
