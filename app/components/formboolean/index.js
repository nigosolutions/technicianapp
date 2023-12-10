import React from "react";
import { View, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import {
  HelperText,
  SegmentedButtons,
  Text,
  TextInput,
} from "react-native-paper";

const FormBoolean = ({ control, name, rules = {}, label }) => {
  const [bvalue, setBValue] = React.useState();
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <View style={{ marginVertical: 5, flexDirection: "column" }}>
          <Text>{label}</Text>
          <View
            style={[
              styles.container,
              { borderColor: error ? "red" : "#e8e8e8" },
            ]}
          >
            <SegmentedButtons
              value={bvalue}
              onValueChange={(value) => {
                onChange(value), setBValue(value);
              }}
              buttons={[
                {
                  value: "Yes",
                  label: "Yes",
                },
                {
                  value: "",
                  label: "No",
                },
              ]}
            />
            {bvalue === "" ? (
              <View
                style={{
                  marginVertical: 5,
                  flexDirection: "column",
                }}
              >
                <Text>{"Reason"}</Text>
                <View
                  style={[
                    styles.container,
                    { borderColor: error ? "red" : "#e8e8e8" },
                  ]}
                >
                  <TextInput
                    mode="outlined"
                    outlineColor={error && "red"}
                    value={value}
                    onChangeText={onChange}
                    style={{ fontSize: 15 }}
                    placeholder={"Enter Reason"}
                  />
                  {error && (
                    <HelperText type="error">{"Reason is required"}</HelperText>
                  )}
                </View>
              </View>
            ) : (
              error && (
                <HelperText type="error">{error.message || "Error"}</HelperText>
              )
            )}
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 5,
  },
});

export default FormBoolean;
