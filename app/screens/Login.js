import { useForm } from "react-hook-form";
import { Button, IconButton, Surface, Text } from "react-native-paper";
import FormInput from "../components/forminput";
import { Image, View } from "react-native";
import React from "react";
import {
  setUserSession,
  getBiometrics,
  getBiometricStatus,
  getRegisteredUser,
  resetBiometrics,
} from "../auth/auth";
import api from "../../axiosConfig";
import * as LocalAuthentication from "expo-local-authentication";
import { useIsFocused } from "@react-navigation/native";

function Login(props) {
  let [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [status, setStatus] = React.useState(false);
  const [button, setButton] = React.useState(false);
  const isFocused = useIsFocused();
  React.useEffect(() => {
    async function authenticate() {
      let status = await getBiometricStatus();
      setStatus(status);
      if (status === true) {
        let user = await getRegisteredUser();
        setValue("client_id", user.client_id);
        setValue("username", user.username);
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Authenticate",
          fallbackLabel: "Enter Password",
        });
        setIsAuthenticated(result.success);
        !result.success ? null : onSubmit(await getBiometrics());
      }
    }
    isFocused && authenticate();
  }, [button, isFocused]);

  const [loading, setLoading] = React.useState(false);
  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setLoading(true);
    api
      .post("/techauth/login", { userInfo: data })
      .then(async (res) => {
        setLoading(false);
        console.log(res);
        if (res.status === 200) {
          const user = res.data.message.user;
          const token = res.data.message.token;
          await setUserSession({ user, token });

          console.log(user);

          if (user.first_login) {
            props.navigation.navigate("FirstLogin", { user: user });
          } else {
            props.navigation.navigate("Tab");
          }
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        if (err.response && err.response.data && err.response.data.message)
          alert(err.response.data.message);
        else alert("Server Error");
      });
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 40 }}>
      <Surface
        style={{
          borderRadius: 20,
          padding: 40,
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 30,
          }}
        >
          <Image
            style={{ height: 140 }}
            resizeMode="contain"
            source={require("../assets/logo.png")}
          />
        </View>
        <FormInput
          disabled={status ? true : loading}
          control={control}
          name="client_id"
          rules={{ required: "Client ID is required" }}
          label="Client ID"
        />
        <FormInput
          disabled={status ? true : loading}
          control={control}
          name="username"
          rules={{ required: "Username is required" }}
          label="Username"
        />
        <FormInput
          disabled={loading}
          control={control}
          name="password"
          rules={{ required: "Password is required" }}
          label="Password"
          secureTextEntry
        />
        {status ? (
          <View>
            <View
              style={{
                alignItems: "center",
                paddingVertical: 20,
                flexDirection: "row",
              }}
            >
              <IconButton
                onPress={() => setButton(!button)}
                mode="contained"
                icon="fingerprint"
              />
              <Button
                style={{ flex: 1 }}
                disabled={loading}
                loading={loading}
                onPress={handleSubmit(onSubmit)}
                mode="contained"
              >
                Login
              </Button>
            </View>
            <Button
              onPress={async () => (
                await resetBiometrics(),
                setValue("client_id", ""),
                setValue("username", ""),
                setButton(!button)
              )}
            >
              Login with another account
            </Button>
          </View>
        ) : (
          <View style={{ paddingVertical: 30 }}>
            <Button
              disabled={loading}
              loading={loading}
              onPress={handleSubmit(onSubmit)}
              mode="contained"
            >
              Login
            </Button>
          </View>
        )}
      </Surface>
    </View>
  );
}

export default Login;
