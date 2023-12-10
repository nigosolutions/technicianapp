import React from "react";
import { View } from "react-native";
import {
  Appbar,
  Avatar,
  Button,
  Dialog,
  Divider,
  List,
  Modal,
  PaperProvider,
  Portal,
  Switch,
  Text,
  TextInput,
} from "react-native-paper";
import api from "../../axiosConfig";
import {
  getBiometricStatus,
  resetBiometrics,
  setBiometrics,
  getUser,
  resetUserSession,
} from "../auth/auth";

import * as LocalAuthentication from "expo-local-authentication";

function Settings(props) {
  const [user, setUser] = React.useState({});
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [bloading, setBLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const onSubmit = (data) => {
    setBLoading(true);
    api
      .post("/techauth/login", {
        userInfo: data,
      })
      .then(async (res) => {
        setBLoading(false);
        console.log(res);
        if (res.status === 200) {
          setBiometrics(data);
          setBiometricStatus(!biometricStatus);
          setVisible(false);
          setPassword("");
        }
      })
      .catch((err) => {
        setBLoading(false);
        console.log(err);
        if (err.response && err.response.data && err.response.data.message)
          alert(err.response.data.message);
        else alert("Server Error");
      });
  };
  const [biometricStatus, setBiometricStatus] = React.useState(false);
  const onToggleSwitch = async () => {
    if (!biometricStatus) {
      let status = await LocalAuthentication.hasHardwareAsync();
      if (status === true) {
        setVisible(true);
      } else {
        alert("Your device does not support Biometric Authentication!");
      }
    } else {
      await resetBiometrics();
      setBiometricStatus(!biometricStatus);
    }
  };
  React.useEffect(() => {
    (async () => {
      setLoading(true);
      setUser(await getUser());
      let status = await getBiometricStatus();
      status === biometricStatus ? null : setBiometricStatus(!biometricStatus);
    })();
  }, []);
  return (
    <PaperProvider>
      <Appbar.Header style={{ elevation: 2, backgroundColor: "white" }}>
        <Appbar.Content title={"Settings"} />
      </Appbar.Header>
      <View style={{ marginTop: 2, backgroundColor: "white", flex: 1 }}>
        <Portal>
          <Dialog visible={visible} onDismiss={() => setVisible(false)}>
            <Dialog.Title>Enable Biometrics</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                Enter Password to enable Biometrics
              </Text>
              <TextInput
                secureTextEntry={true}
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                loading={bloading}
                onPress={() =>
                  onSubmit({
                    client_id: user.client_id,
                    username: user.username,
                    password: password,
                  })
                }
              >
                Enable
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <View style={{ flexDirection: "row", padding: 5, marginVertical: 15 }}>
          <Avatar.Icon style={{ margin: 10 }} icon="account" />
          <View style={{ margin: 10 }}>
            <Text variant="titleLarge">{user.name}</Text>
            <Text>{"Username: " + user.username}</Text>
            <Text>{"Organization: " + user.client_id}</Text>
          </View>
        </View>

        <List.Item
          title="Biometric Authentication"
          left={(props) => <List.Icon {...props} icon="fingerprint" />}
          right={(props) => (
            <Switch value={biometricStatus} onValueChange={onToggleSwitch} />
          )}
        />
        <Divider />
        <List.Item
          title="Change Password"
          left={(props) => <List.Icon {...props} icon="lock" />}
          onPress={() => {
            props.navigation.navigate("ChangePassword", { user: user });
          }}
        />
        <Divider />
        <List.Item
          title="Log Out"
          left={(props) => <List.Icon {...props} icon="logout" />}
          onPress={() => {
            resetUserSession();
            props.navigation.navigate("Login");
          }}
        />
        <Divider />
      </View>
    </PaperProvider>
  );
}

export default Settings;
