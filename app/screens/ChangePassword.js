import React from "react";
import { useForm } from "react-hook-form";
import FormInput from "../components/forminput";
import { View } from "react-native";
import { Appbar, Button } from "react-native-paper";
import api from "../../axiosConfig";
import { getBiometricStatus, setBiometrics } from "../auth/auth";
function ChangePassword(props) {
  const { user } = props.route.params;
  const [loading, setLoading] = React.useState(false);
  const onSubmit = (data) => {
    setLoading(true);
    if (
      data.oldpassword === data.newpassword &&
      data.newpassword === data.confirmpassword
    ) {
      setLoading(false);
      alert("New Password cannot be same as the Old Password!");
    } else if (data.newpassword != data.confirmpassword) {
      setLoading(false);
      alert("Confirm Password does not match with New Password!");
    } else
      api
        .post("/techauth/reset", {
          old_password: data.oldpassword,
          new_password: data.newpassword,
          user: user,
        })
        .then(async (res) => {
          setLoading(false);
          alert(res.data.message);
          if (res.status === 200) {
            if (user.first_login) props.navigation.navigate("Tab");
            else {
              if (await getBiometricStatus()) {
                await setBiometrics({
                  client_id: user.client_id,
                  username: user.username,
                  password: data.newpassword,
                });
              }
              props.navigation.navigate("SettingsHome");
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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: "white", flex: 1, padding: 20 }}>
        <FormInput
          control={control}
          name="oldpassword"
          rules={{ required: "Old Password is required" }}
          label="Old Password"
          secureTextEntry
        />
        <FormInput
          control={control}
          name="newpassword"
          rules={{ required: "New Password is required" }}
          label="New Password"
          secureTextEntry
        />
        <FormInput
          control={control}
          name="confirmpassword"
          rules={{ required: "Confirm Password is required" }}
          label="Confirm Password"
          secureTextEntry
        />
        <Button
          loading={loading}
          onPress={handleSubmit(onSubmit)}
          style={{ marginVertical: 30 }}
          mode="contained"
        >
          Change Password
        </Button>
      </View>
    </View>
  );
}

export default ChangePassword;
