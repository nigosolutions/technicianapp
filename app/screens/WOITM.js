import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { Dimensions, Image, ScrollView, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Dialog,
  Divider,
  Portal,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { getToken } from "../auth/auth";
import api from "../../axiosConfig";

function WOITM(props) {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const { wo_id } = props.route.params;
  const [pending_assets, setPendingAssets] = React.useState([]);
  const [completed_assets, setCompletedAssets] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [selectedimage, setSelectedImage] = React.useState("");
  const showDialog = (image) => (setVisible(true), setSelectedImage(image));
  const hideDialog = () => setVisible(false);

  const getPendingAssets = async () => {
    api
      .get(`/ITM?wo_id=${wo_id}`, {
        headers: { ignistoken: await getToken() },
      })
      .then(async (res) => {
        setLoading(false);
        console.log(res.data.message);
        setPendingAssets(res.data.message.passets);
        setCompletedAssets(res.data.message.cassets);
      })

      .catch((err) => {
        setLoading(false);
        console.log(err);
        if (err.response && err.response.data && err.response.data.message)
          alert(err.response.data.message);
        else alert("Server Error");
      });
  };

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      await getPendingAssets();
    })();
  }, [props.route]);

  const Tab = createMaterialTopTabNavigator();

  const Pending = () => {
    if (loading)
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      );
    else
      return !pending_assets.length ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No Pending Assets!</Text>
          <Button onPress={() => props.navigation.navigate("WOHome")}>
            Go Back to Work Orders
          </Button>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }}>
          {pending_assets.map((asset) => {
            return (
              <View key={asset.id}>
                <TouchableRipple
                  key={asset.id}
                  onLongPress={() => showDialog(asset.url)}
                  onPress={() => {
                    props.navigation.navigate("WOITMExec", {
                      wo_id: wo_id,
                      asset_id: asset.id,
                    });
                  }}
                  rippleColor="rgba(0, 0, 0, .32)"
                >
                  <View
                    style={{
                      flexDirection: "row",
                      padding: 10,
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{
                        height: "100%",
                        width: windowWidth / 3,
                      }}
                      resizeMode="contain"
                      source={
                        !asset.url
                          ? require("../assets/logo.png")
                          : { uri: asset.url }
                      }
                    />
                    <View
                      style={{ marginHorizontal: 20, flexDirection: "column" }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ flex: 1 }} variant="titleMedium">
                          {asset.name}
                        </Text>
                      </View>
                      <Text variant="bodyLarge">{"Tag: " + asset.tag}</Text>
                      {Object.keys(asset.general_info).map((key) => {
                        return (
                          <Text key={key} variant="bodyLarge">
                            {key + ": " + asset.general_info[key]}
                          </Text>
                        );
                      })}
                    </View>
                  </View>
                </TouchableRipple>
                <Divider />
              </View>
            );
          })}
        </ScrollView>
      );
  };
  const Completed = () => {
    if (loading)
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      );
    else
      return (
        <ScrollView style={{ flex: 1 }}>
          {completed_assets.map((asset) => {
            return (
              <View key={asset.id}>
                <TouchableRipple
                  onLongPress={() => showDialog(asset.url)}
                  onPress={() => {
                    props.navigation.navigate("WOITMView", {
                      wo_id: wo_id,
                      asset_id: asset.id,
                    });
                  }}
                  rippleColor="rgba(0, 0, 0, .32)"
                >
                  <View
                    style={{
                      flexDirection: "row",
                      padding: 10,
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{ marginHorizontal: 5, height: 75, width: 90 }}
                      resizeMode="contain"
                      source={
                        !asset.url
                          ? require("../assets/logo.png")
                          : { uri: asset.url }
                      }
                    />
                    <View style={{ marginHorizontal: 20 }}>
                      <Text variant="titleMedium">{asset.name}</Text>
                      <Text variant="bodyLarge">{"Tag: " + asset.tag}</Text>
                      {Object.keys(asset.general_info).map((key) => {
                        return (
                          <Text key={key} variant="bodyLarge">
                            {key + ": " + asset.general_info[key]}
                          </Text>
                        );
                      })}
                    </View>
                  </View>
                </TouchableRipple>
                <Divider />
              </View>
            );
          })}
        </ScrollView>
      );
  };
  return (
    <View style={{ flex: 1 }}>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Asset Image</Dialog.Title>
          <Dialog.Content>
            <Card.Cover
              style={{ height: 0.5 * windowHeight }}
              resizeMode="contain"
              source={
                !selectedimage
                  ? require("../assets/logo.png")
                  : { uri: selectedimage }
              }
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Tab.Navigator sceneContainerStyle={{ backgroundColor: "white" }}>
        <Tab.Screen name="Pending" component={Pending} />
        <Tab.Screen name="Completed" component={Completed} />
      </Tab.Navigator>
    </View>
  );
}

export default WOITM;
