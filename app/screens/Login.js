import { useForm } from "react-hook-form";
import { Button, Card, Surface, Text } from "react-native-paper";
import FormInput from "../components/forminput";
import { Image, View } from "react-native";
import React from "react";

function Login(props) {
  const [loading, setLoading] = React.useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setLoading(true);
    props.navigation.navigate("Tab");
    setLoading(false);
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
          control={control}
          name="client_id"
          rules={{ required: "Client ID is required" }}
          label="Client ID"
        />
        <FormInput
          control={control}
          name="username"
          rules={{ required: "Username is required" }}
          label="Username"
        />
        <FormInput
          control={control}
          name="password"
          rules={{ required: "Password is required" }}
          label="Password"
          secureTextEntry
        />
        <View style={{ paddingVertical: 40 }}>
          <Button
            loading={loading}
            onPress={handleSubmit(onSubmit)}
            mode="contained"
          >
            Login
          </Button>
        </View>
      </Surface>
    </View>
  );
}

export default Login;
